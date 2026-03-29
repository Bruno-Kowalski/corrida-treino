package com.corridaapp.corridatreino.entity;

import com.corridaapp.corridatreino.enums.FaseTreino;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "semanas_treino")
public class SemanaTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "plano_id", nullable = false)
    @JsonBackReference
    private PlanoTreino plano;

    @Column(name = "numero_semana", nullable = false)
    private Integer numeroSemana;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FaseTreino fase;

    @Column(name = "volume_total_km")
    private Double volumeTotalKm;

    @OneToMany(mappedBy = "semana", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SessaoTreino> sessoes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlanoTreino getPlano() {
        return plano;
    }

    public void setPlano(PlanoTreino plano) {
        this.plano = plano;
    }

    public Integer getNumeroSemana() {
        return numeroSemana;
    }

    public void setNumeroSemana(Integer numeroSemana) {
        this.numeroSemana = numeroSemana;
    }

    public FaseTreino getFase() {
        return fase;
    }

    public void setFase(FaseTreino fase) {
        this.fase = fase;
    }

    public Double getVolumeTotalKm() {
        return volumeTotalKm;
    }

    public void setVolumeTotalKm(Double volumeTotalKm) {
        this.volumeTotalKm = volumeTotalKm;
    }

    public List<SessaoTreino> getSessoes() {
        return sessoes;
    }

    public void setSessoes(List<SessaoTreino> sessoes) {
        this.sessoes = sessoes;
    }
}