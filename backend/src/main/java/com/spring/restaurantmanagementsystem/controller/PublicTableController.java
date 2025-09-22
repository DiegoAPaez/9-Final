package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.RestaurantTableDto;
import com.spring.restaurantmanagementsystem.service.RestaurantTableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class PublicTableController {
    private final RestaurantTableService restaurantTableService;

    public PublicTableController(RestaurantTableService restaurantTableService) {
        this.restaurantTableService = restaurantTableService;
    }

    @GetMapping
    public ResponseEntity<List<RestaurantTableDto>> getAllTables() {
        List<RestaurantTableDto> tables = restaurantTableService.getAllTables();
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTableDto> getTableById(@PathVariable Long id) {
        RestaurantTableDto table = restaurantTableService.getTableById(id);
        return ResponseEntity.ok(table);
    }

    @GetMapping("/number/{number}")
    public ResponseEntity<RestaurantTableDto> getTableByNumber(@PathVariable Integer number) {
        RestaurantTableDto table = restaurantTableService.getTableByNumber(number);
        return ResponseEntity.ok(table);
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<List<RestaurantTableDto>> getTablesByState(@PathVariable String state) {
        List<RestaurantTableDto> tables = restaurantTableService.getTablesByState(state);
        return ResponseEntity.ok(tables);
    }

    @PatchMapping("/{id}/state")
    public ResponseEntity<RestaurantTableDto> updateTableState(@PathVariable Long id, @RequestParam String state) {
        RestaurantTableDto updatedTable = restaurantTableService.updateTableState(id, state);
        return ResponseEntity.ok(updatedTable);
    }

    @PatchMapping("/{tableId}/assign-order/{orderId}")
    public ResponseEntity<RestaurantTableDto> assignOrderToTable(@PathVariable Long tableId, @PathVariable Long orderId) {
        RestaurantTableDto updatedTable = restaurantTableService.assignOrderToTable(tableId, orderId);
        return ResponseEntity.ok(updatedTable);
    }
}
