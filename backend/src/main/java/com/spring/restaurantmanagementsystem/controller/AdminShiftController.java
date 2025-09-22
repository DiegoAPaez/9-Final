package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.CreateShiftRequest;
import com.spring.restaurantmanagementsystem.dto.ShiftDto;
import com.spring.restaurantmanagementsystem.dto.UpdateShiftRequest;
import com.spring.restaurantmanagementsystem.service.ShiftService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/shifts")
@PreAuthorize("hasRole('ADMIN')")
public class AdminShiftController {
    private final ShiftService shiftService;

    public AdminShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @GetMapping
    public ResponseEntity<List<ShiftDto>> getAllShifts() {
        List<ShiftDto> shifts = shiftService.getAllShifts();
        return ResponseEntity.ok(shifts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftDto> getShiftById(@PathVariable Long id) {
        ShiftDto shift = shiftService.getShiftById(id);
        return ResponseEntity.ok(shift);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShiftDto>> getShiftsByUserId(@PathVariable Long userId) {
        List<ShiftDto> shifts = shiftService.getShiftsByUserId(userId);
        return ResponseEntity.ok(shifts);
    }

    @PostMapping
    public ResponseEntity<ShiftDto> createShift(@Valid @RequestBody CreateShiftRequest request) {
        ShiftDto newShift = shiftService.createShift(request);
        return new ResponseEntity<>(newShift, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShiftDto> updateShift(@PathVariable Long id,
                                                @Valid @RequestBody UpdateShiftRequest request) {
        ShiftDto updatedShift = shiftService.updateShift(id, request);
        return ResponseEntity.ok(updatedShift);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        shiftService.deleteShift(id);
        return ResponseEntity.noContent().build();
    }
}
