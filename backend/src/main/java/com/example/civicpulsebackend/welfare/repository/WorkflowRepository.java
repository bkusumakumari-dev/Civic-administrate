package com.example.civicpulsebackend.welfare.repository;

import com.example.civicpulsebackend.welfare.entity.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WorkflowRepository extends JpaRepository<Workflow, UUID> {
}
