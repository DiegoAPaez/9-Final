package com.spring.restaurantmanagementsystem.service;

import com.spring.restaurantmanagementsystem.dto.CreateRestaurantTableRequest;
import com.spring.restaurantmanagementsystem.dto.RestaurantTableDto;
import com.spring.restaurantmanagementsystem.dto.UpdateRestaurantTableRequest;
import com.spring.restaurantmanagementsystem.enums.TableStateEnum;
import com.spring.restaurantmanagementsystem.exception.ResourceNotFoundException;
import com.spring.restaurantmanagementsystem.model.RestaurantTable;
import com.spring.restaurantmanagementsystem.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RestaurantTableService {
    private final RestaurantTableRepository restaurantTableRepository;

    public RestaurantTableService(RestaurantTableRepository restaurantTableRepository) {
        this.restaurantTableRepository = restaurantTableRepository;
    }

    @Transactional(readOnly = true)
    public List<RestaurantTableDto> getAllTables() {
        return restaurantTableRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RestaurantTableDto getTableById(Long id) {
        RestaurantTable table = restaurantTableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
        return convertToDto(table);
    }

    @Transactional(readOnly = true)
    public RestaurantTableDto getTableByNumber(Integer number) {
        RestaurantTable table = restaurantTableRepository.findByNumber(number)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with number: " + number));
        return convertToDto(table);
    }

    @Transactional(readOnly = true)
    public List<RestaurantTableDto> getTablesByState(String state) {
        try {
            TableStateEnum tableStateEnum = TableStateEnum.valueOf(state.toUpperCase());
            return restaurantTableRepository.findByTableState(tableStateEnum).stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid table state: " + state);
        }
    }

    public RestaurantTableDto createTable(CreateRestaurantTableRequest request) {
        // Check if table number already exists
        if (restaurantTableRepository.existsByNumber(request.number())) {
            throw new IllegalArgumentException("Table with number " + request.number() + " already exists");
        }

        RestaurantTable table = new RestaurantTable();
        setBasicTableFields(table, request.number(), request.tableState());

        RestaurantTable savedTable = restaurantTableRepository.save(table);
        return convertToDto(savedTable);
    }

    public RestaurantTableDto updateTable(Long id, UpdateRestaurantTableRequest request) {
        RestaurantTable table = restaurantTableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        // Check if number is being changed and if new number already exists
        if (!table.getNumber().equals(request.number()) &&
            restaurantTableRepository.existsByNumberAndIdNot(request.number(), id)) {
            throw new IllegalArgumentException("Table with number " + request.number() + " already exists");
        }

        setBasicTableFields(table, request.number(), request.tableState());
        table.setCurrentOrderId(request.currentOrderId());

        RestaurantTable savedTable = restaurantTableRepository.save(table);
        return convertToDto(savedTable);
    }

    public RestaurantTableDto updateTableState(Long id, String state) {
        RestaurantTable table = restaurantTableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        try {
            TableStateEnum tableStateEnum = TableStateEnum.valueOf(state.toUpperCase());
            table.setTableState(tableStateEnum);

            // Clear current order if table becomes available
            if (tableStateEnum == TableStateEnum.AVAILABLE) {
                table.setCurrentOrderId(null);
            }

            RestaurantTable savedTable = restaurantTableRepository.save(table);
            return convertToDto(savedTable);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid table state: " + state);
        }
    }

    public RestaurantTableDto assignOrderToTable(Long tableId, Long orderId) {
        RestaurantTable table = restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableId));

        table.setCurrentOrderId(orderId);
        table.setTableState(TableStateEnum.OCCUPIED);

        RestaurantTable savedTable = restaurantTableRepository.save(table);
        return convertToDto(savedTable);
    }

    public void deleteTable(Long id) {
        RestaurantTable table = restaurantTableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        // Check if table has an active order
        if (table.getCurrentOrderId() != null) {
            throw new IllegalArgumentException("Cannot delete table with an active order");
        }

        restaurantTableRepository.deleteById(id);
    }

    private void setBasicTableFields(RestaurantTable table, Integer number, String state) {
        table.setNumber(number);

        try {
            TableStateEnum tableStateEnum = TableStateEnum.valueOf(state.toUpperCase());
            table.setTableState(tableStateEnum);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid table state: " + state);
        }
    }

    private RestaurantTableDto convertToDto(RestaurantTable table) {
        return new RestaurantTableDto(
                table.getId(),
                table.getNumber(),
                table.getCurrentOrderId(),
                table.getTableState().name()
        );
    }
}
