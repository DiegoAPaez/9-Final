package com.spring.restaurantmanagementsystem.repository;

import com.spring.restaurantmanagementsystem.model.Allergen;
import com.spring.restaurantmanagementsystem.enums.AllergenEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AllergenRepository extends JpaRepository<Allergen, Long> {
    boolean existsByName(AllergenEnum name);
}