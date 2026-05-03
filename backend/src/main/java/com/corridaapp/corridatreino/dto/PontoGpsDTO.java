package com.corridaapp.corridatreino.dto;

import java.time.LocalDateTime;

public class PontoGpsDTO {

    private Double lat;
    private Double lng;
    private Double altitudeM;
    private LocalDateTime registradoEm;

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

    public Double getAltitudeM() {
        return altitudeM;
    }

    public void setAltitudeM(Double altitudeM) {
        this.altitudeM = altitudeM;
    }

    public LocalDateTime getRegistradoEm() {
        return registradoEm;
    }

    public void setRegistradoEm(LocalDateTime registradoEm) {
        this.registradoEm = registradoEm;
    }
}