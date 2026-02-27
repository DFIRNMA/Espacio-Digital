package com.example.espaciodigital2026.controllers;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test-db")
public class DbTestController {

    private final JdbcTemplate jdbcTemplate;

    public DbTestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public String testConnection() {
        return jdbcTemplate.queryForObject("SELECT version()", String.class);
    }
}
