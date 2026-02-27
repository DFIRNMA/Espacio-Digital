package com.example.espaciodigital2026.controllers;

import com.example.espaciodigital2026.entity.entityMdeas;
import com.example.espaciodigital2026.service.serviceMdeas;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mdeas")
public class MdeasController {

    private final serviceMdeas service;

    public MdeasController(serviceMdeas service) {
        this.service = service;
    }

    @GetMapping
    public List<entityMdeas> listar() {
        return service.getAllMdeas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<entityMdeas> porId(@PathVariable Integer id) {
        return service.getMdeasById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<entityMdeas> guardar(@RequestBody entityMdeas mdea) {
        entityMdeas nuevaMdea = service.saveMdeas(mdea);
        return ResponseEntity.ok(nuevaMdea);
    }
}