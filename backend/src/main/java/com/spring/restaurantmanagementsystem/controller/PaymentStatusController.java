package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.PaymentStatusDto;
import com.spring.restaurantmanagementsystem.service.PaymentStatusService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payment-statuses")
public class PaymentStatusController {
    private final PaymentStatusService paymentStatusService;

    public PaymentStatusController(PaymentStatusService paymentStatusService) {
        this.paymentStatusService = paymentStatusService;
    }

    @GetMapping
    public List<PaymentStatusDto> getAllPaymentStatuses() {
        return paymentStatusService.getAllPaymentStatuses();
    }
}
