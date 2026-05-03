package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.dto.OpenMeteoResposta;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OpenMeteoIntegracaoTest {

    @Autowired
    private OpenMeteoService openMeteoService;

    @Test
    void deveBuscarDadosClimaticosComCoordenadaValida() {
        // Coordenadas de São Paulo
        Double lat = -23.5505;
        Double lng = -46.6333;

        OpenMeteoResposta resposta = openMeteoService.buscarClima(lat, lng);

        assertNotNull(resposta, "Resposta não deve ser nula");
        assertNotNull(resposta.getAtual(), "Dados atuais não devem ser nulos");
        assertNotNull(resposta.getAtual().getTemperatura(), "Temperatura não deve ser nula");
        assertNotNull(resposta.getAtual().getUmidade(), "Umidade não deve ser nula");
        assertNotNull(resposta.getAtual().getVelocidadeVento(), "Velocidade do vento não deve ser nula");
    }

    @Test
    void deveRetornarTemperaturaEmFaixaRazoavel() {
        Double lat = -23.5505;
        Double lng = -46.6333;

        OpenMeteoResposta resposta = openMeteoService.buscarClima(lat, lng);

        Double temperatura = resposta.getAtual().getTemperatura();
        assertTrue(temperatura >= -50 && temperatura <= 60,
                "Temperatura deve estar em faixa razoável: " + temperatura);
    }
}