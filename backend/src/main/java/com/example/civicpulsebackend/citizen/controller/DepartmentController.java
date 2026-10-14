package com.example.civicpulsebackend.citizen.controller;

import com.example.civicpulsebackend.citizen.entity.Department;
import com.example.civicpulsebackend.citizen.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentRepository repository;

    @GetMapping
    public List<Department> getAll() {
        return repository.findAll();
    }
    
    @PostMapping
    public Department create(@RequestBody Department entity) {
        return repository.save(entity);
    }
}
