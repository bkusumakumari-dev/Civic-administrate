package com.example.civicpulsebackend.user.repository;

import com.example.civicpulsebackend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    List<User> findByRoleOrderByCreatedAtDesc(String role);
}
