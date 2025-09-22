package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.AllergenDto;
import com.spring.restaurantmanagementsystem.repository.AllergenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AllergenService {
    private final AllergenRepository allergenRepository;

    public AllergenService(AllergenRepository allergenRepository) {
        this.allergenRepository = allergenRepository;
    }

    public List<AllergenDto> getAllAllergens() {
        return allergenRepository.findAll().stream()
                .map(allergen -> new AllergenDto(
                        allergen.getName().name()
                ))
                .collect(Collectors.toList());
    }
}
