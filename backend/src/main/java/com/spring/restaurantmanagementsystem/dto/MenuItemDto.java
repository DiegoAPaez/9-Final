package com.spring.restaurantmanagementsystem.dto;

import java.math.BigDecimal;
import java.util.Set;

public record MenuItemDto(
        Long id,
        String name,
        String description,
        Set<String> allergens,
        BigDecimal price,
        String category
) {
}
