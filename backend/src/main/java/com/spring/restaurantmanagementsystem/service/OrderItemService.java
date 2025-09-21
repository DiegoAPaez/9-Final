package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.CreateOrderItemRequest;
import com.spring.restaurantmanagementsystem.dto.OrderItemDto;
import com.spring.restaurantmanagementsystem.dto.UpdateOrderItemRequest;
import com.spring.restaurantmanagementsystem.exception.ResourceNotFoundException;
import com.spring.restaurantmanagementsystem.model.Order;
import com.spring.restaurantmanagementsystem.model.OrderItem;
import com.spring.restaurantmanagementsystem.repository.OrderItemRepository;
import com.spring.restaurantmanagementsystem.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderItemService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;

    public OrderItemService(OrderItemRepository orderItemRepository, OrderRepository orderRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderItemDto> getAllOrderItems() {
        return orderItemRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderItemDto getOrderItemById(Long id) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem not found with id: " + id));
        return convertToDto(orderItem);
    }

    @Transactional(readOnly = true)
    public List<OrderItemDto> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderItemDto> getOrderItemsByMenuItemId(Long menuItemId) {
        return orderItemRepository.findByMenuItemId(menuItemId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OrderItemDto createOrderItem(Long orderId, CreateOrderItemRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        setOrderItemFields(orderItem, request.menuItemId(), request.quantity(), request.unitPrice());

        OrderItem savedOrderItem = orderItemRepository.save(orderItem);

        // Recalculate order total
        updateOrderTotal(order);

        return convertToDto(savedOrderItem);
    }

    // Overloaded method to handle UpdateOrderItemRequest
    public OrderItemDto createOrderItem(Long orderId, UpdateOrderItemRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        setOrderItemFields(orderItem, request.menuItemId(), request.quantity(), request.unitPrice());

        OrderItem savedOrderItem = orderItemRepository.save(orderItem);

        // Recalculate order total
        updateOrderTotal(order);

        return convertToDto(savedOrderItem);
    }

    public OrderItemDto updateOrderItem(Long id, UpdateOrderItemRequest request) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem not found with id: " + id));

        setOrderItemFields(orderItem, request.menuItemId(), request.quantity(), request.unitPrice());

        OrderItem savedOrderItem = orderItemRepository.save(orderItem);

        // Recalculate order total
        updateOrderTotal(orderItem.getOrder());

        return convertToDto(savedOrderItem);
    }

    public void deleteOrderItem(Long id) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem not found with id: " + id));

        Order order = orderItem.getOrder();
        orderItemRepository.deleteById(id);

        // Recalculate order total after deletion
        updateOrderTotal(order);
    }

    public void deleteOrderItemsByOrderId(Long orderId) {
        orderItemRepository.deleteByOrderId(orderId);
    }

    // Helper method to set order item fields and calculate subtotal
    private void setOrderItemFields(OrderItem orderItem, Long menuItemId, Integer quantity, BigDecimal unitPrice) {
        orderItem.setMenuItemId(menuItemId);
        orderItem.setQuantity(quantity);
        orderItem.setUnitPrice(unitPrice);

        // Calculate subtotal
        BigDecimal subtotal = unitPrice.multiply(new BigDecimal(quantity));
        orderItem.setSubtotal(subtotal);
    }

    // Business logic method to update order total amount
    private void updateOrderTotal(Order order) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
        BigDecimal totalAmount = orderItems.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(totalAmount);
        orderRepository.save(order);
    }

    private OrderItemDto convertToDto(OrderItem orderItem) {
        return new OrderItemDto(
                orderItem.getId(),
                orderItem.getOrder().getId(),
                orderItem.getMenuItemId(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getSubtotal()
        );
    }
}
