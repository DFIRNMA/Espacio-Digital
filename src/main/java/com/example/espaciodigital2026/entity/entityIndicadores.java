package com.example.espaciodigital2026.entity;


import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "indicadores_ambientales", schema = "armonizacion_variables")
public class entityIndicadores implements Serializable {

    @Id
    @Column(name = "id")
    public Integer id; // tu tabla dice int4 -> Integer recomendado

    @Column(name = "nombre_indicador")
    public String nombreIndicador;

    @Column(name = "tipo_indicador")
    public String tipoIndicador;

    @Column(name = "descripcion_corta")
    public String descripcionCorta;

    @Column(name = "descripcion_valor")
    public String descripcionValor;

    @Column(name = "definicion_variables")
    public String definicionVariables;

    @Column(name = "unidad_medida")
    public String unidadMedida;

    @Column(name = "formula_calculo")
    public String formulaCalculo;

    @Column(name = "alcance")
    public String alcance;

    @Column(name = "limitaciones")
    public String limitaciones;

    @Column(name = "relevancia")
    public String relevancia;

    @Column(name = "frase_tendencia")
    public String fraseTendencia;

    @Column(name = "notas_serie")
    public String notasSerie;

    @Column(name = "cobertura")
    public String cobertura;

    @Column(name = "desagregacion")
    public String desagregacion;

    @Column(name = "metodo_captura")
    public String metodoCaptura;

    @Column(name = "disponibilidad_datos")
    public String disponibilidadDatos;

    @Column(name = "periodicidad_datos")
    public String periodicidadDatos;

    @Column(name = "periodo_disponible")
    public String periodoDisponible;

    @Column(name = "periodicidad_actualizacion")
    public String periodicidadActualizacion;

    @Column(name = "relacion_politicas_ambientales")
    public String relacionPoliticasAmbientales;

    @Column(name = "tabla_graficos")
    public String tablaGraficos;

    // Si en BD es json/jsonb, mejor declarar columnDefinition:
    @Column(name = "tabla_datos", columnDefinition = "jsonb")
    public String tablaDatos;

    @Column(name = "fuente_datos")
    public String fuenteDatos;

    @Column(name = "requisitos_coordinacion")
    public String requisitosCoordinacion;

    // IMPORTANTE: Constructor vacío requerido por JPA
    public entityIndicadores() {}

    // Getters/Setters (los tuyos están bien)
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombreIndicador() { return nombreIndicador; }
    public void setNombreIndicador(String nombreIndicador) { this.nombreIndicador = nombreIndicador; }

    public String getTipoIndicador() { return tipoIndicador; }
    public void setTipoIndicador(String tipoIndicador) { this.tipoIndicador = tipoIndicador; }

    public String getDescripcionCorta() { return descripcionCorta; }
    public void setDescripcionCorta(String descripcionCorta) { this.descripcionCorta = descripcionCorta; }

    public String getDescripcionValor() { return descripcionValor; }
    public void setDescripcionValor(String descripcionValor) { this.descripcionValor = descripcionValor; }

    public String getDefinicionVariables() { return definicionVariables; }
    public void setDefinicionVariables(String definicionVariables) { this.definicionVariables = definicionVariables; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public String getFormulaCalculo() { return formulaCalculo; }
    public void setFormulaCalculo(String formulaCalculo) { this.formulaCalculo = formulaCalculo; }

    public String getAlcance() { return alcance; }
    public void setAlcance(String alcance) { this.alcance = alcance; }

    public String getLimitaciones() { return limitaciones; }
    public void setLimitaciones(String limitaciones) { this.limitaciones = limitaciones; }

    public String getRelevancia() { return relevancia; }
    public void setRelevancia(String relevancia) { this.relevancia = relevancia; }

    public String getFraseTendencia() { return fraseTendencia; }
    public void setFraseTendencia(String fraseTendencia) { this.fraseTendencia = fraseTendencia; }

    public String getNotasSerie() { return notasSerie; }
    public void setNotasSerie(String notasSerie) { this.notasSerie = notasSerie; }

    public String getCobertura() { return cobertura; }
    public void setCobertura(String cobertura) { this.cobertura = cobertura; }

    public String getDesagregacion() { return desagregacion; }
    public void setDesagregacion(String desagregacion) { this.desagregacion = desagregacion; }

    public String getMetodoCaptura() { return metodoCaptura; }
    public void setMetodoCaptura(String metodoCaptura) { this.metodoCaptura = metodoCaptura; }

    public String getDisponibilidadDatos() { return disponibilidadDatos; }
    public void setDisponibilidadDatos(String disponibilidadDatos) { this.disponibilidadDatos = disponibilidadDatos; }

    public String getPeriodicidadDatos() { return periodicidadDatos; }
    public void setPeriodicidadDatos(String periodicidadDatos) { this.periodicidadDatos = periodicidadDatos; }

    public String getPeriodoDisponible() { return periodoDisponible; }
    public void setPeriodoDisponible(String periodoDisponible) { this.periodoDisponible = periodoDisponible; }

    public String getPeriodicidadActualizacion() { return periodicidadActualizacion; }
    public void setPeriodicidadActualizacion(String periodicidadActualizacion) { this.periodicidadActualizacion = periodicidadActualizacion; }

    public String getRelacionPoliticasAmbientales() { return relacionPoliticasAmbientales; }
    public void setRelacionPoliticasAmbientales(String relacionPoliticasAmbientales) { this.relacionPoliticasAmbientales = relacionPoliticasAmbientales; }

    public String getTablaGraficos() { return tablaGraficos; }
    public void setTablaGraficos(String tablaGraficos) { this.tablaGraficos = tablaGraficos; }

    public String getTablaDatos() { return tablaDatos; }
    public void setTablaDatos(String tablaDatos) { this.tablaDatos = tablaDatos; }

    public String getFuenteDatos() { return fuenteDatos; }
    public void setFuenteDatos(String fuenteDatos) { this.fuenteDatos = fuenteDatos; }

    public String getRequisitosCoordinacion() { return requisitosCoordinacion; }
    public void setRequisitosCoordinacion(String requisitosCoordinacion) { this.requisitosCoordinacion = requisitosCoordinacion; }
}