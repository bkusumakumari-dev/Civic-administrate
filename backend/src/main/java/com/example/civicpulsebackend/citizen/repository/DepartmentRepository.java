package com.example.civicpulsebackend.citizen.repository;

import com.example.civicpulsebackend.citizen.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {
}
