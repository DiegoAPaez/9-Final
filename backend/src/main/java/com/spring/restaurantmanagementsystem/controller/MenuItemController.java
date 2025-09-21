package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.CreateMenuItemRequest;
import com.spring.restaurantmanagementsystem.dto.MenuItemDto;
import com.spring.restaurantmanagementsystem.dto.UpdateMenuItemRequest;
import com.spring.restaurantmanagementsystem.service.MenuItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menu-items")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class MenuItemController {
    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
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

    @PostMapping
    public ResponseEntity<MenuItemDto> createMenuItem(@RequestBody CreateMenuItemRequest request) {
        MenuItemDto createdMenuItem = menuItemService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMenuItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItemDto> updateMenuItem(@PathVariable Long id, @RequestBody UpdateMenuItemRequest request) {
        MenuItemDto updatedMenuItem = menuItemService.updateMenuItem(id, request);
        return ResponseEntity.ok(updatedMenuItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
