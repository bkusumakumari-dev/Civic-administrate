package com.example.civicpulsebackend.welfare.repository;

import com.example.civicpulsebackend.welfare.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AssetRepository extends JpaRepository<Asset, UUID> {
}
