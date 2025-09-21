package com.spring.restaurantmanagementsystem.model;

import com.spring.restaurantmanagementsystem.enums.AllergenEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "allergens")
@Getter
@Setter
@NoArgsConstructor
public class Allergen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false, unique = true)
    private AllergenEnum name;
}