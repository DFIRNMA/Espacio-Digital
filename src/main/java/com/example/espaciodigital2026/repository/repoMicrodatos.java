package com.example.espaciodigital2026.repository;

import com.example.espaciodigital2026.entity.entityMicrodatos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface repoMicrodatos extends JpaRepository<entityMicrodatos, Integer> {
}