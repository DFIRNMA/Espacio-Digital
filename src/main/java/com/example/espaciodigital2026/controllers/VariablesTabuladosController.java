package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityVariablesTabulados;
import com.example.espaciodigital2026.service.serviceVariablesTabulados;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variables_tabulados")
public class VariablesTabuladosController {

    private final serviceVariablesTabulados service;

    public VariablesTabuladosController(serviceVariablesTabulados service) {
        this.service = service;
    }

    @GetMapping
    public List<entityVariablesTabulados> listar() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityVariablesTabulados> porId(@PathVariable Integer id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<entityVariablesTabulados> guardar(@RequestBody entityVariablesTabulados relacion) {
        entityVariablesTabulados nuevaRelacion = service.save(relacion);
        return ResponseEntity.ok(nuevaRelacion);
    }
}