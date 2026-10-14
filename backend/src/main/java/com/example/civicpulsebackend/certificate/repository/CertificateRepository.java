package com.example.civicpulsebackend.certificate.repository;

import com.example.civicpulsebackend.certificate.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
}
