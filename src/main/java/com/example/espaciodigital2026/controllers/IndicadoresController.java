package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityIndicadores;
import com.example.espaciodigital2026.service.serviceIndicadores;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/indicadores_ambientales")
public class IndicadoresController {

    @Autowired
    public serviceIndicadores indicadoresService;

    @GetMapping
    public List<entityIndicadores> getAllIndicadores() {
        return indicadoresService.getAllIndicadores();
    }
}
