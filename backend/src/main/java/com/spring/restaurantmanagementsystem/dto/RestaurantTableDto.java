package com.spring.restaurantmanagementsystem.dto;

public record RestaurantTableDto(
        Long id,
        Integer number,
        Long currentOrderId,
        String tableState
) {
}
