package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityMicrodatos;
import com.example.espaciodigital2026.repository.repoMicrodatos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceMicrodatos {

    @Autowired
    private repoMicrodatos microdatosRepository;

    public List<entityMicrodatos> getAllMicrodatos() {
        return microdatosRepository.findAll();
    }

    public Optional<entityMicrodatos> getMicrodatosById(Integer id) {
        return microdatosRepository.findById(id);
    }

    public entityMicrodatos saveMicrodatos(entityMicrodatos microdato) {
        return microdatosRepository.save(microdato);
    }
}