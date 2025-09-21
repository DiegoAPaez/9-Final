package com.spring.restaurantmanagementsystem.repository;

import com.spring.restaurantmanagementsystem.model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByUserId(Long userId);
}
