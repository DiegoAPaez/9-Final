package com.spring.restaurantmanagementsystem.controller;

import com.spring.restaurantmanagementsystem.dto.TableStateDto;
import com.spring.restaurantmanagementsystem.service.TableStateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/table-states")
@CrossOrigin(origins = "*")
public class TableStateController {
    @Autowired
    private TableStateService tableStateService;

    @GetMapping
    public List<TableStateDto> getAllTableStates() {
        return tableStateService.getAllTableStates();
    }
}
