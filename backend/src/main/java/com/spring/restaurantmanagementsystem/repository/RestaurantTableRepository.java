package com.spring.restaurantmanagementsystem.repository;

import com.spring.restaurantmanagementsystem.model.RestaurantTable;
import com.spring.restaurantmanagementsystem.enums.TableStateEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    Optional<RestaurantTable> findByNumber(Integer number);
    List<RestaurantTable> findByTableState(TableStateEnum tableState);
    List<RestaurantTable> findByCurrentOrderId(Long currentOrderId);
    boolean existsByNumber(Integer number);
    boolean existsByNumberAndIdNot(Integer number, Long id);
}
