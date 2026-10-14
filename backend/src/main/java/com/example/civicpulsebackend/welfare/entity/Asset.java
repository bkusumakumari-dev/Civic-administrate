package com.example.civicpulsebackend.welfare.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
public class Asset {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    // Auto-generated skeleton fields
    private String name;
    private String status;
}
