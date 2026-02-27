package com.example.espaciodigital2026.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.*;

@Entity
@Table(name = "clasificaciones", schema = "armonizacion_variables")

@JsonPropertyOrder({
    "id_unique",
    "id_a",
    "clase",
    "comentario_a"
})
public class entityClasificaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unique")
    private Integer id_unique;

    @Column(name = "id_a")
    private String id_a;

    @Column(name = "clase")
    private String clase;

    @Column(name = "comentario_a")
    private String comentario_a;

    public Integer getId_unique() { return id_unique; }
    public void setId_unique(Integer id_unique) { this.id_unique = id_unique; }

    public String getId_a() { return id_a; }
    public void setId_a(String id_a) { this.id_a = id_a; }

    public String getClase() { return clase; }
    public void setClase(String clase) { this.clase = clase; }

    public String getComentario_a() { return comentario_a; }
    public void setComentario_a(String comentario_a) { this.comentario_a = comentario_a; }
}
