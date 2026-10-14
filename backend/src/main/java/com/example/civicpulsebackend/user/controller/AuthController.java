package com.example.civicpulsebackend.user.controller;

import com.example.civicpulsebackend.user.dto.LoginRequest;
import com.example.civicpulsebackend.user.dto.ProfileUpdateRequest;
import com.example.civicpulsebackend.user.dto.RegisterRequest;
import com.example.civicpulsebackend.user.dto.UserResponse;
import com.example.civicpulsebackend.user.entity.User;
import com.example.civicpulsebackend.user.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.authenticate(request.username().trim(), request.password())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid username or password"));
        return ResponseEntity.ok(authService.toResponse(user));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(authService.toResponse(user));
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }
    }

    @PatchMapping("/profile/{id}")
    public ResponseEntity<UserResponse> updateProfile(
            @PathVariable UUID id,
            @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(authService.toResponse(authService.updateProfile(id, request)));
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<UserResponse>> listCandidates() {
        List<UserResponse> users = authService.listCandidates().stream()
                .map(authService::toResponse)
                .toList();
        return ResponseEntity.ok(users);
    }
}
