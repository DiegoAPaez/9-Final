package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.PaymentDto;
import com.spring.restaurantmanagementsystem.service.PaymentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/payments")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {
    private final PaymentService paymentService;

    public AdminPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentDto>> getAllPayments() {
        List<PaymentDto> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getPaymentById(@PathVariable Long id) {
        PaymentDto payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByOrderId(@PathVariable Long orderId) {
        List<PaymentDto> payments = paymentService.getPaymentsByOrderId(orderId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByStatus(@PathVariable String status) {
        List<PaymentDto> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<PaymentDto>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<PaymentDto> payments = paymentService.getPaymentsByDateRange(startDate, endDate);
        return ResponseEntity.ok(payments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
