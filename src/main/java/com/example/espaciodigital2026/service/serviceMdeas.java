package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityMdeas;
import com.example.espaciodigital2026.repository.repoMdeas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceMdeas {

    @Autowired
    private repoMdeas mdeasRepository;

    public List<entityMdeas> getAllMdeas() {
        return mdeasRepository.findAll();
    }

    public Optional<entityMdeas> getMdeasById(Integer id) {
        return mdeasRepository.findById(id);
    }

    public entityMdeas saveMdeas(entityMdeas mdea) {
        return mdeasRepository.save(mdea);
    }
}