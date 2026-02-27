package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityClasificaciones;
import com.example.espaciodigital2026.repository.repoClasificaciones;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class serviceClasificaciones {
    @Autowired
    private repoClasificaciones clasificacionesRepository;

    public List<entityClasificaciones> getAllClasificaciones() {
        return clasificacionesRepository.findAll();
    }

    public Optional<entityClasificaciones> getClasificacionById(Integer id) {
    return clasificacionesRepository.findById(id);
    }

    public entityClasificaciones saveClasificacion(entityClasificaciones clasificacion) {
        return clasificacionesRepository.save(clasificacion);
    }

    
}
