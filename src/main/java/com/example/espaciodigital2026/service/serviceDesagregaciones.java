package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityDesagregaciones;
import com.example.espaciodigital2026.repository.repoDesagregaciones;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceDesagregaciones {
    
    @Autowired
    private repoDesagregaciones desagregacionesRepository;

    public List<entityDesagregaciones> getAllDesagregaciones() {
        return desagregacionesRepository.findAll();
    }

    public Optional<entityDesagregaciones> getDesagregacionById(Integer id) {
        return desagregacionesRepository.findById(id);
    }

    public entityDesagregaciones saveDesagregacion(entityDesagregaciones desagregacion) {
        return desagregacionesRepository.save(desagregacion);
    }
}