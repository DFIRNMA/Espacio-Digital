package com.example.espaciodigital2026.repository;

import com.example.espaciodigital2026.entity.entityVariablesTabulados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface repoVariablesTabulados extends JpaRepository<entityVariablesTabulados, Integer> {
}