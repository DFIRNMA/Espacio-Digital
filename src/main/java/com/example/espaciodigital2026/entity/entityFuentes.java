package com.example.espaciodigital2026.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "fuentes", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "id_fuente",
    "acronimo",
    "fuente",
    "url",
    "edicion",
    "comentario_s",
    "comentario_a"
})
public class entityFuentes {

    @Id
    @Column(name = "id_fuente", columnDefinition = "text")
    private String id_fuente;

    @Column(name = "acronimo", columnDefinition = "text")
    private String acronimo;

    @Column(name = "fuente", columnDefinition = "text")
    private String fuente;

    @Column(name = "url", columnDefinition = "text")
    private String url;

    @Column(name = "edicion", columnDefinition = "text")
    private String edicion;

    @Column(name = "comentario_s", columnDefinition = "text")
    private String comentario_s;

    @Column(name = "comentario_a", columnDefinition = "text")
    private String comentario_a;

    // --- Getters y Setters ---

    public String getId_fuente() { return id_fuente; }
    public void setId_fuente(String id_fuente) { this.id_fuente = id_fuente; }

    public String getAcronimo() { return acronimo; }
    public void setAcronimo(String acronimo) { this.acronimo = acronimo; }

    public String getFuente() { return fuente; }
    public void setFuente(String fuente) { this.fuente = fuente; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getEdicion() { return edicion; }
    public void setEdicion(String edicion) { this.edicion = edicion; }

    public String getComentario_s() { return comentario_s; }
    public void setComentario_s(String comentario_s) { this.comentario_s = comentario_s; }

    public String getComentario_a() { return comentario_a; }
    public void setComentario_a(String comentario_a) { this.comentario_a = comentario_a; }
}