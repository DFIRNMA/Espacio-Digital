package com.example.espaciodigital2026.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "pertinencia", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "id_unique",
    "id_a",
    "pertinencia",
    "contribucion",
    "viabilidad",
    "propuesta",
    "comentario_s"
})
public class entityPertinencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unique")
    private Integer id_unique;

    @Column(name = "id_a", columnDefinition = "text")
    private String id_a;

    @Column(name = "pertinencia", columnDefinition = "text")
    private String pertinencia;

    @Column(name = "contribucion", columnDefinition = "text")
    private String contribucion;

    @Column(name = "viabilidad", columnDefinition = "text")
    private String viabilidad;

    @Column(name = "propuesta", columnDefinition = "text")
    private String propuesta;

    @Column(name = "comentario_s", columnDefinition = "text")
    private String comentario_s;

    // --- Getters y Setters ---

    public Integer getId_unique() { return id_unique; }
    public void setId_unique(Integer id_unique) { this.id_unique = id_unique; }

    public String getId_a() { return id_a; }
    public void setId_a(String id_a) { this.id_a = id_a; }

    public String getPertinencia() { return pertinencia; }
    public void setPertinencia(String pertinencia) { this.pertinencia = pertinencia; }

    public String getContribucion() { return contribucion; }
    public void setContribucion(String contribucion) { this.contribucion = contribucion; }

    public String getViabilidad() { return viabilidad; }
    public void setViabilidad(String viabilidad) { this.viabilidad = viabilidad; }

    public String getPropuesta() { return propuesta; }
    public void setPropuesta(String propuesta) { this.propuesta = propuesta; }

    public String getComentario_s() { return comentario_s; }
    public void setComentario_s(String comentario_s) { this.comentario_s = comentario_s; }
}