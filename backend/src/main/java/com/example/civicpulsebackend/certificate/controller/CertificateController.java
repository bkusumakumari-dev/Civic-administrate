package com.example.civicpulsebackend.certificate.controller;

import com.example.civicpulsebackend.certificate.entity.Certificate;
import com.example.civicpulsebackend.certificate.repository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateRepository repository;

    @GetMapping
    public List<Certificate> getAll() {
        return repository.findAll();
    }
    
    @PostMapping
    public Certificate create(@RequestBody Certificate entity) {
        return repository.save(entity);
    }
}
