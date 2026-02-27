package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityFuentes;
import com.example.espaciodigital2026.repository.repoFuentes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceFuentes {

    @Autowired
    private repoFuentes fuentesRepository;

    public List<entityFuentes> getAllFuentes() {
        return fuentesRepository.findAll();
    }

    public Optional<entityFuentes> getFuenteById(String id) {
        return fuentesRepository.findById(id);
    }

    public entityFuentes saveFuente(entityFuentes fuente) {
        return fuentesRepository.save(fuente);
    }
}