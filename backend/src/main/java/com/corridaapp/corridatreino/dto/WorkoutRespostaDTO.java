package com.corridaapp.corridatreino.dto;

import java.time.LocalDateTime;
import java.util.List;

public class WorkoutRespostaDTO {

    private Long id;
    private LocalDateTime iniciadoEm;
    private LocalDateTime finalizadoEm;
    private Integer distanciaTotalMetros;
    private Integer duracaoTotalSegundos;
    private Integer paceMediaSegundosPorKm;
    private String paceMediaFormatado;
    private String descricao;
    private Boolean registered;
    private Long sessaoTreinoId;
    private Double distanciaMetaKm;
    private String ritmoAlvo;
    private String tipoTreino;
    private Double ganhoElevacaoM;
    private Double perdaElevacaoM;
    private List<SegmentoRespostaDTO> segmentos;
    private ClimaDTO clima;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getIniciadoEm() {
        return iniciadoEm;
    }

    public void setIniciadoEm(LocalDateTime iniciadoEm) {
        this.iniciadoEm = iniciadoEm;
    }

    public LocalDateTime getFinalizadoEm() {
        return finalizadoEm;
    }

    public void setFinalizadoEm(LocalDateTime finalizadoEm) {
        this.finalizadoEm = finalizadoEm;
    }

    public Integer getDistanciaTotalMetros() {
        return distanciaTotalMetros;
    }

    public void setDistanciaTotalMetros(Integer distanciaTotalMetros) {
        this.distanciaTotalMetros = distanciaTotalMetros;
    }

    public Integer getDuracaoTotalSegundos() {
        return duracaoTotalSegundos;
    }

    public void setDuracaoTotalSegundos(Integer duracaoTotalSegundos) {
        this.duracaoTotalSegundos = duracaoTotalSegundos;
    }

    public Integer getPaceMediaSegundosPorKm() {
        return paceMediaSegundosPorKm;
    }

    public void setPaceMediaSegundosPorKm(Integer paceMediaSegundosPorKm) {
        this.paceMediaSegundosPorKm = paceMediaSegundosPorKm;
    }

    public String getPaceMediaFormatado() {
        return paceMediaFormatado;
    }

    public void setPaceMediaFormatado(String paceMediaFormatado) {
        this.paceMediaFormatado = paceMediaFormatado;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Boolean getRegistered() {
        return registered;
    }

    public void setRegistered(Boolean registered) {
        this.registered = registered;
    }

    public Long getSessaoTreinoId() {
        return sessaoTreinoId;
    }

    public void setSessaoTreinoId(Long sessaoTreinoId) {
        this.sessaoTreinoId = sessaoTreinoId;
    }

    public Double getDistanciaMetaKm() {
        return distanciaMetaKm;
    }

    public void setDistanciaMetaKm(Double distanciaMetaKm) {
        this.distanciaMetaKm = distanciaMetaKm;
    }

    public String getRitmoAlvo() {
        return ritmoAlvo;
    }

    public void setRitmoAlvo(String ritmoAlvo) {
        this.ritmoAlvo = ritmoAlvo;
    }

    public String getTipoTreino() {
        return tipoTreino;
    }

    public void setTipoTreino(String tipoTreino) {
        this.tipoTreino = tipoTreino;
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

    public List<SegmentoRespostaDTO> getSegmentos() {
        return segmentos;
    }

    public void setSegmentos(List<SegmentoRespostaDTO> segmentos) {
        this.segmentos = segmentos;
    }

    public ClimaDTO getClima() {
        return clima;
    }

    public void setClima(ClimaDTO clima) {
        this.clima = clima;
    }
}
