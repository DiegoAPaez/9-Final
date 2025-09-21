package com.spring.restaurantmanagementsystem.dto;

import java.time.LocalDateTime;

public record ShiftDto(
        Long id,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Long userId
) {
}
