package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityDesgloses;
import com.example.espaciodigital2026.service.serviceDesgloses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/desgloses")
public class DesglosesController {

    private final serviceDesgloses service;

    public DesglosesController(serviceDesgloses service) {
        this.service = service;
    }

    @GetMapping
    public List<entityDesgloses> listar() {
        return service.getAllDesgloses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityDesgloses> porId(@PathVariable Integer id) {
        return service.getDesgloseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<entityDesgloses> guardar(@RequestBody entityDesgloses desglose) {
        entityDesgloses nuevoDesglose = service.saveDesglose(desglose);
        return ResponseEntity.ok(nuevoDesglose);
    }
}