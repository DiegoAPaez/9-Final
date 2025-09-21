package com.spring.restaurantmanagementsystem.repository;

import com.spring.restaurantmanagementsystem.enums.OrderStateEnum;
import com.spring.restaurantmanagementsystem.model.OrderState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderStateRepository extends JpaRepository<OrderState, Long> {
    boolean existsByName(OrderStateEnum name);
}
