package com.spring.restaurantmanagementsystem.model;

import com.spring.restaurantmanagementsystem.enums.TableStateEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tables")
@Getter @Setter
@NoArgsConstructor
public class RestaurantTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Integer number;

    @Column(name = "current_order_id")
    private Long currentOrderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "table_state", nullable = false)
    private TableStateEnum tableState;
}
