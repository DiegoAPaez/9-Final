package com.spring.restaurantmanagementsystem.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
        Long id,
        Long tableId,
        Long userId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<OrderItemDto> orderItems,
        BigDecimal totalAmount,
        String orderState,
        Integer customerCount
) {
}
