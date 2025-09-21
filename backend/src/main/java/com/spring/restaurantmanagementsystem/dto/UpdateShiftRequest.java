package com.spring.restaurantmanagementsystem.dto;

import java.time.LocalDateTime;

public record UpdateShiftRequest(
        LocalDateTime startDate,
        LocalDateTime endDate,
        Long userId
) {
}
