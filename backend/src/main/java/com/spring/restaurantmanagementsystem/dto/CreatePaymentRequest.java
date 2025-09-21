package com.spring.restaurantmanagementsystem.dto;

import java.math.BigDecimal;

public record CreatePaymentRequest(
        BigDecimal amount,
        String paymentMethod,
        String paymentStatus,
        Long orderId
) {
}
