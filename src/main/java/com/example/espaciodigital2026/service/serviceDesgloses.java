package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityDesgloses;
import com.example.espaciodigital2026.repository.repoDesgloses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceDesgloses {

    @Autowired
    private repoDesgloses desglosesRepository;

    public List<entityDesgloses> getAllDesgloses() {
        return desglosesRepository.findAll();
    }

    public Optional<entityDesgloses> getDesgloseById(Integer id) {
        return desglosesRepository.findById(id);
    }

    public entityDesgloses saveDesglose(entityDesgloses desglose) {
        return desglosesRepository.save(desglose);
    }
}