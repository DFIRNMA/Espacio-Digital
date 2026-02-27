package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityVariables;
import com.example.espaciodigital2026.service.serviceVariables;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variables")
public class VariablesController {

    private final serviceVariables service;

    public VariablesController(serviceVariables service) {
        this.service = service;
    }

    @GetMapping
    public List<entityVariables> listar() {
        return service.getAllVariables();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityVariables> porId(@PathVariable String id) {
        return service.getVariableById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<entityVariables> guardar(@RequestBody entityVariables variable) {
        entityVariables nuevaVariable = service.saveVariable(variable);
        return ResponseEntity.ok(nuevaVariable);
    }
}