package com.corridaapp.corridatreino.dto;

public class SegmentoRespostaDTO {

    private Integer indice;
    private Integer distanciaMetros;
    private Integer duracaoSegundos;
    private String paceFormatado;
    private Double ganhoElevacaoM;
    private Double perdaElevacaoM;

    public Integer getIndice() {
        return indice;
    }

    public void setIndice(Integer indice) {
        this.indice = indice;
    }

    public Integer getDistanciaMetros() {
        return distanciaMetros;
    }

    public void setDistanciaMetros(Integer distanciaMetros) {
        this.distanciaMetros = distanciaMetros;
    }

    public Integer getDuracaoSegundos() {
        return duracaoSegundos;
    }

    public void setDuracaoSegundos(Integer duracaoSegundos) {
        this.duracaoSegundos = duracaoSegundos;
    }

    public String getPaceFormatado() {
        return paceFormatado;
    }

    public void setPaceFormatado(String paceFormatado) {
        this.paceFormatado = paceFormatado;
    }

    public Double getGanhoElevacaoM() {
        return ganhoElevacaoM;
    }

    public void setGanhoElevacaoM(Double ganhoElevacaoM) {
        this.ganhoElevacaoM = ganhoElevacaoM;
    }

    public Double getPerdaElevacaoM() {
        return perdaElevacaoM;
    }

    public void setPerdaElevacaoM(Double perdaElevacaoM) {
        this.perdaElevacaoM = perdaElevacaoM;
    }
}