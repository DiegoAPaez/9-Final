package com.spring.restaurantmanagementsystem.repository;

import com.spring.restaurantmanagementsystem.enums.TableStateEnum;
import com.spring.restaurantmanagementsystem.model.TableState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TableStateRepository extends JpaRepository<TableState, Long> {
    boolean existsByTableState(TableStateEnum tableState);
}
