package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityOds;
import com.example.espaciodigital2026.service.serviceOds;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ods")
public class OdsController {

    private final serviceOds service;

    public OdsController(serviceOds service) {
        this.service = service;
    }

    @GetMapping
    public List<entityOds> listar() {
        return service.getAllOds();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityOds> porId(@PathVariable Integer id) {
        return service.getOdsById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<entityOds> guardar(@RequestBody entityOds ods) {
        entityOds nuevoOds = service.saveOds(ods);
        return ResponseEntity.ok(nuevoOds);
    }
}