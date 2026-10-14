package com.example.civicpulsebackend.user.service;

import com.example.civicpulsebackend.user.dto.ProfileUpdateRequest;
import com.example.civicpulsebackend.user.dto.RegisterRequest;
import com.example.civicpulsebackend.user.dto.UserResponse;
import com.example.civicpulsebackend.user.entity.User;
import com.example.civicpulsebackend.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Demo-grade authentication: validates credentials and hashes passwords.
 * This is NOT production authentication (no tokens/SSO) and is clearly a
 * student-project demonstration.
 */
@Service
public class AuthService {

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_CANDIDATE = "CANDIDATE";

    private final UserRepository repository;

    public AuthService(UserRepository repository) {
        this.repository = repository;
    }

    public Optional<User> authenticate(String username, String password) {
        return repository.findByUsername(username)
                .filter(user -> PasswordUtil.matches(password, user.getPasswordHash()));
    }

    public User register(RegisterRequest request) {
        if (repository.existsByUsername(request.username())) {
            throw new IllegalStateException("Username already taken");
        }
        User user = new User();
        user.setUsername(request.username().trim());
        user.setPasswordHash(PasswordUtil.hash(request.password()));
        user.setRole(ROLE_CANDIDATE);
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setPreferredLanguage(request.preferredLanguage() == null ? "en" : request.preferredLanguage());
        user.setCreatedAt(Instant.now());
        return repository.save(user);
    }

    public User updateProfile(UUID id, ProfileUpdateRequest request) {
        User user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (request.fullName() != null) {
            user.setFullName(request.fullName());
        }
        if (request.email() != null) {
            user.setEmail(request.email());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }
        if (request.preferredLanguage() != null) {
            user.setPreferredLanguage(request.preferredLanguage());
        }
        return repository.save(user);
    }

    public List<User> listCandidates() {
        return repository.findByRoleOrderByCreatedAtDesc(ROLE_CANDIDATE);
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId().toString(),
                user.getUsername(),
                user.getRole(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getPreferredLanguage());
    }

    /**
     * Creates one demo admin and one demo candidate account the first time the
     * app starts. The credentials are documented in the README and are meant
     * only for local demonstration.
     */
    public void seedDemoAccounts() {
        if (!repository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(PasswordUtil.hash("Admin@123"));
            admin.setRole(ROLE_ADMIN);
            admin.setFullName("Demo Administrator");
            admin.setEmail("admin@civicpulse.demo");
            admin.setPreferredLanguage("en");
            admin.setCreatedAt(Instant.now());
            repository.save(admin);
        }
        if (!repository.existsByUsername("candidate")) {
            User candidate = new User();
            candidate.setUsername("candidate");
            candidate.setPasswordHash(PasswordUtil.hash("Candidate@123"));
            candidate.setRole(ROLE_CANDIDATE);
            candidate.setFullName("Demo Citizen");
            candidate.setEmail("candidate@civicpulse.demo");
            candidate.setPhone("9000000000");
            candidate.setPreferredLanguage("en");
            candidate.setCreatedAt(Instant.now());
            repository.save(candidate);
        }
    }
}
