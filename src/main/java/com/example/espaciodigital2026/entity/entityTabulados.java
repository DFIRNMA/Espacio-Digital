package com.example.espaciodigital2026.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "tabulados", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "id_tabulado",
    "tabulado",
    "tipo",
    "hoja",
    "url_acceso",
    "url_descarga",
    "comentario_a"
})
public class entityTabulados {

    @Id
    @Column(name = "id_tabulado", columnDefinition = "text")
    private String id_tabulado;

    @Column(name = "tabulado", columnDefinition = "text")
    private String tabulado;

    @Column(name = "tipo", columnDefinition = "text")
    private String tipo;

    @Column(name = "hoja", columnDefinition = "text")
    private String hoja;

    @Column(name = "url_acceso", columnDefinition = "text")
    private String url_acceso;

    @Column(name = "url_descarga", columnDefinition = "text")
    private String url_descarga;

    @Column(name = "comentario_a", columnDefinition = "text")
    private String comentario_a;

    // --- Getters y Setters ---

    public String getId_tabulado() { return id_tabulado; }
    public void setId_tabulado(String id_tabulado) { this.id_tabulado = id_tabulado; }

    public String getTabulado() { return tabulado; }
    public void setTabulado(String tabulado) { this.tabulado = tabulado; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getHoja() { return hoja; }
    public void setHoja(String hoja) { this.hoja = hoja; }

    public String getUrl_acceso() { return url_acceso; }
    public void setUrl_acceso(String url_acceso) { this.url_acceso = url_acceso; }

    public String getUrl_descarga() { return url_descarga; }
    public void setUrl_descarga(String url_descarga) { this.url_descarga = url_descarga; }

    public String getComentario_a() { return comentario_a; }
    public void setComentario_a(String comentario_a) { this.comentario_a = comentario_a; }
}