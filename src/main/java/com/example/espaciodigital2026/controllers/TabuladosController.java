package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityTabulados;
import com.example.espaciodigital2026.service.serviceTabulados;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tabulados")
public class TabuladosController {

    private final serviceTabulados service;

    public TabuladosController(serviceTabulados service) {
        this.service = service;
    }

    @GetMapping
    public List<entityTabulados> listar() {
        return service.getAllTabulados();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityTabulados> porId(@PathVariable String id) {
        return service.getTabuladoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<entityTabulados> guardar(@RequestBody entityTabulados tabulado) {
        entityTabulados nuevoTabulado = service.saveTabulado(tabulado);
        return ResponseEntity.ok(nuevoTabulado);
    }
}