package com.example.espaciodigital2026.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class DemoController {

    public DemoController() {
        System.out.println(">>> DemoController CARGADO");
    }

    @GetMapping("/api/demo")
    public String hello() {
        return "Hello, World!";
    }
}