package com.spring.restaurantmanagementsystem.repository;

import com.spring.restaurantmanagementsystem.model.PaymentStatus;
import com.spring.restaurantmanagementsystem.enums.PaymentStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentStatusRepository extends JpaRepository<PaymentStatus, Long> {
    boolean existsByName(PaymentStatusEnum name);
}
