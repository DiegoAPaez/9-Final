package com.spring.restaurantmanagementsystem.dto;

import java.util.List;

public record CreateOrderRequest(
        Long tableId,
        Long userId,
        List<CreateOrderItemRequest> orderItems,
        String orderState,
        Integer customerCount
) {
}
