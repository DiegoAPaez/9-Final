package com.spring.restaurantmanagementsystem.dto;

import java.math.BigDecimal;
import java.util.Set;

public record UpdateMenuItemRequest(
        String name,
        String description,
        Set<Long> allergenIds,
        BigDecimal price,
        String category
) {
}
