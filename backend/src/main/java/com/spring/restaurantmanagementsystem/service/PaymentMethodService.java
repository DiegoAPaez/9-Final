package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.PaymentMethodDto;
import com.spring.restaurantmanagementsystem.repository.PaymentMethodRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentMethodService {
    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodService(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public List<PaymentMethodDto> getAllPaymentMethods() {
        return paymentMethodRepository.findAll().stream()
                .map(method -> new PaymentMethodDto(
                        method.getName().name()
                ))
                .collect(Collectors.toList());
    }
}
