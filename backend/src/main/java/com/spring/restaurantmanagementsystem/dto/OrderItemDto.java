package com.spring.restaurantmanagementsystem.dto;

import java.math.BigDecimal;

public record OrderItemDto(
        Long id,
        Long orderId,
        Long menuItemId,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {
}
