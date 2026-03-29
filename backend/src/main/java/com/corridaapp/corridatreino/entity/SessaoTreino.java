package com.corridaapp.corridatreino.entity;

import com.corridaapp.corridatreino.enums.DiaSemana;
import com.corridaapp.corridatreino.enums.TipoSessao;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "sessoes_treino")
public class SessaoTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "semana_id", nullable = false)
    @JsonBackReference
    private SemanaTreino semana;

    @Enumerated(EnumType.STRING)
    @Column(name = "dia_semana", nullable = false)
    private DiaSemana diaSemana;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoSessao tipo;

    @Column(name = "distancia_km")
    private Double distanciaKm;

    @Column(name = "pace_alvo")
    private String paceAlvo;

    private String descricao;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SemanaTreino getSemana() {
        return semana;
    }

    public void setSemana(SemanaTreino semana) {
        this.semana = semana;
    }

    public DiaSemana getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(DiaSemana diaSemana) {
        this.diaSemana = diaSemana;
    }

    public TipoSessao getTipo() {
        return tipo;
    }

    public void setTipo(TipoSessao tipo) {
        this.tipo = tipo;
    }

    public Double getDistanciaKm() {
        return distanciaKm;
    }

    public void setDistanciaKm(Double distanciaKm) {
        this.distanciaKm = distanciaKm;
    }

    public String getPaceAlvo() {
        return paceAlvo;
    }

    public void setPaceAlvo(String paceAlvo) {
        this.paceAlvo = paceAlvo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}