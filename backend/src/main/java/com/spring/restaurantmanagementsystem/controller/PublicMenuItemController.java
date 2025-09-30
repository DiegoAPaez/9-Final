package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.MenuItemDto;
import com.spring.restaurantmanagementsystem.service.MenuItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
public class PublicMenuItemController {
    private final MenuItemService menuItemService;

    public PublicMenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems() {
        List<MenuItemDto> menuItems = menuItemService.getAllMenuItems();
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long id) {
        MenuItemDto menuItem = menuItemService.getMenuItemById(id);
        return ResponseEntity.ok(menuItem);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuItemDto>> getMenuItemsByCategory(@PathVariable String category) {
        List<MenuItemDto> menuItems = menuItemService.getMenuItemsByCategory(category);
        return ResponseEntity.ok(menuItems);
    }
}
