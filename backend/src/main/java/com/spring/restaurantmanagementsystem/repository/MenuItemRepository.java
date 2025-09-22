package com.spring.restaurantmanagementsystem.repository;

import com.spring.restaurantmanagementsystem.model.MenuItem;
import com.spring.restaurantmanagementsystem.enums.CategoryEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategory(CategoryEnum category);
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, Long id);
}
