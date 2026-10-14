package com.example.civicpulsebackend.welfare.controller;

import com.example.civicpulsebackend.welfare.entity.Asset;
import com.example.civicpulsebackend.welfare.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    @Autowired
    private AssetRepository repository;

    @GetMapping
    public List<Asset> getAll() {
        return repository.findAll();
    }
    
    @PostMapping
    public Asset create(@RequestBody Asset entity) {
        return repository.save(entity);
    }
}
