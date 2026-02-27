package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityOds;
import com.example.espaciodigital2026.repository.repoOds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceOds {

    @Autowired
    private repoOds odsRepository;

    public List<entityOds> getAllOds() {
        return odsRepository.findAll();
    }

    public Optional<entityOds> getOdsById(Integer id) {
        return odsRepository.findById(id);
    }

    public entityOds saveOds(entityOds ods) {
        return odsRepository.save(ods);
    }
}