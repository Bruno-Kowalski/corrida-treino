package com.corridaapp.corridatreino.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "registros_treino")
public class RegistroTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sessao_id", nullable = false)
    private SessaoTreino sessao;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private Boolean realizado = false;

    @Column(name = "distancia_real_km")
    private Double distanciaRealKm;

    private String observacao;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SessaoTreino getSessao() {
        return sessao;
    }

    public void setSessao(SessaoTreino sessao) {
        this.sessao = sessao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Boolean getRealizado() {
        return realizado;
    }

    public void setRealizado(Boolean realizado) {
        this.realizado = realizado;
    }

    public Double getDistanciaRealKm() {
        return distanciaRealKm;
    }

    public void setDistanciaRealKm(Double distanciaRealKm) {
        this.distanciaRealKm = distanciaRealKm;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}