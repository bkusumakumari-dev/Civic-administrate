package com.example.civicpulsebackend.certificate.controller;

import com.example.civicpulsebackend.certificate.entity.Permit;
import com.example.civicpulsebackend.certificate.repository.PermitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permits")
public class PermitController {

    @Autowired
    private PermitRepository repository;

    @GetMapping
    public List<Permit> getAll() {
        return repository.findAll();
    }
    
    @PostMapping
    public Permit create(@RequestBody Permit entity) {
        return repository.save(entity);
    }
}
