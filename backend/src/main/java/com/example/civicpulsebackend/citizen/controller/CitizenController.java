package com.example.civicpulsebackend.citizen.controller;

import com.example.civicpulsebackend.citizen.entity.Citizen;
import com.example.civicpulsebackend.citizen.repository.CitizenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizens")
public class CitizenController {

    @Autowired
    private CitizenRepository repository;

    @GetMapping
    public List<Citizen> getAll() {
        return repository.findAll();
    }
    
    @PostMapping
    public Citizen create(@RequestBody Citizen entity) {
        return repository.save(entity);
    }
}
