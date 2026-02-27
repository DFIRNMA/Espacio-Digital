package com.example.espaciodigital2026.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "variables", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "id_a",
    "id_fuente",
    "acronimo",
    "id_s",
    "variable_s",
    "variable_a",
    "url",
    "pregunta",
    "definicion",
    "universo",
    "anio_referencia",
    "tematica",
    "tema1",
    "subtema1",
    "tema2",
    "subtema2",
    "tabulados",
    "microdatos",
    "datosabiertos",
    "mdea",
    "ods",
    "comentario_s",
    "comentario_a"
})
public class entityVariables {

    @Id
    @Column(name = "id_a", columnDefinition = "text")
    private String id_a;

    @Column(name = "id_fuente", columnDefinition = "text")
    private String id_fuente;

    @Column(name = "acronimo", columnDefinition = "text")
    private String acronimo;

    @Column(name = "id_s", columnDefinition = "text")
    private String id_s;

    @Column(name = "variable_s", columnDefinition = "text")
    private String variable_s;

    @Column(name = "variable_a", columnDefinition = "text")
    private String variable_a;

    @Column(name = "url", columnDefinition = "text")
    private String url;

    @Column(name = "pregunta", columnDefinition = "text")
    private String pregunta;

    @Column(name = "definicion", columnDefinition = "text")
    private String definicion;

    @Column(name = "universo", columnDefinition = "text")
    private String universo;

    @Column(name = "anio_referencia", columnDefinition = "text")
    private String anio_referencia;

    @Column(name = "tematica", columnDefinition = "text")
    private String tematica;

    @Column(name = "tema1", columnDefinition = "text")
    private String tema1;

    @Column(name = "subtema1", columnDefinition = "text")
    private String subtema1;

    @Column(name = "tema2", columnDefinition = "text")
    private String tema2;

    @Column(name = "subtema2", columnDefinition = "text")
    private String subtema2;

    @Column(name = "tabulados")
    private Boolean tabulados;

    @Column(name = "microdatos", columnDefinition = "text")
    private String microdatos;

    @Column(name = "datosabiertos")
    private Boolean datosabiertos;

    @Column(name = "mdea")
    private Boolean mdea;

    @Column(name = "ods")
    private Boolean ods;

    @Column(name = "comentario_s", columnDefinition = "text")
    private String comentario_s;

    @Column(name = "comentario_a", columnDefinition = "text")
    private String comentario_a;

    // --- Getters y Setters ---

    public String getId_a() { return id_a; }
    public void setId_a(String id_a) { this.id_a = id_a; }

    public String getId_fuente() { return id_fuente; }
    public void setId_fuente(String id_fuente) { this.id_fuente = id_fuente; }

    public String getAcronimo() { return acronimo; }
    public void setAcronimo(String acronimo) { this.acronimo = acronimo; }

    public String getId_s() { return id_s; }
    public void setId_s(String id_s) { this.id_s = id_s; }

    public String getVariable_s() { return variable_s; }
    public void setVariable_s(String variable_s) { this.variable_s = variable_s; }

    public String getVariable_a() { return variable_a; }
    public void setVariable_a(String variable_a) { this.variable_a = variable_a; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getPregunta() { return pregunta; }
    public void setPregunta(String pregunta) { this.pregunta = pregunta; }

    public String getDefinicion() { return definicion; }
    public void setDefinicion(String definicion) { this.definicion = definicion; }

    public String getUniverso() { return universo; }
    public void setUniverso(String universo) { this.universo = universo; }

    public String getAnio_referencia() { return anio_referencia; }
    public void setAnio_referencia(String anio_referencia) { this.anio_referencia = anio_referencia; }

    public String getTematica() { return tematica; }
    public void setTematica(String tematica) { this.tematica = tematica; }

    public String getTema1() { return tema1; }
    public void setTema1(String tema1) { this.tema1 = tema1; }

    public String getSubtema1() { return subtema1; }
    public void setSubtema1(String subtema1) { this.subtema1 = subtema1; }

    public String getTema2() { return tema2; }
    public void setTema2(String tema2) { this.tema2 = tema2; }

    public String getSubtema2() { return subtema2; }
    public void setSubtema2(String subtema2) { this.subtema2 = subtema2; }

    public Boolean getTabulados() { return tabulados; }
    public void setTabulados(Boolean tabulados) { this.tabulados = tabulados; }

    public String getMicrodatos() { return microdatos; }
    public void setMicrodatos(String microdatos) { this.microdatos = microdatos; }

    public Boolean getDatosabiertos() { return datosabiertos; }
    public void setDatosabiertos(Boolean datosabiertos) { this.datosabiertos = datosabiertos; }

    public Boolean getMdea() { return mdea; }
    public void setMdea(Boolean mdea) { this.mdea = mdea; }

    public Boolean getOds() { return ods; }
    public void setOds(Boolean ods) { this.ods = ods; }

    public String getComentario_s() { return comentario_s; }
    public void setComentario_s(String comentario_s) { this.comentario_s = comentario_s; }

    public String getComentario_a() { return comentario_a; }
    public void setComentario_a(String comentario_a) { this.comentario_a = comentario_a; }
}