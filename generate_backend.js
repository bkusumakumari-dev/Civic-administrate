const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'backend', 'src', 'main', 'java', 'com', 'example', 'civicpulsebackend');

const domains = {
    citizen: ['Citizen', 'Grievance', 'Department'],
    certificate: ['Certificate', 'Permit', 'Application'],
    welfare: ['Welfare', 'Budget', 'Asset', 'Workflow']
};

function createPackage(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function writeEntity(domain, entity) {
    const dir = path.join(baseDir, domain, 'entity');
    createPackage(dir);
    const content = `package com.example.civicpulsebackend.${domain}.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
public class ${entity} {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    // Auto-generated skeleton fields
    private String name;
    private String status;
}
`;
    fs.writeFileSync(path.join(dir, `${entity}.java`), content);
}

function writeRepository(domain, entity) {
    const dir = path.join(baseDir, domain, 'repository');
    createPackage(dir);
    const content = `package com.example.civicpulsebackend.${domain}.repository;

import com.example.civicpulsebackend.${domain}.entity.${entity};
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ${entity}Repository extends JpaRepository<${entity}, UUID> {
}
`;
    fs.writeFileSync(path.join(dir, `${entity}Repository.java`), content);
}

function writeController(domain, entity) {
    const dir = path.join(baseDir, domain, 'controller');
    createPackage(dir);
    const content = `package com.example.civicpulsebackend.${domain}.controller;

import com.example.civicpulsebackend.${domain}.entity.${entity};
import com.example.civicpulsebackend.${domain}.repository.${entity}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/${entity.toLowerCase()}s")
public class ${entity}Controller {

    @Autowired
    private ${entity}Repository repository;

    @GetMapping
    public List<${entity}> getAll() {
        return repository.findAll();
    }
    
    @PostMapping
    public ${entity} create(@RequestBody ${entity} entity) {
        return repository.save(entity);
    }
}
`;
    fs.writeFileSync(path.join(dir, `${entity}Controller.java`), content);
}

for (const [domain, entities] of Object.entries(domains)) {
    for (const entity of entities) {
        writeEntity(domain, entity);
        writeRepository(domain, entity);
        writeController(domain, entity);
    }
}

// Update application.properties or yml
const resourcesDir = path.join(__dirname, 'backend', 'src', 'main', 'resources');
fs.writeFileSync(path.join(resourcesDir, 'application.yml'), `
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/civicpulse_db
    username: civicpulse
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
`);
// Remove application.properties if exists
if (fs.existsSync(path.join(resourcesDir, 'application.properties'))) {
    fs.unlinkSync(path.join(resourcesDir, 'application.properties'));
}

console.log("Backend generated successfully.");
