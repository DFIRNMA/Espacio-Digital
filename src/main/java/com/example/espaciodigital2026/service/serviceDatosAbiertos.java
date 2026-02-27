package com.example.espaciodigital2026.service;

import com.example.espaciodigital2026.entity.entityDatosAbiertos;
import com.example.espaciodigital2026.repository.repoDatosAbiertos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class serviceDatosAbiertos {

    @Autowired
    private repoDatosAbiertos datosAbiertosRepository;

    public List<entityDatosAbiertos> getAllDatosAbiertos() {
        return datosAbiertosRepository.findAll();
    }

    public Optional<entityDatosAbiertos> getDatosAbiertosById(Integer id) {
        return datosAbiertosRepository.findById(id);
    }

    public entityDatosAbiertos saveDatosAbiertos(entityDatosAbiertos datosAbiertos) {
        return datosAbiertosRepository.save(datosAbiertos);
    }
    
    // Opcional: Método para eliminar si lo llegas a ocupar
    public void deleteDatosAbiertos(Integer id) {
        datosAbiertosRepository.deleteById(id);
    }
}