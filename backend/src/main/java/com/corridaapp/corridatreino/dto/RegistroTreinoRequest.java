package com.corridaapp.corridatreino.dto;

import jakarta.validation.constraints.NotNull;

public class RegistroTreinoRequest {

    @NotNull(message = "Informe se o treino foi realizado")
    private Boolean realizado;

    private Double distanciaRealKm;

    private String observacao;

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