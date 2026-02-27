package com.example.espaciodigital2026.repository;

import com.example.espaciodigital2026.entity.entityProcesos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// Usamos String porque el @Id (acronimo) es de tipo texto
public interface repoProcesos extends JpaRepository<entityProcesos, String> {
}