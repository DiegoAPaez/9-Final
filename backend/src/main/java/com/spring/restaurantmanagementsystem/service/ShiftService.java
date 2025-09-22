package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.CreateShiftRequest;
import com.spring.restaurantmanagementsystem.dto.ShiftDto;
import com.spring.restaurantmanagementsystem.dto.UpdateShiftRequest;
import com.spring.restaurantmanagementsystem.exception.ResourceNotFoundException;
import com.spring.restaurantmanagementsystem.model.Shift;
import com.spring.restaurantmanagementsystem.model.User;
import com.spring.restaurantmanagementsystem.repository.ShiftRepository;
import com.spring.restaurantmanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShiftService {
    private final ShiftRepository shiftRepository;
    private final UserRepository userRepository;

    public ShiftService(ShiftRepository shiftRepository, UserRepository userRepository) {
        this.shiftRepository = shiftRepository;
        this.userRepository = userRepository;
    }

    public List<ShiftDto> getAllShifts() {
        return shiftRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ShiftDto getShiftById(Long id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + id));
        return convertToDto(shift);
    }

    public List<ShiftDto> getShiftsByUserId(Long userId) {
        // Verify user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        return shiftRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShiftDto createShift(CreateShiftRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userId()));

        Shift shift = new Shift();
        shift.setStartDate(request.startDate());
        shift.setEndDate(request.endDate());
        shift.setUser(user);

        Shift savedShift = shiftRepository.save(shift);
        return convertToDto(savedShift);
    }

    @Transactional
    public ShiftDto updateShift(Long id, UpdateShiftRequest request) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + id));

        if (request.startDate() != null) {
            shift.setStartDate(request.startDate());
        }
        if (request.endDate() != null) {
            shift.setEndDate(request.endDate());
        }
        if (request.userId() != null) {
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userId()));
            shift.setUser(user);
        }

        Shift updatedShift = shiftRepository.save(shift);
        return convertToDto(updatedShift);
    }

    @Transactional
    public void deleteShift(Long id) {
        if (!shiftRepository.existsById(id)) {
            throw new ResourceNotFoundException("Shift not found with id: " + id);
        }
        shiftRepository.deleteById(id);
    }

    private ShiftDto convertToDto(Shift shift) {
        return new ShiftDto(
                shift.getId(),
                shift.getStartDate(),
                shift.getEndDate(),
                shift.getUser().getId()
        );
    }
}
