package com.example.espaciodigital2026.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "mdeas", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "id_unique",
    "id_a",
    "componente",
    "subcomponente",
    "tema",
    "estadistica1",
    "estadistica2",
    "contribucion",
    "comentario_s"
})
public class entityMdeas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unique")
    private Integer id_unique;

    @Column(name = "id_a", columnDefinition = "text")
    private String id_a;

    @Column(name = "componente", columnDefinition = "text")
    private String componente;

    @Column(name = "subcomponente", columnDefinition = "text")
    private String subcomponente;

    @Column(name = "tema", columnDefinition = "text")
    private String tema;

    @Column(name = "estadistica1", columnDefinition = "text")
    private String estadistica1;

    @Column(name = "estadistica2", columnDefinition = "text")
    private String estadistica2;

    @Column(name = "contribucion", columnDefinition = "text")
    private String contribucion;

    @Column(name = "comentario_s", columnDefinition = "text")
    private String comentario_s;

    // --- Getters y Setters ---

    public Integer getId_unique() { return id_unique; }
    public void setId_unique(Integer id_unique) { this.id_unique = id_unique; }

    public String getId_a() { return id_a; }
    public void setId_a(String id_a) { this.id_a = id_a; }

    public String getComponente() { return componente; }
    public void setComponente(String componente) { this.componente = componente; }

    public String getSubcomponente() { return subcomponente; }
    public void setSubcomponente(String subcomponente) { this.subcomponente = subcomponente; }

    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }

    public String getEstadistica1() { return estadistica1; }
    public void setEstadistica1(String estadistica1) { this.estadistica1 = estadistica1; }

    public String getEstadistica2() { return estadistica2; }
    public void setEstadistica2(String estadistica2) { this.estadistica2 = estadistica2; }

    public String getContribucion() { return contribucion; }
    public void setContribucion(String contribucion) { this.contribucion = contribucion; }

    public String getComentario_s() { return comentario_s; }
    public void setComentario_s(String comentario_s) { this.comentario_s = comentario_s; }
}