package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityDesagregaciones;
import com.example.espaciodigital2026.service.serviceDesagregaciones;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/desagregaciones")
public class DesagregacionesController {

    private final serviceDesagregaciones service;

    public DesagregacionesController(serviceDesagregaciones service) {
        this.service = service;
    }

    @GetMapping
    public List<entityDesagregaciones> listar() {
        return service.getAllDesagregaciones();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityDesagregaciones> porId(@PathVariable Integer id) {
        return service.getDesagregacionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Agregué el método POST por si llegas a necesitar insertar datos desde el frontend
    @PostMapping
    public ResponseEntity<entityDesagregaciones> guardar(@RequestBody entityDesagregaciones desagregacion) {
        entityDesagregaciones nuevaDesagregacion = service.saveDesagregacion(desagregacion);
        return ResponseEntity.ok(nuevaDesagregacion);
    }
}