package com.spring.restaurantmanagementsystem.model;

import com.spring.restaurantmanagementsystem.enums.OrderStateEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_state")
@Getter @Setter
@NoArgsConstructor
public class OrderState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false, unique = true)
    private OrderStateEnum name;
}
