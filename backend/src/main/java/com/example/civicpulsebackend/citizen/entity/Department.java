package com.example.civicpulsebackend.citizen.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    // Auto-generated skeleton fields
    private String name;
    private String status;
}
