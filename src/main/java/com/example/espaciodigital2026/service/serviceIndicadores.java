package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityIndicadores;
import com.example.espaciodigital2026.repository.repoIndicadores;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class serviceIndicadores {

    @Autowired
    private repoIndicadores repoIndicadores;

    public List<entityIndicadores> getAllIndicadores() {
        return repoIndicadores.findAll();
    }
}
