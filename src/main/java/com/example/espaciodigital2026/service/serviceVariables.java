package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityVariables;
import com.example.espaciodigital2026.repository.repoVariables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceVariables {

    @Autowired
    private repoVariables variablesRepository;

    public List<entityVariables> getAllVariables() {
        return variablesRepository.findAll();
    }

    public Optional<entityVariables> getVariableById(String id) {
        return variablesRepository.findById(id);
    }

    public entityVariables saveVariable(entityVariables variable) {
        return variablesRepository.save(variable);
    }
}