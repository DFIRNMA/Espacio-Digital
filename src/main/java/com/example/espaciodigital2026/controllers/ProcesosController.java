package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityProcesos;
import com.example.espaciodigital2026.service.serviceProcesos;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procesos")
public class ProcesosController {

    private final serviceProcesos service;

    public ProcesosController(serviceProcesos service) {
        this.service = service;
    }

    @GetMapping
    public List<entityProcesos> listar() {
        return service.getAllProcesos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityProcesos> porId(@PathVariable String id) {
        return service.getProcesoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<entityProcesos> guardar(@RequestBody entityProcesos proceso) {
        entityProcesos nuevoProceso = service.saveProceso(proceso);
        return ResponseEntity.ok(nuevoProceso);
    }
}