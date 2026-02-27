package com.example.espaciodigital2026.repository;

import com.example.espaciodigital2026.entity.entityDatosAbiertos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface repoDatosAbiertos extends JpaRepository<entityDatosAbiertos, Integer> {
    // Aquí puedes agregar consultas personalizadas más adelante si las necesitas.
    // Ejemplo: List<DatosAbiertos> findByTabla(String tabla);
}