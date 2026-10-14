package com.example.civicpulsebackend.welfare.repository;

import com.example.civicpulsebackend.welfare.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {
}
