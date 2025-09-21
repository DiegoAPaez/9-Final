package com.spring.restaurantmanagementsystem.dto;

import java.math.BigDecimal;

public record UpdateOrderItemRequest(
        Long menuItemId,
        Integer quantity,
        BigDecimal unitPrice
) {
}
