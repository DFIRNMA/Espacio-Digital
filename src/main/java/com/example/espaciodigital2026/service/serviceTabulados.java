package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityTabulados;
import com.example.espaciodigital2026.repository.repoTabulados;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceTabulados {

    @Autowired
    private repoTabulados tabuladosRepository;

    public List<entityTabulados> getAllTabulados() {
        return tabuladosRepository.findAll();
    }

    public Optional<entityTabulados> getTabuladoById(String id) {
        return tabuladosRepository.findById(id);
    }

    public entityTabulados saveTabulado(entityTabulados tabulado) {
        return tabuladosRepository.save(tabulado);
    }
}