package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityDatosAbiertos;
import com.example.espaciodigital2026.service.serviceDatosAbiertos;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/datos-abiertos")
public class DatosAbiertosController {

    private final serviceDatosAbiertos service;

    public DatosAbiertosController(serviceDatosAbiertos service) {
        this.service = service;
    }

    // GET: Obtener todos los registros
    @GetMapping
    public List<entityDatosAbiertos> listar() {
        return service.getAllDatosAbiertos();
    }

    // GET: Obtener un registro por su ID
    @GetMapping("/{id}")
    public ResponseEntity<entityDatosAbiertos> porId(@PathVariable Integer id) {
        return service.getDatosAbiertosById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST: Crear o actualizar un registro
    @PostMapping
    public ResponseEntity<entityDatosAbiertos> guardar(@RequestBody entityDatosAbiertos datosAbiertos) {
        entityDatosAbiertos nuevoRegistro = service.saveDatosAbiertos(datosAbiertos);
        return ResponseEntity.ok(nuevoRegistro);
    }
}