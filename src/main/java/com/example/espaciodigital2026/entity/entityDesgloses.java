package com.example.espaciodigital2026.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.*;

@Entity
@Table(name = "desglose", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "id_unique",
    "id_tabulado",
    "desglose",
    "comentario_a"
})
public class entityDesgloses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unique")
    private Integer id_unique;

    @Column(name = "id_tabulado", columnDefinition = "text")
    private String id_tabulado;

    @Column(name = "desglose", columnDefinition = "text")
    private String desglose;

    @Column(name = "comentario_a", columnDefinition = "text")
    private String comentario_a;

    // --- Getters y Setters ---

    public Integer getId_unique() { return id_unique; }
    public void setId_unique(Integer id_unique) { this.id_unique = id_unique; }

    public String getId_tabulado() { return id_tabulado; }
    public void setId_tabulado(String id_tabulado) { this.id_tabulado = id_tabulado; }

    public String getDesglose() { return desglose; }
    public void setDesglose(String desglose) { this.desglose = desglose; }

    public String getComentario_a() { return comentario_a; }
    public void setComentario_a(String comentario_a) { this.comentario_a = comentario_a; }
}