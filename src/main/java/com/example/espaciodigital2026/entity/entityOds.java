package com.example.espaciodigital2026.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "ods", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "id_unique",
    "id_a",
    "objetivo",
    "meta",
    "indicador",
    "contribucion",
    "comentario_s"
})
public class entityOds {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unique")
    private Integer id_unique;

    @Column(name = "id_a", columnDefinition = "text")
    private String id_a;

    @Column(name = "objetivo", columnDefinition = "text")
    private String objetivo;

    @Column(name = "meta", columnDefinition = "text")
    private String meta;

    @Column(name = "indicador", columnDefinition = "text")
    private String indicador;

    @Column(name = "contribucion", columnDefinition = "text")
    private String contribucion;

    @Column(name = "comentario_s", columnDefinition = "text")
    private String comentario_s;

    // --- Getters y Setters ---

    public Integer getId_unique() { return id_unique; }
    public void setId_unique(Integer id_unique) { this.id_unique = id_unique; }

    public String getId_a() { return id_a; }
    public void setId_a(String id_a) { this.id_a = id_a; }

    public String getObjetivo() { return objetivo; }
    public void setObjetivo(String objetivo) { this.objetivo = objetivo; }

    public String getMeta() { return meta; }
    public void setMeta(String meta) { this.meta = meta; }

    public String getIndicador() { return indicador; }
    public void setIndicador(String indicador) { this.indicador = indicador; }

    public String getContribucion() { return contribucion; }
    public void setContribucion(String contribucion) { this.contribucion = contribucion; }

    public String getComentario_s() { return comentario_s; }
    public void setComentario_s(String comentario_s) { this.comentario_s = comentario_s; }
}