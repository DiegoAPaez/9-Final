package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.OrderStateDto;
import com.spring.restaurantmanagementsystem.service.OrderStateService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/order-states")
public class OrderStateController {
    private final OrderStateService orderStateService;

    public OrderStateController(OrderStateService orderStateService) {
        this.orderStateService = orderStateService;
    }

    @GetMapping
    public List<OrderStateDto> getAllOrderStates() {
        return orderStateService.getAllOrderStates();
    }
}
