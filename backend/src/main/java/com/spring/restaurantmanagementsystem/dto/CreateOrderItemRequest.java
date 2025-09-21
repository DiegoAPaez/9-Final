package com.spring.restaurantmanagementsystem.dto;

import java.math.BigDecimal;

public record CreateOrderItemRequest(
        Long menuItemId,
        Integer quantity,
        BigDecimal unitPrice
) {
}
