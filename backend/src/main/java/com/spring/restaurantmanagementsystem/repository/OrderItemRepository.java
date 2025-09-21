package com.spring.restaurantmanagementsystem.repository;

import com.spring.restaurantmanagementsystem.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
    List<OrderItem> findByMenuItemId(Long menuItemId);
    void deleteByOrderId(Long orderId);
}
