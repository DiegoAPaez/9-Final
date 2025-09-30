package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.PaymentMethodDto;
import com.spring.restaurantmanagementsystem.service.PaymentMethodService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {
    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @GetMapping
    public List<PaymentMethodDto> getAllPaymentMethods() {
        return paymentMethodService.getAllPaymentMethods();
    }
}
