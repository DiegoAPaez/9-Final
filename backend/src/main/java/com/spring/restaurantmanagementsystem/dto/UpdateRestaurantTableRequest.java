package com.spring.restaurantmanagementsystem.dto;

public record UpdateRestaurantTableRequest(
        Integer number,
        Long currentOrderId,
        String tableState
) {
}
