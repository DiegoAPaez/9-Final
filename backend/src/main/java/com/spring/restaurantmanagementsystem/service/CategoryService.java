package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.CategoryDto;
import com.spring.restaurantmanagementsystem.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryDto(
                        category.getCategory().name()
                ))
                .collect(Collectors.toList());
    }
}
