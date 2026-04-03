package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.entity.PlanoTreino;
import com.corridaapp.corridatreino.entity.SemanaTreino;
import com.corridaapp.corridatreino.entity.SessaoTreino;
import com.corridaapp.corridatreino.enums.DiaSemana;
import com.corridaapp.corridatreino.enums.FaseTreino;
import com.corridaapp.corridatreino.enums.NivelExperiencia;
import com.corridaapp.corridatreino.enums.ObjetivoCorrida;
import com.corridaapp.corridatreino.enums.TipoSessao;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class PeriodizacaoService {

    private static final int MINIMO_DIAS_TREINO = 3;
    private static final int MINIMO_SEMANAS_PLANO = 4;

    // ── Validações ────────────────────────────────────────────────────────────

    private void validarDiasDisponiveis(List<DiaSemana> diasDisponiveis) {
        if (diasDisponiveis == null || diasDisponiveis.size() < MINIMO_DIAS_TREINO) {
            throw new IllegalArgumentException(
                    "Você deve ter no mínimo 3 dias disponíveis para treinar.");
        }
    }

    private void validarDataProva(LocalDate dataProva) {
        long semanasAteProva = ChronoUnit.WEEKS.between(LocalDate.now(), dataProva);
        if (semanasAteProva < MINIMO_SEMANAS_PLANO) {
            throw new IllegalArgumentException(
                    "Data da prova muito próxima, impossível gerar um plano de treinamento.");
        }
    }

    // ── Etapa 1: calcular número de semanas ───────────────────────────────────

    public int calcularSemanas(LocalDate dataProva, ObjetivoCorrida objetivo) {
        int semanasRestantes = (int) ChronoUnit.WEEKS.between(LocalDate.now(), dataProva);
        int minimoSemanas = minimoSemanas(objetivo);
        // Respeita exatamente o que o usuário tem disponível;
        // usa o mínimo do objetivo apenas se restar mais tempo do que ele.
        return Math.min(semanasRestantes, Math.max(semanasRestantes, minimoSemanas));
    }

    private int minimoSemanas(ObjetivoCorrida objetivo) {
        return switch (objetivo) {
            case CINCO_KM -> 6;
            case DEZ_KM -> 8;
            case MEIA_MARATONA -> 12;
        };
    }

    // ── Etapa 2: volume base semanal em km ────────────────────────────────────

    private double volumeBase(ObjetivoCorrida objetivo, NivelExperiencia nivel) {
        return switch (objetivo) {
            case CINCO_KM -> switch (nivel) {
                case INICIANTE -> 15.0;
                case INTERMEDIARIO -> 25.0;
                case AVANCADO -> 35.0;
            };
            case DEZ_KM -> switch (nivel) {
                case INICIANTE -> 20.0;
                case INTERMEDIARIO -> 30.0;
                case AVANCADO -> 45.0;
            };
            case MEIA_MARATONA -> switch (nivel) {
                case INICIANTE -> 30.0;
                case INTERMEDIARIO -> 45.0;
                case AVANCADO -> 60.0;
            };
        };
    }

    // ── Etapa 3: definir fase de cada semana ─────────────────────────────────

    private FaseTreino definirFase(int numeroSemana, int totalSemanas) {
        double progresso = (double) numeroSemana / totalSemanas;
        if (progresso <= 0.40)
            return FaseTreino.BASE;
        if (progresso <= 0.70)
            return FaseTreino.DESENVOLVIMENTO;
        if (progresso <= 0.90)
            return FaseTreino.PICO;
        return FaseTreino.TAPER;
    }

    private double multiplicadorFase(FaseTreino fase, int numeroSemana, int totalSemanas) {
        return switch (fase) {
            case BASE -> 1.0 + (numeroSemana - 1) * 0.08;
            case DESENVOLVIMENTO -> 1.3 + (numeroSemana - 1) * 0.06;
            case PICO -> 1.6;
            case TAPER -> 0.7;
        };
    }

    // ── Etapa 4: distribuir sessões por dias disponíveis ─────────────────────

    private List<SessaoTreino> distribuirSessoes(List<DiaSemana> diasDisponiveis,
            FaseTreino fase,
            double volumeSemana,
            int paceMedioSegundos) {
        List<SessaoTreino> sessoes = new ArrayList<>();
        int numDias = diasDisponiveis.size();
        List<TipoSessao> tipos = definirTiposPorDias(numDias, fase);

        for (int i = 0; i < Math.min(numDias, tipos.size()); i++) {
            TipoSessao tipo = tipos.get(i);
            DiaSemana dia = diasDisponiveis.get(i);

            SessaoTreino sessao = new SessaoTreino();
            sessao.setDiaSemana(dia);
            sessao.setTipo(tipo);
            sessao.setDistanciaKm(calcularDistancia(tipo, volumeSemana, numDias));
            sessao.setPaceAlvo(calcularPaceAlvo(tipo, paceMedioSegundos));
            sessao.setDescricao(gerarDescricao(tipo));
            sessoes.add(sessao);
        }

        return sessoes;
    }

    private List<TipoSessao> definirTiposPorDias(int numDias, FaseTreino fase) {
        List<TipoSessao> tipos = new ArrayList<>();

        if (numDias >= 3) {
            tipos.add(TipoSessao.LONGO);
            tipos.add(TipoSessao.RECUPERACAO);
            tipos.add(TipoSessao.TEMPO);
        }
        if (numDias >= 4) {
            tipos.add(1, TipoSessao.INTERVALADO);
        }
        if (numDias >= 5) {
            tipos.add(TipoSessao.RECUPERACAO);
        }
        if (numDias >= 6) {
            tipos.add(2, TipoSessao.TEMPO);
        }

        return tipos;
    }

    // ── Etapa 5: calcular pace alvo por tipo de sessão ───────────────────────

    private String calcularPaceAlvo(TipoSessao tipo, int paceMedioSegundos) {
        int paceAjustado = switch (tipo) {
            case RECUPERACAO -> paceMedioSegundos + 60;
            case LONGO -> paceMedioSegundos + 30;
            case TEMPO -> paceMedioSegundos - 15;
            case INTERVALADO -> paceMedioSegundos - 30;
        };

        int minutos = paceAjustado / 60;
        int segundos = paceAjustado % 60;
        return String.format("%d:%02d /km", minutos, segundos);
    }

    private double calcularDistancia(TipoSessao tipo, double volumeSemana, int numDias) {
        return switch (tipo) {
            case LONGO -> Math.round(volumeSemana * 0.35 * 10.0) / 10.0;
            case INTERVALADO -> Math.round(volumeSemana * 0.20 * 10.0) / 10.0;
            case TEMPO -> Math.round(volumeSemana * 0.25 * 10.0) / 10.0;
            case RECUPERACAO -> Math.round(volumeSemana * 0.20 * 10.0) / 10.0;
        };
    }

    private String gerarDescricao(TipoSessao tipo) {
        return switch (tipo) {
            case LONGO -> "Corrida longa em ritmo confortável. Foco em resistência aeróbica.";
            case INTERVALADO -> "Tiros em ritmo forte com recuperação entre eles. Foco em velocidade.";
            case TEMPO -> "Corrida contínua em ritmo moderado a forte. Foco em limiar anaeróbico.";
            case RECUPERACAO -> "Corrida leve em ritmo muito tranquilo. Foco em recuperação ativa.";
        };
    }

    // ── Método principal ──────────────────────────────────────────────────────

    public PlanoTreino gerarPlano(ObjetivoCorrida objetivo,
            NivelExperiencia nivel,
            LocalDate dataProva,
            int paceMedioSegundos,
            List<DiaSemana> diasDisponiveis) {

        validarDiasDisponiveis(diasDisponiveis);
        validarDataProva(dataProva);

        // Usa exatamente as semanas que o usuário tem até a prova
        int totalSemanas = (int) ChronoUnit.WEEKS.between(LocalDate.now(), dataProva);
        double volumeBase = volumeBase(objetivo, nivel);

        PlanoTreino plano = new PlanoTreino();
        plano.setObjetivo(objetivo);
        plano.setTotalSemanas(totalSemanas);

        List<SemanaTreino> semanas = new ArrayList<>();

        for (int i = 1; i <= totalSemanas; i++) {
            FaseTreino fase = definirFase(i, totalSemanas);
            double multiplicador = multiplicadorFase(fase, i, totalSemanas);
            double volumeSemana = Math.round(volumeBase * multiplicador * 10.0) / 10.0;

            SemanaTreino semana = new SemanaTreino();
            semana.setNumeroSemana(i);
            semana.setFase(fase);
            semana.setVolumeTotalKm(volumeSemana);
            semana.setPlano(plano);

            List<SessaoTreino> sessoes = distribuirSessoes(
                    diasDisponiveis, fase, volumeSemana, paceMedioSegundos);

            for (SessaoTreino sessao : sessoes) {
                sessao.setSemana(semana);
            }

            semana.setSessoes(sessoes);
            semanas.add(semana);
        }

        plano.setSemanas(semanas);
        return plano;
    }
}