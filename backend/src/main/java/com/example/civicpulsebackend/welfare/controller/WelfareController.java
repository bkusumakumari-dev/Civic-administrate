package com.example.civicpulsebackend.welfare.controller;

import com.example.civicpulsebackend.welfare.entity.Welfare;
import com.example.civicpulsebackend.welfare.repository.WelfareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/welfares")
public class WelfareController {

    @Autowired
    private WelfareRepository repository;

    @GetMapping
    public List<Welfare> getAll() {
        return repository.findAll();
    }
    
    @PostMapping
    public Welfare create(@RequestBody Welfare entity) {
        return repository.save(entity);
    }
}
