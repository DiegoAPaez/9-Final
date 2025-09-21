package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.TableStateDTO;
import com.spring.restaurantmanagementsystem.repository.TableStateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableStateService {
    @Autowired
    private TableStateRepository tableStateRepository;

    public List<TableStateDTO> getAllTableStates() {
        return tableStateRepository.findAll().stream()
                .map(tableState -> new TableStateDTO(
                        tableState.getTableState().name()
                ))
                .collect(Collectors.toList());
    }
}
