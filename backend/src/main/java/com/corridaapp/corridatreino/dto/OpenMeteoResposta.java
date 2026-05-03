package com.corridaapp.corridatreino.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenMeteoResposta {

    @JsonProperty("current")
    private Atual atual;

    public Atual getAtual() {
        return atual;
    }

    public void setAtual(Atual atual) {
        this.atual = atual;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Atual {

        @JsonProperty("temperature_2m")
        private Double temperatura;

        @JsonProperty("relative_humidity_2m")
        private Integer umidade;

        @JsonProperty("wind_speed_10m")
        private Double velocidadeVento;

        @JsonProperty("weather_code")
        private Integer codigoClima;

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
    }
}