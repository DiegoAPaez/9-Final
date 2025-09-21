package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.CreateMenuItemRequest;
import com.spring.restaurantmanagementsystem.dto.MenuItemDto;
import com.spring.restaurantmanagementsystem.dto.UpdateMenuItemRequest;
import com.spring.restaurantmanagementsystem.enums.CategoryEnum;
import com.spring.restaurantmanagementsystem.exception.ResourceNotFoundException;
import com.spring.restaurantmanagementsystem.model.Allergen;
import com.spring.restaurantmanagementsystem.model.MenuItem;
import com.spring.restaurantmanagementsystem.repository.AllergenRepository;
import com.spring.restaurantmanagementsystem.repository.MenuItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class MenuItemService {
    private final MenuItemRepository menuItemRepository;
    private final AllergenRepository allergenRepository;

    public MenuItemService(MenuItemRepository menuItemRepository, AllergenRepository allergenRepository) {
        this.menuItemRepository = menuItemRepository;
        this.allergenRepository = allergenRepository;
    }

    @Transactional(readOnly = true)
    public List<MenuItemDto> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MenuItemDto getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem not found with id: " + id));
        return convertToDto(menuItem);
    }

    @Transactional(readOnly = true)
    public List<MenuItemDto> getMenuItemsByCategory(String category) {
        try {
            CategoryEnum categoryEnum = CategoryEnum.valueOf(category.toUpperCase());
            return menuItemRepository.findByCategory(categoryEnum).stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category: " + category);
        }
    }

    public MenuItemDto createMenuItem(CreateMenuItemRequest request) {
        // Check if menu item name already exists
        if (menuItemRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Menu item with name '" + request.name() + "' already exists");
        }

        MenuItem menuItem = new MenuItem();
        setBasicMenuItemFields(menuItem, request.name(), request.description(), request.price(), request.category());
        setMenuItemAllergens(menuItem, request.allergenIds());

        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return convertToDto(savedMenuItem);
    }

    public MenuItemDto updateMenuItem(Long id, UpdateMenuItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem not found with id: " + id));

        // Check if name is being changed and if new name already exists
        if (!menuItem.getName().equals(request.name()) &&
            menuItemRepository.existsByNameAndIdNot(request.name(), id)) {
            throw new IllegalArgumentException("Menu item with name '" + request.name() + "' already exists");
        }

        setBasicMenuItemFields(menuItem, request.name(), request.description(), request.price(), request.category());

        // Clear existing allergens before setting new ones
        menuItem.getAllergens().clear();
        setMenuItemAllergens(menuItem, request.allergenIds());

        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return convertToDto(savedMenuItem);
    }

    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("MenuItem not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    private void setBasicMenuItemFields(MenuItem menuItem, String name, String description,
                                       java.math.BigDecimal price, String category) {
        menuItem.setName(name);
        menuItem.setDescription(description);
        menuItem.setPrice(price);

        // Set category
        try {
            CategoryEnum categoryEnum = CategoryEnum.valueOf(category.toUpperCase());
            menuItem.setCategory(categoryEnum);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category: " + category);
        }
    }

    private void setMenuItemAllergens(MenuItem menuItem, Set<Long> allergenIds) {
        if (allergenIds != null && !allergenIds.isEmpty()) {
            Set<Allergen> allergens = new HashSet<>();
            for (Long allergenId : allergenIds) {
                Allergen allergen = allergenRepository.findById(allergenId)
                        .orElseThrow(() -> new ResourceNotFoundException("Allergen not found with id: " + allergenId));
                allergens.add(allergen);
            }
            menuItem.setAllergens(allergens);
        }
    }

    private MenuItemDto convertToDto(MenuItem menuItem) {
        Set<String> allergenNames = menuItem.getAllergens().stream()
                .map(allergen -> allergen.getName().name())
                .collect(Collectors.toSet());

        return new MenuItemDto(
                menuItem.getId(),
                menuItem.getName(),
                menuItem.getDescription(),
                allergenNames,
                menuItem.getPrice(),
                menuItem.getCategory().name()
        );
    }
}
