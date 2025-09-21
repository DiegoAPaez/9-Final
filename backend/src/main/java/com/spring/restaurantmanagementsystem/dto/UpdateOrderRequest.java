package com.spring.restaurantmanagementsystem.dto;

import java.util.List;

public record UpdateOrderRequest(
        Long tableId,
        List<UpdateOrderItemRequest> orderItems,
        String orderState,
        Integer customerCount
) {
}
