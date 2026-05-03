package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.dto.OpenMeteoResposta;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OpenMeteoService {

    private static final String URL_BASE = "https://api.open-meteo.com/v1/forecast" +
            "?latitude={lat}&longitude={lng}" +
            "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";

    private final RestTemplate restTemplate;

    public OpenMeteoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public OpenMeteoResposta buscarClima(Double lat, Double lng) {
        return restTemplate.getForObject(URL_BASE, OpenMeteoResposta.class, lat, lng);
    }
}