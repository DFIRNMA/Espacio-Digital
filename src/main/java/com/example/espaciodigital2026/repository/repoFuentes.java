package com.example.espaciodigital2026.repository;

import com.example.espaciodigital2026.entity.entityFuentes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface repoFuentes extends JpaRepository<entityFuentes, String> {
}