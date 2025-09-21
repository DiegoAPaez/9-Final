package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.PaymentMethodDTO;
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

    public List<PaymentMethodDTO> getAllPaymentMethods() {
        return paymentMethodRepository.findAll().stream()
                .map(method -> new PaymentMethodDTO(
                        method.getName().name()
                ))
                .collect(Collectors.toList());
    }
}
