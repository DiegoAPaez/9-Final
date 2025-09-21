package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.AllergenDto;
import com.spring.restaurantmanagementsystem.service.AllergenService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/allergens")
@CrossOrigin(origins = "*")
public class AllergenController {
    private final AllergenService allergenService;

    public AllergenController(AllergenService allergenService) {
        this.allergenService = allergenService;
    }

    @GetMapping
    public List<AllergenDto> getAllAllergens() {
        return allergenService.getAllAllergens();
    }
}
