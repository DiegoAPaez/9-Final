package com.spring.restaurantmanagementsystem.dto;

import java.math.BigDecimal;

public record UpdatePaymentRequest(
        BigDecimal amount,
        String paymentMethod,
        String paymentStatus
) {
}
