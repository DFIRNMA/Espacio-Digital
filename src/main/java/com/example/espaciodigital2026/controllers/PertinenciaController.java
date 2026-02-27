package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityPertinencia;
import com.example.espaciodigital2026.service.servicePertinencia;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pertinencias") // Lo puse en plural por convención REST, pero puedes quitarle la 's' si prefieres
public class PertinenciaController {

    private final servicePertinencia service;

    public PertinenciaController(servicePertinencia service) {
        this.service = service;
    }

    @GetMapping
    public List<entityPertinencia> listar() {
        return service.getAllPertinencias();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityPertinencia> porId(@PathVariable Integer id) {
        return service.getPertinenciaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<entityPertinencia> guardar(@RequestBody entityPertinencia pertinencia) {
        entityPertinencia nuevaPertinencia = service.savePertinencia(pertinencia);
        return ResponseEntity.ok(nuevaPertinencia);
    }
}