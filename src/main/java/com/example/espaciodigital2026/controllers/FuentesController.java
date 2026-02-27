package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityFuentes;
import com.example.espaciodigital2026.service.serviceFuentes;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuentes")
public class FuentesController {

    private final serviceFuentes service;

    public FuentesController(serviceFuentes service) {
        this.service = service;
    }

    @GetMapping
    public List<entityFuentes> listar() {
        return service.getAllFuentes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityFuentes> porId(@PathVariable String id) {
        return service.getFuenteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<entityFuentes> guardar(@RequestBody entityFuentes fuente) {
        entityFuentes nuevaFuente = service.saveFuente(fuente);
        return ResponseEntity.ok(nuevaFuente);
    }
}