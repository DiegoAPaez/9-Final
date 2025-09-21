package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.PaymentStatusDto;
import com.spring.restaurantmanagementsystem.repository.PaymentStatusRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentStatusService {
    private final PaymentStatusRepository paymentStatusRepository;

    public PaymentStatusService(PaymentStatusRepository paymentStatusRepository) {
        this.paymentStatusRepository = paymentStatusRepository;
    }

    public List<PaymentStatusDto> getAllPaymentStatuses() {
        return paymentStatusRepository.findAll().stream()
                .map(paymentStatus -> new PaymentStatusDto(
                        paymentStatus.getName().name()
                ))
                .collect(Collectors.toList());
    }
}
