package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.ShiftDto;
import com.spring.restaurantmanagementsystem.model.User;
import com.spring.restaurantmanagementsystem.service.ShiftService;
import com.spring.restaurantmanagementsystem.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@PreAuthorize("hasRole('CASHIER') or hasRole('WAITER')")
public class ShiftController {
    private final ShiftService shiftService;
    private final UserService userService;

    public ShiftController(ShiftService shiftService, UserService userService) {
        this.shiftService = shiftService;
        this.userService = userService;
    }

    @GetMapping("/my-shifts")
    public ResponseEntity<List<ShiftDto>> getMyShifts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        List<ShiftDto> shifts = shiftService.getShiftsByUserId(user.getId());
        return ResponseEntity.ok(shifts);
    }
}
