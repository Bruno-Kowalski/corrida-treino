package com.corridaapp.corridatreino.dto;

public class IniciarWorkoutDTO {

    private Double lat;
    private Double lng;
    private Integer intervaloSegmentosMetros;
    private Long sessaoTreinoId;
    private Double distanciaMetaKm;
    private String ritmoAlvo;
    private String tipoTreino;

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public Integer getIntervaloSegmentosMetros() {
        return intervaloSegmentosMetros;
    }

    public void setIntervaloSegmentosMetros(Integer intervaloSegmentosMetros) {
        this.intervaloSegmentosMetros = intervaloSegmentosMetros;
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
}
