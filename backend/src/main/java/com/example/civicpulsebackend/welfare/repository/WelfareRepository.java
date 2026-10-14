package com.example.civicpulsebackend.welfare.repository;

import com.example.civicpulsebackend.welfare.entity.Welfare;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WelfareRepository extends JpaRepository<Welfare, UUID> {
}
