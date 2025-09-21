package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.*;
import com.spring.restaurantmanagementsystem.enums.OrderStateEnum;
import com.spring.restaurantmanagementsystem.exception.ResourceNotFoundException;
import com.spring.restaurantmanagementsystem.model.Order;
import com.spring.restaurantmanagementsystem.model.OrderItem;
import com.spring.restaurantmanagementsystem.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemService orderItemService;

    public OrderService(OrderRepository orderRepository, OrderItemService orderItemService) {
        this.orderRepository = orderRepository;
        this.orderItemService = orderItemService;
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return convertToDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByTableId(Long tableId) {
        return orderRepository.findByTableId(tableId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OrderDto createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setTableId(request.tableId());
        order.setUserId(request.userId());
        order.setCustomerCount(request.customerCount());

        // Set order state
        try {
            OrderStateEnum orderStateEnum = OrderStateEnum.valueOf(request.orderState().toUpperCase());
            order.setOrderState(orderStateEnum);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order state: " + request.orderState());
        }

        // Initialize with zero total amount (will be calculated when order items are added)
        order.setTotalAmount(BigDecimal.ZERO);

        Order savedOrder = orderRepository.save(order);

        // Process order items if provided
        if (request.orderItems() != null && !request.orderItems().isEmpty()) {
            for (CreateOrderItemRequest orderItemRequest : request.orderItems()) {
                orderItemService.createOrderItem(savedOrder.getId(), orderItemRequest);
            }
            // Recalculate total after adding all items
            calculateAndUpdateTotalAmount(savedOrder.getId());
            // Fetch updated order with new total
            savedOrder = orderRepository.findById(savedOrder.getId()).orElse(savedOrder);
        }

        return convertToDto(savedOrder);
    }

    public OrderDto updateOrder(Long id, UpdateOrderRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        order.setTableId(request.tableId());
        order.setCustomerCount(request.customerCount());

        // Update order state
        try {
            OrderStateEnum orderStateEnum = OrderStateEnum.valueOf(request.orderState().toUpperCase());
            order.setOrderState(orderStateEnum);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order state: " + request.orderState());
        }

        Order savedOrder = orderRepository.save(order);

        // Process order items if provided
        if (request.orderItems() != null && !request.orderItems().isEmpty()) {
            // Remove existing order items
            orderItemService.deleteOrderItemsByOrderId(id);

            // Add new order items
            for (UpdateOrderItemRequest orderItemRequest : request.orderItems()) {
                orderItemService.createOrderItem(savedOrder.getId(), orderItemRequest);
            }

            // Recalculate total after updating all items
            calculateAndUpdateTotalAmount(savedOrder.getId());
            // Fetch updated order with new total
            savedOrder = orderRepository.findById(savedOrder.getId()).orElse(savedOrder);
        }

        return convertToDto(savedOrder);
    }

    public OrderDto updateOrderState(Long id, String state) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        try {
            OrderStateEnum orderStateEnum = OrderStateEnum.valueOf(state.toUpperCase());
            order.setOrderState(orderStateEnum);

            Order savedOrder = orderRepository.save(order);
            return convertToDto(savedOrder);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order state: " + state);
        }
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }

    // Business logic method to calculate total amount from order items
    public void calculateAndUpdateTotalAmount(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(totalAmount);
        orderRepository.save(order);
    }

    private OrderDto convertToDto(Order order) {
        // Get order items for this order using OrderItemService
        List<OrderItemDto> orderItems = orderItemService.getOrderItemsByOrderId(order.getId());

        return new OrderDto(
                order.getId(),
                order.getTableId(),
                order.getUserId(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                orderItems,
                order.getTotalAmount(),
                order.getOrderState().name(),
                order.getCustomerCount()
        );
    }
}
