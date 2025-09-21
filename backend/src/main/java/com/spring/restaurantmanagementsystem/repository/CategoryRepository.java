package com.spring.restaurantmanagementsystem.repository;

import com.spring.restaurantmanagementsystem.model.Category;
import com.spring.restaurantmanagementsystem.enums.CategoryEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByCategory(CategoryEnum category);
}
