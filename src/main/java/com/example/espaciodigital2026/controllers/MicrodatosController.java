package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityMicrodatos;
import com.example.espaciodigital2026.service.serviceMicrodatos;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/microdatos")
public class MicrodatosController {

    private final serviceMicrodatos service;

    public MicrodatosController(serviceMicrodatos service) {
        this.service = service;
    }

    @GetMapping
    public List<entityMicrodatos> listar() {
        return service.getAllMicrodatos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityMicrodatos> porId(@PathVariable Integer id) {
        return service.getMicrodatosById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<entityMicrodatos> guardar(@RequestBody entityMicrodatos microdato) {
        entityMicrodatos nuevoMicrodato = service.saveMicrodatos(microdato);
        return ResponseEntity.ok(nuevoMicrodato);
    }
}