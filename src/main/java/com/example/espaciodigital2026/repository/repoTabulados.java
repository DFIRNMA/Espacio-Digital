package com.example.espaciodigital2026.repository;

import com.example.espaciodigital2026.entity.entityTabulados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// Usamos String porque el @Id (id_tabulado) es de tipo texto
public interface repoTabulados extends JpaRepository<entityTabulados, String> {
}