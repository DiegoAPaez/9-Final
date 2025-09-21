package com.spring.restaurantmanagementsystem.config;

import com.spring.restaurantmanagementsystem.enums.*;
import com.spring.restaurantmanagementsystem.model.*;
import com.spring.restaurantmanagementsystem.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AllergenRepository allergenRepository;
    private final CategoryRepository categoryRepository;
    private final OrderStateRepository orderStateRepository;
    private final TableStateRepository tableStateRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentStatusRepository paymentStatusRepository;

    @Value("${DEF_USER}")
    private String defaultUser;
    @Value("${DEF_PASS}")
    private String defaultPassword;
    @Value("${DEF_EMAIL}")
    private String defaultEmail;

    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, AllergenRepository allergenRepository, CategoryRepository categoryRepository, OrderStateRepository orderStateRepository, TableStateRepository tableStateRepository, PaymentMethodRepository paymentMethodRepository, PaymentStatusRepository paymentStatusRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.allergenRepository = allergenRepository;
        this.categoryRepository = categoryRepository;
        this.orderStateRepository = orderStateRepository;
        this.tableStateRepository = tableStateRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.paymentStatusRepository = paymentStatusRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        initializeRoles();
        initializeAllergens();
        initializeCategories();
        initializeOrderStates();
        initializeTableStates();
        initializePaymentMethods();
        initializePaymentStatuses();
        initializeDefaultAdmin();
    }

    private void initializeRoles() {
        Arrays.stream(RoleEnum.values())
                .forEach(roleName -> {
                    if (!roleRepository.existsByName(roleName)) {
                        Role role = new Role();
                        role.setName(roleName);
                        roleRepository.save(role);
                    }
                });
    }

    private void initializeDefaultAdmin() {
        boolean adminExists = userRepository.existsByRoles_Name(RoleEnum.ADMIN);

        if (!adminExists) {
            Role adminRole = roleRepository.findByName(RoleEnum.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Admin role is not found."));
            User adminUser = new User();
            adminUser.setUsername(defaultUser);
            adminUser.setEmail(defaultEmail);
            adminUser.setPassword(passwordEncoder.encode(defaultPassword));
            adminUser.setRoles(Set.of(adminRole));

            userRepository.save(adminUser);
        }
    }

    private void initializeAllergens() {
        Arrays.stream(AllergenEnum.values())
                .forEach(allergenName -> {
                    if (!allergenRepository.existsByName(allergenName)) {
                        Allergen allergen = new Allergen();
                        allergen.setName(allergenName);
                        allergenRepository.save(allergen);
                    }
                });
    }

    private void initializeCategories() {
        Arrays.stream(CategoryEnum.values())
                .forEach(categoryEnum -> {
                    if (!categoryRepository.existsByCategory(categoryEnum)) {
                        Category category = new Category();
                        category.setCategory(categoryEnum);
                        categoryRepository.save(category);
                    }
                });
    }

    private void initializeOrderStates() {
        Arrays.stream(OrderStateEnum.values())
                .forEach(orderStateName -> {
                    if(!orderStateRepository.existsByName(orderStateName)) {
                        OrderState orderState = new OrderState();
                        orderState.setName(orderStateName);
                        orderStateRepository.save(orderState);
                    }
                });
    }

    private void initializeTableStates() {
        Arrays.stream(TableStateEnum.values())
                .forEach(tableStateName -> {
                    if(!tableStateRepository.existsByTableState(tableStateName)) {
                        TableState tableState = new TableState();
                        tableState.setTableState(tableStateName);
                        tableStateRepository.save(tableState);
                    }
                });
    }

    private void initializePaymentMethods() {
        Arrays.stream(PaymentMethodEnum.values())
                .forEach(paymentMethodEnum -> {
                    if(!paymentMethodRepository.existsByName(paymentMethodEnum)) {
                        PaymentMethod paymentMethod = new PaymentMethod();
                        paymentMethod.setName(paymentMethodEnum);
                        paymentMethodRepository.save(paymentMethod);
                    }
                });
    }

    private void initializePaymentStatuses() {
        Arrays.stream(PaymentStatusEnum.values())
                .forEach(paymentStatusEnum -> {
                    if(!paymentStatusRepository.existsByName(paymentStatusEnum)) {
                        PaymentStatus paymentStatus = new PaymentStatus();
                        paymentStatus.setName(paymentStatusEnum);
                        paymentStatusRepository.save(paymentStatus);
                    }
                });
    }
}