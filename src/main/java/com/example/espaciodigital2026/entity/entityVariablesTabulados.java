package com.example.espaciodigital2026.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "variables_tabulados", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "id_unique",
    "id_a",
    "id_tabulado",
    "comentario_a"
})
public class entityVariablesTabulados {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unique")
    private Integer id_unique;

    @Column(name = "id_a", columnDefinition = "text")
    private String id_a;

    @Column(name = "id_tabulado", columnDefinition = "text")
    private String id_tabulado;

    @Column(name = "comentario_a", columnDefinition = "text")
    private String comentario_a;

    // --- Getters y Setters ---

    public Integer getId_unique() { return id_unique; }
    public void setId_unique(Integer id_unique) { this.id_unique = id_unique; }

    public String getId_a() { return id_a; }
    public void setId_a(String id_a) { this.id_a = id_a; }

    public String getId_tabulado() { return id_tabulado; }
    public void setId_tabulado(String id_tabulado) { this.id_tabulado = id_tabulado; }

    public String getComentario_a() { return comentario_a; }
    public void setComentario_a(String comentario_a) { this.comentario_a = comentario_a; }
}