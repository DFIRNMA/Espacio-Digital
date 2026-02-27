package com.example.espaciodigital2026.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "microdatos", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "id_unique",
    "id_a",
    "url_acceso",
    "descriptor",
    "url_descriptor",
    "tabla",
    "campo",
    "comentario_a"
})
public class entityMicrodatos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unique")
    private Integer id_unique;

    @Column(name = "id_a", columnDefinition = "text")
    private String id_a;

    @Column(name = "url_acceso", columnDefinition = "text")
    private String url_acceso;

    @Column(name = "descriptor", columnDefinition = "text")
    private String descriptor;

    @Column(name = "url_descriptor", columnDefinition = "text")
    private String url_descriptor;

    @Column(name = "tabla", columnDefinition = "text")
    private String tabla;

    @Column(name = "campo", columnDefinition = "text")
    private String campo;

    @Column(name = "comentario_a", columnDefinition = "text")
    private String comentario_a;

    // --- Getters y Setters ---

    public Integer getId_unique() { return id_unique; }
    public void setId_unique(Integer id_unique) { this.id_unique = id_unique; }

    public String getId_a() { return id_a; }
    public void setId_a(String id_a) { this.id_a = id_a; }

    public String getUrl_acceso() { return url_acceso; }
    public void setUrl_acceso(String url_acceso) { this.url_acceso = url_acceso; }

    public String getDescriptor() { return descriptor; }
    public void setDescriptor(String descriptor) { this.descriptor = descriptor; }

    public String getUrl_descriptor() { return url_descriptor; }
    public void setUrl_descriptor(String url_descriptor) { this.url_descriptor = url_descriptor; }

    public String getTabla() { return tabla; }
    public void setTabla(String tabla) { this.tabla = tabla; }

    public String getCampo() { return campo; }
    public void setCampo(String campo) { this.campo = campo; }

    public String getComentario_a() { return comentario_a; }
    public void setComentario_a(String comentario_a) { this.comentario_a = comentario_a; }
}