package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.CreateRestaurantTableRequest;
import com.spring.restaurantmanagementsystem.dto.RestaurantTableDto;
import com.spring.restaurantmanagementsystem.dto.UpdateRestaurantTableRequest;
import com.spring.restaurantmanagementsystem.service.RestaurantTableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tables")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class RestaurantTableController {
    private final RestaurantTableService restaurantTableService;

    public RestaurantTableController(RestaurantTableService restaurantTableService) {
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

    @PostMapping
    public ResponseEntity<RestaurantTableDto> createTable(@RequestBody CreateRestaurantTableRequest request) {
        RestaurantTableDto createdTable = restaurantTableService.createTable(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTable);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantTableDto> updateTable(@PathVariable Long id, @RequestBody UpdateRestaurantTableRequest request) {
        RestaurantTableDto updatedTable = restaurantTableService.updateTable(id, request);
        return ResponseEntity.ok(updatedTable);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        restaurantTableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}
