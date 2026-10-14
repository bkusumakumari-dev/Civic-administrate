package com.example.civicpulsebackend.config;

import com.example.civicpulsebackend.user.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the demo admin and candidate login accounts once at startup.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final AuthService authService;

    public DataSeeder(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void run(String... args) {
        authService.seedDemoAccounts();
    }
}
