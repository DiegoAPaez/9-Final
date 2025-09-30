package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.CreateOrderItemRequest;
import com.spring.restaurantmanagementsystem.dto.OrderItemDto;
import com.spring.restaurantmanagementsystem.dto.UpdateOrderItemRequest;
import com.spring.restaurantmanagementsystem.service.OrderItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {
    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @GetMapping
    public ResponseEntity<List<OrderItemDto>> getAllOrderItems() {
        List<OrderItemDto> orderItems = orderItemService.getAllOrderItems();
        return ResponseEntity.ok(orderItems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItemDto> getOrderItemById(@PathVariable Long id) {
        OrderItemDto orderItem = orderItemService.getOrderItemById(id);
        return ResponseEntity.ok(orderItem);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItemDto>> getOrderItemsByOrderId(@PathVariable Long orderId) {
        List<OrderItemDto> orderItems = orderItemService.getOrderItemsByOrderId(orderId);
        return ResponseEntity.ok(orderItems);
    }

    @GetMapping("/menu-item/{menuItemId}")
    public ResponseEntity<List<OrderItemDto>> getOrderItemsByMenuItemId(@PathVariable Long menuItemId) {
        List<OrderItemDto> orderItems = orderItemService.getOrderItemsByMenuItemId(menuItemId);
        return ResponseEntity.ok(orderItems);
    }

    @PostMapping("/order/{orderId}")
    public ResponseEntity<OrderItemDto> createOrderItem(@PathVariable Long orderId, @RequestBody CreateOrderItemRequest request) {
        OrderItemDto createdOrderItem = orderItemService.createOrderItem(orderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrderItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItemDto> updateOrderItem(@PathVariable Long id, @RequestBody UpdateOrderItemRequest request) {
        OrderItemDto updatedOrderItem = orderItemService.updateOrderItem(id, request);
        return ResponseEntity.ok(updatedOrderItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/order/{orderId}")
    public ResponseEntity<Void> deleteOrderItemsByOrderId(@PathVariable Long orderId) {
        orderItemService.deleteOrderItemsByOrderId(orderId);
        return ResponseEntity.noContent().build();
    }
}
