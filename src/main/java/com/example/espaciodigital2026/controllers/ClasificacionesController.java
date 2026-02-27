package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityClasificaciones;
import com.example.espaciodigital2026.service.serviceClasificaciones;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clasificaciones")
public class ClasificacionesController {

    private final serviceClasificaciones service;

    public ClasificacionesController(serviceClasificaciones service) {
        this.service = service;
    }

    @GetMapping
    public List<entityClasificaciones> listar() {
        return service.getAllClasificaciones();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityClasificaciones> porId(@PathVariable Integer id) {
        return service.getClasificacionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
