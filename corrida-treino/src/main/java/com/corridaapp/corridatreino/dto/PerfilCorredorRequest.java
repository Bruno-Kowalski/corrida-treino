package com.corridaapp.corridatreino.dto;

import com.corridaapp.corridatreino.enums.DiaSemana;
import com.corridaapp.corridatreino.enums.NivelExperiencia;
import com.corridaapp.corridatreino.enums.ObjetivoCorrida;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class PerfilCorredorRequest {

    @NotNull(message = "Nível de experiência é obrigatório")
    private NivelExperiencia nivelExperiencia;

    @NotNull(message = "Objetivo é obrigatório")
    private ObjetivoCorrida objetivo;

    @NotNull(message = "Pace médio é obrigatório")
    private Integer paceMedioSegundos;

    @NotNull(message = "Data da prova é obrigatória")
    private LocalDate dataProva;

    @NotEmpty(message = "Informe ao menos um dia disponível")
    private List<DiaSemana> diasDisponiveis;

    public NivelExperiencia getNivelExperiencia() {
        return nivelExperiencia;
    }

    public void setNivelExperiencia(NivelExperiencia nivelExperiencia) {
        this.nivelExperiencia = nivelExperiencia;
    }

    public ObjetivoCorrida getObjetivo() {
        return objetivo;
    }

    public void setObjetivo(ObjetivoCorrida objetivo) {
        this.objetivo = objetivo;
    }

    public Integer getPaceMedioSegundos() {
        return paceMedioSegundos;
    }

    public void setPaceMedioSegundos(Integer paceMedioSegundos) {
        this.paceMedioSegundos = paceMedioSegundos;
    }

    public LocalDate getDataProva() {
        return dataProva;
    }

    public void setDataProva(LocalDate dataProva) {
        this.dataProva = dataProva;
    }

    public List<DiaSemana> getDiasDisponiveis() {
        return diasDisponiveis;
    }

    public void setDiasDisponiveis(List<DiaSemana> diasDisponiveis) {
        this.diasDisponiveis = diasDisponiveis;
    }
}