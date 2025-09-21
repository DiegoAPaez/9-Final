package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.OrderStateDto;
import com.spring.restaurantmanagementsystem.repository.OrderStateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderStateService {
    private final OrderStateRepository orderStateRepository;

    public OrderStateService(OrderStateRepository orderStateRepository) {
        this.orderStateRepository = orderStateRepository;
    }

    public List<OrderStateDto> getAllOrderStates() {
        return orderStateRepository.findAll().stream()
                .map(orderState -> new OrderStateDto(
                        orderState.getName().name()
                ))
                .collect(Collectors.toList());
    }
}
