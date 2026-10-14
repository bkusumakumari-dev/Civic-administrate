package com.example.civicpulsebackend.certificate.repository;

import com.example.civicpulsebackend.certificate.entity.Permit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PermitRepository extends JpaRepository<Permit, UUID> {
}
