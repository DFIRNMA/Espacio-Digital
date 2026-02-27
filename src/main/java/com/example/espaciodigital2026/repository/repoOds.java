package com.example.espaciodigital2026.repository;

import com.example.espaciodigital2026.entity.entityOds;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface repoOds extends JpaRepository<entityOds, Integer> {
}