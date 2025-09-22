package com.spring.restaurantmanagementsystem.dto;

public record CreateRestaurantTableRequest(
        Integer number,
        String tableState
) {
}
