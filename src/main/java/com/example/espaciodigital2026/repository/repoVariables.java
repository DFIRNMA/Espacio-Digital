package com.example.espaciodigital2026.repository;

import com.example.espaciodigital2026.entity.entityVariables;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// Usamos String porque el @Id (id_a) es de tipo texto
public interface repoVariables extends JpaRepository<entityVariables, String> {
}