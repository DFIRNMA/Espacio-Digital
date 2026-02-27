package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityProcesos;
import com.example.espaciodigital2026.repository.repoProcesos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceProcesos {

    @Autowired
    private repoProcesos procesosRepository;

    public List<entityProcesos> getAllProcesos() {
        return procesosRepository.findAll();
    }

    public Optional<entityProcesos> getProcesoById(String id) {
        return procesosRepository.findById(id);
    }

    public entityProcesos saveProceso(entityProcesos proceso) {
        return procesosRepository.save(proceso);
    }
}