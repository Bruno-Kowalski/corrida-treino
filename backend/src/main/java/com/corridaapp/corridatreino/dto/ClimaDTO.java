package com.corridaapp.corridatreino.dto;

public class ClimaDTO {

    private Double temperatura;
    private Integer umidade;
    private Double velocidadeVento;
    private Integer codigoClima;
    private String descricaoClima;

    public Double getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(Double temperatura) {
        this.temperatura = temperatura;
    }

    public Integer getUmidade() {
        return umidade;
    }

    public void setUmidade(Integer umidade) {
        this.umidade = umidade;
    }

    public Double getVelocidadeVento() {
        return velocidadeVento;
    }

    public void setVelocidadeVento(Double velocidadeVento) {
        this.velocidadeVento = velocidadeVento;
    }

    public Integer getCodigoClima() {
        return codigoClima;
    }

    public void setCodigoClima(Integer codigoClima) {
        this.codigoClima = codigoClima;
    }

    public String getDescricaoClima() {
        return descricaoClima;
    }

    public void setDescricaoClima(String descricaoClima) {
        this.descricaoClima = descricaoClima;
    }
}