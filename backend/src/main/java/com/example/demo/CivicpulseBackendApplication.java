package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.example.civicpulsebackend")
@EntityScan(basePackages = "com.example.civicpulsebackend")
@EnableJpaRepositories(basePackages = "com.example.civicpulsebackend")
public class CivicpulseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CivicpulseBackendApplication.class, args);
	}

}
