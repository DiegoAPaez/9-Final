package com.spring.restaurantmanagementsystem.repository;

import com.spring.restaurantmanagementsystem.enums.PaymentMethodEnum;
import com.spring.restaurantmanagementsystem.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    boolean existsByName(PaymentMethodEnum name);
}
