package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityVariablesTabulados;
import com.example.espaciodigital2026.repository.repoVariablesTabulados;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceVariablesTabulados {

    @Autowired
    private repoVariablesTabulados variablesTabuladosRepository;

    public List<entityVariablesTabulados> getAll() {
        return variablesTabuladosRepository.findAll();
    }

    public Optional<entityVariablesTabulados> getById(Integer id) {
        return variablesTabuladosRepository.findById(id);
    }

    public entityVariablesTabulados save(entityVariablesTabulados relacion) {
        return variablesTabuladosRepository.save(relacion);
    }
}