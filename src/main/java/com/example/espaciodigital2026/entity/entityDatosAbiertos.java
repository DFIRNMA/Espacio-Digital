package com.example.espaciodigital2026.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "datos_abiertos", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "id_unique",
    "id_a",
    "url_acceso",
    "url_descarga",
    "descriptor",
    "tabla",
    "campo",
    "comentario_a"
})
public class entityDatosAbiertos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unique")
    private Integer id_unique;

    @Column(name = "id_a", length = 255) 
    private String id_a;

    @Column(name = "url_acceso", columnDefinition = "TEXT")
    private String url_acceso;

    @Column(name = "url_descarga", columnDefinition = "TEXT")
    private String url_descarga;

    @Column(name = "descriptor", columnDefinition = "TEXT")
    private String descriptor;

    @Column(name = "tabla", columnDefinition = "TEXT")
    private String tabla;

    @Column(name = "campo", columnDefinition = "TEXT")
    private String campo;

    @Column(name = "comentario_a", columnDefinition = "TEXT")
    private String comentario_a;

    // --- Getters and Setters ---

    public Integer getId_unique() { return id_unique; }
    public void setId_unique(Integer id_unique) { this.id_unique = id_unique; }

    public String getId_a() { return id_a; }
    public void setId_a(String id_a) { this.id_a = id_a; }

    public String getUrl_acceso() { return url_acceso; }
    public void setUrl_acceso(String url_acceso) { this.url_acceso = url_acceso; }

    public String getUrl_descarga() { return url_descarga; }
    public void setUrl_descarga(String url_descarga) { this.url_descarga = url_descarga; }

    public String getDescriptor() { return descriptor; }
    public void setDescriptor(String descriptor) { this.descriptor = descriptor; }

    public String getTabla() { return tabla; }
    public void setTabla(String tabla) { this.tabla = tabla; }

    public String getCampo() { return campo; }
    public void setCampo(String campo) { this.campo = campo; }

    public String getComentario_a() { return comentario_a; }
    public void setComentario_a(String comentario_a) { this.comentario_a = comentario_a; }
}