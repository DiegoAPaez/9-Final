package com.spring.restaurantmanagementsystem.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentDto(
        Long id,
        BigDecimal amount,
        String paymentMethod,
        String paymentStatus,
        Long orderId,
        LocalDateTime createdAt
) {
}
