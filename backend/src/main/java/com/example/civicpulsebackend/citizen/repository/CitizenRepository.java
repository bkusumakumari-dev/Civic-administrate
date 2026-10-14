package com.example.civicpulsebackend.citizen.repository;

import com.example.civicpulsebackend.citizen.entity.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CitizenRepository extends JpaRepository<Citizen, UUID> {
}
