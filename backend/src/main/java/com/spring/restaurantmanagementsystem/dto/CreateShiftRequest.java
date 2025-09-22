package com.spring.restaurantmanagementsystem.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateShiftRequest(
        @NotNull(message = "Start date is required")
        LocalDateTime startDate,

        @NotNull(message = "End date is required")
        LocalDateTime endDate,

        @NotNull(message = "User ID is required")
        Long userId
) {
}
