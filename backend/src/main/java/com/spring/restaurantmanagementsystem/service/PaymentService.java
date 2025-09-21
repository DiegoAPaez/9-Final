package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.CreatePaymentRequest;
import com.spring.restaurantmanagementsystem.dto.PaymentDto;
import com.spring.restaurantmanagementsystem.dto.UpdatePaymentRequest;
import com.spring.restaurantmanagementsystem.enums.PaymentMethodEnum;
import com.spring.restaurantmanagementsystem.enums.PaymentStatusEnum;
import com.spring.restaurantmanagementsystem.exception.ResourceNotFoundException;
import com.spring.restaurantmanagementsystem.model.Payment;
import com.spring.restaurantmanagementsystem.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaymentDto getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return convertToDto(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsByStatus(String status) {
        try {
            PaymentStatusEnum paymentStatusEnum = PaymentStatusEnum.valueOf(status.toUpperCase());
            return paymentRepository.findByPaymentStatus(paymentStatusEnum).stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment status: " + status);
        }
    }

    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByCreatedAtBetween(startDate, endDate).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PaymentDto createPayment(CreatePaymentRequest request) {
        Payment payment = new Payment();
        setBasicPaymentFields(payment, request.amount(), request.paymentMethod(), request.paymentStatus());
        payment.setOrderId(request.orderId());

        Payment savedPayment = paymentRepository.save(payment);
        return convertToDto(savedPayment);
    }

    public PaymentDto updatePayment(Long id, UpdatePaymentRequest request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        setBasicPaymentFields(payment, request.amount(), request.paymentMethod(), request.paymentStatus());

        Payment savedPayment = paymentRepository.save(payment);
        return convertToDto(savedPayment);
    }

    public PaymentDto updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        try {
            PaymentStatusEnum paymentStatusEnum = PaymentStatusEnum.valueOf(status.toUpperCase());
            payment.setPaymentStatus(paymentStatusEnum);

            Payment savedPayment = paymentRepository.save(payment);
            return convertToDto(savedPayment);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment status: " + status);
        }
    }

    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Payment not found with id: " + id);
        }
        paymentRepository.deleteById(id);
    }

    private void setBasicPaymentFields(Payment payment, java.math.BigDecimal amount, String paymentMethod, String paymentStatus) {
        payment.setAmount(amount);

        // Set payment method
        try {
            PaymentMethodEnum paymentMethodEnum = PaymentMethodEnum.valueOf(paymentMethod.toUpperCase());
            payment.setPaymentMethod(paymentMethodEnum);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment method: " + paymentMethod);
        }

        // Set payment status
        try {
            PaymentStatusEnum paymentStatusEnum = PaymentStatusEnum.valueOf(paymentStatus.toUpperCase());
            payment.setPaymentStatus(paymentStatusEnum);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment status: " + paymentStatus);
        }
    }

    private PaymentDto convertToDto(Payment payment) {
        return new PaymentDto(
                payment.getId(),
                payment.getAmount(),
                payment.getPaymentMethod().name(),
                payment.getPaymentStatus().name(),
                payment.getOrderId(),
                payment.getCreatedAt()
        );
    }
}
