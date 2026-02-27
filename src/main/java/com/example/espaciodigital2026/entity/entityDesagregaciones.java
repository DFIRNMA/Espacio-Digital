package com.example.espaciodigital2026.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.*;

@Entity
@Table(name = "desagregacion", schema = "armonizacion_variables") // Ajusta el nombre de la tabla si en tu BD es diferente

@JsonPropertyOrder({
    "id_unique",
    "id_tabulado",
    "desagregacion",
    "comentario_a"
})
public class entityDesagregaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unique")
    private Integer id_unique;

    @Column(name = "id_tabulado", columnDefinition = "text")
    private String id_tabulado;

    @Column(name = "desagregacion", columnDefinition = "text")
    private String desagregacion;

    @Column(name = "comentario_a", columnDefinition = "text")
    private String comentario_a;

    // --- Getters y Setters ---

    public Integer getId_unique() { return id_unique; }
    public void setId_unique(Integer id_unique) { this.id_unique = id_unique; }

    public String getId_tabulado() { return id_tabulado; }
    public void setId_tabulado(String id_tabulado) { this.id_tabulado = id_tabulado; }

    public String getDesagregacion() { return desagregacion; }
    public void setDesagregacion(String desagregacion) { this.desagregacion = desagregacion; }

    public String getComentario_a() { return comentario_a; }
    public void setComentario_a(String comentario_a) { this.comentario_a = comentario_a; }
}