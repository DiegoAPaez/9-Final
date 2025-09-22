package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.TableStateDto;
import com.spring.restaurantmanagementsystem.repository.TableStateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableStateService {
    @Autowired
    private TableStateRepository tableStateRepository;

    public List<TableStateDto> getAllTableStates() {
        return tableStateRepository.findAll().stream()
                .map(tableState -> new TableStateDto(
                        tableState.getTableState().name()
                ))
                .collect(Collectors.toList());
    }
}
