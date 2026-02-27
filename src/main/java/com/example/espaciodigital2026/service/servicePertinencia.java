package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityPertinencia;
import com.example.espaciodigital2026.repository.repoPertinencia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class servicePertinencia {

    @Autowired
    private repoPertinencia pertinenciaRepository;

    public List<entityPertinencia> getAllPertinencias() {
        return pertinenciaRepository.findAll();
    }

    public Optional<entityPertinencia> getPertinenciaById(Integer id) {
        return pertinenciaRepository.findById(id);
    }

    public entityPertinencia savePertinencia(entityPertinencia pertinencia) {
        return pertinenciaRepository.save(pertinencia);
    }
}