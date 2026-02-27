package com.example.espaciodigital2026.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "procesos", schema = "armonizacion_variables")
@JsonPropertyOrder({
    "acronimo",
    "proceso",
    "metodo",
    "objetivo",
    "pobjeto",
    "uobservacion",
    "unidad",
    "periodicidad",
    "iin",
    "estatus",
    "ipi",
    "comentario_s",
    "comentario_a"
})
public class entityProcesos {

    @Id
    @Column(name = "acronimo", columnDefinition = "text")
    private String acronimo;

    @Column(name = "proceso", columnDefinition = "text")
    private String proceso;

    @Column(name = "metodo", columnDefinition = "text")
    private String metodo;

    @Column(name = "objetivo", columnDefinition = "text")
    private String objetivo;

    @Column(name = "pobjeto", columnDefinition = "text")
    private String pobjeto;

    @Column(name = "uobservacion", columnDefinition = "text")
    private String uobservacion;

    @Column(name = "unidad", columnDefinition = "text")
    private String unidad;

    @Column(name = "periodicidad", columnDefinition = "text")
    private String periodicidad;

    @Column(name = "iin", columnDefinition = "text")
    private String iin;

    @Column(name = "estatus", columnDefinition = "text")
    private String estatus;

    @Column(name = "ipi", columnDefinition = "text")
    private String ipi;

    @Column(name = "comentario_s", columnDefinition = "text")
    private String comentario_s;

    @Column(name = "comentario_a", columnDefinition = "text")
    private String comentario_a;

    // --- Getters y Setters ---

    public String getAcronimo() { return acronimo; }
    public void setAcronimo(String acronimo) { this.acronimo = acronimo; }

    public String getProceso() { return proceso; }
    public void setProceso(String proceso) { this.proceso = proceso; }

    public String getMetodo() { return metodo; }
    public void setMetodo(String metodo) { this.metodo = metodo; }

    public String getObjetivo() { return objetivo; }
    public void setObjetivo(String objetivo) { this.objetivo = objetivo; }

    public String getPobjeto() { return pobjeto; }
    public void setPobjeto(String pobjeto) { this.pobjeto = pobjeto; }

    public String getUobservacion() { return uobservacion; }
    public void setUobservacion(String uobservacion) { this.uobservacion = uobservacion; }

    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }

    public String getPeriodicidad() { return periodicidad; }
    public void setPeriodicidad(String periodicidad) { this.periodicidad = periodicidad; }

    public String getIin() { return iin; }
    public void setIin(String iin) { this.iin = iin; }

    public String getEstatus() { return estatus; }
    public void setEstatus(String estatus) { this.estatus = estatus; }

    public String getIpi() { return ipi; }
    public void setIpi(String ipi) { this.ipi = ipi; }

    public String getComentario_s() { return comentario_s; }
    public void setComentario_s(String comentario_s) { this.comentario_s = comentario_s; }

    public String getComentario_a() { return comentario_a; }
    public void setComentario_a(String comentario_a) { this.comentario_a = comentario_a; }
}