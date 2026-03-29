package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.entity.PlanoTreino;
import com.corridaapp.corridatreino.entity.SemanaTreino;
import com.corridaapp.corridatreino.entity.SessaoTreino;
import com.corridaapp.corridatreino.enums.DiaSemana;
import com.corridaapp.corridatreino.enums.FaseTreino;
import com.corridaapp.corridatreino.enums.NivelExperiencia;
import com.corridaapp.corridatreino.enums.ObjetivoCorrida;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PeriodizacaoServiceTest {

    private PeriodizacaoService periodizacaoService;

    @BeforeEach
    void setUp() {
        periodizacaoService = new PeriodizacaoService();
    }

    @Test
    void deveCalcularNumeroCorretoDeSemanasParaMeiaMaratona() {
        // Arrange
        LocalDate dataProva = LocalDate.now().plusWeeks(14);
        ObjetivoCorrida objetivo = ObjetivoCorrida.MEIA_MARATONA;

        // Act
        int semanas = periodizacaoService.calcularSemanas(dataProva, objetivo);

        // Assert
        assertTrue(semanas >= 12, "Meia maratona deve ter no mínimo 12 semanas");
        assertTrue(semanas <= 16, "Número de semanas calculado deve ser razoável");
    }

    @Test
    void deveCalcularNumeroCorretoDeSemanasParaDezKm() {
        // Arrange
        LocalDate dataProva = LocalDate.now().plusWeeks(10);
        ObjetivoCorrida objetivo = ObjetivoCorrida.DEZ_KM;

        // Act
        int semanas = periodizacaoService.calcularSemanas(dataProva, objetivo);

        // Assert
        assertTrue(semanas >= 8, "10K deve ter no mínimo 8 semanas");
    }

    @Test
    void deveCalcularNumeroCorretoDeSemanasParaCincoKm() {
        // Arrange
        LocalDate dataProva = LocalDate.now().plusWeeks(8);
        ObjetivoCorrida objetivo = ObjetivoCorrida.CINCO_KM;

        // Act
        int semanas = periodizacaoService.calcularSemanas(dataProva, objetivo);

        // Assert
        assertTrue(semanas >= 6, "5K deve ter no mínimo 6 semanas");
    }

    @Test
    void deveGerarPlanoComTodasAsFases() {
        // Arrange
        ObjetivoCorrida objetivo = ObjetivoCorrida.DEZ_KM;
        NivelExperiencia nivel = NivelExperiencia.INTERMEDIARIO;
        LocalDate dataProva = LocalDate.now().plusWeeks(12);
        int paceMedio = 360; // 6:00/km
        List<DiaSemana> dias = List.of(DiaSemana.SEGUNDA, DiaSemana.QUARTA, DiaSemana.SEXTA);

        // Act
        PlanoTreino plano = periodizacaoService.gerarPlano(objetivo, nivel, dataProva, paceMedio, dias);

        // Assert
        assertNotNull(plano);
        assertNotNull(plano.getSemanas());
        assertTrue(plano.getSemanas().size() >= 8);

        // Verificar que todas as 4 fases aparecem
        boolean temBase = plano.getSemanas().stream().anyMatch(s -> s.getFase() == FaseTreino.BASE);
        boolean temDesenvolvimento = plano.getSemanas().stream().anyMatch(s -> s.getFase() == FaseTreino.DESENVOLVIMENTO);
        boolean temPico = plano.getSemanas().stream().anyMatch(s -> s.getFase() == FaseTreino.PICO);
        boolean temTaper = plano.getSemanas().stream().anyMatch(s -> s.getFase() == FaseTreino.TAPER);

        assertTrue(temBase, "Plano deve ter fase BASE");
        assertTrue(temDesenvolvimento, "Plano deve ter fase DESENVOLVIMENTO");
        assertTrue(temPico, "Plano deve ter fase PICO");
        assertTrue(temTaper, "Plano deve ter fase TAPER");
    }

    @Test
    void deveGerarSessoesNoDiasDisponiveis() {
        // Arrange
        ObjetivoCorrida objetivo = ObjetivoCorrida.DEZ_KM;
        NivelExperiencia nivel = NivelExperiencia.INICIANTE;
        LocalDate dataProva = LocalDate.now().plusWeeks(12);
        int paceMedio = 360;
        List<DiaSemana> dias = List.of(DiaSemana.SEGUNDA, DiaSemana.QUARTA, DiaSemana.SEXTA);

        // Act
        PlanoTreino plano = periodizacaoService.gerarPlano(objetivo, nivel, dataProva, paceMedio, dias);

        // Assert
        for (SemanaTreino semana : plano.getSemanas()) {
            assertNotNull(semana.getSessoes());
            assertEquals(3, semana.getSessoes().size(), "Deve ter 3 sessões (3 dias disponíveis)");

            for (SessaoTreino sessao : semana.getSessoes()) {
                assertTrue(dias.contains(sessao.getDiaSemana()),
                        "Sessão deve estar em um dos dias disponíveis");
            }
        }
    }

    @Test
    void deveGerarVolumeCrescenteNaFaseBase() {
        // Arrange
        ObjetivoCorrida objetivo = ObjetivoCorrida.DEZ_KM;
        NivelExperiencia nivel = NivelExperiencia.INTERMEDIARIO;
        LocalDate dataProva = LocalDate.now().plusWeeks(12);
        int paceMedio = 360;
        List<DiaSemana> dias = List.of(DiaSemana.SEGUNDA, DiaSemana.QUARTA, DiaSemana.SEXTA);

        // Act
        PlanoTreino plano = periodizacaoService.gerarPlano(objetivo, nivel, dataProva, paceMedio, dias);

        // Assert
        List<SemanaTreino> semanasBase = plano.getSemanas().stream()
                .filter(s -> s.getFase() == FaseTreino.BASE)
                .toList();

        for (int i = 1; i < semanasBase.size(); i++) {
            double volumeAnterior = semanasBase.get(i - 1).getVolumeTotalKm();
            double volumeAtual = semanasBase.get(i).getVolumeTotalKm();
            assertTrue(volumeAtual >= volumeAnterior,
                    "Volume deve crescer ou manter na fase BASE");
        }
    }

    @Test
    void deveGerarVolumeReduzidoNaFaseTaper() {
        // Arrange
        ObjetivoCorrida objetivo = ObjetivoCorrida.MEIA_MARATONA;
        NivelExperiencia nivel = NivelExperiencia.AVANCADO;
        LocalDate dataProva = LocalDate.now().plusWeeks(14);
        int paceMedio = 300; // 5:00/km
        List<DiaSemana> dias = List.of(DiaSemana.SEGUNDA, DiaSemana.QUARTA, DiaSemana.SEXTA);

        // Act
        PlanoTreino plano = periodizacaoService.gerarPlano(objetivo, nivel, dataProva, paceMedio, dias);

        // Assert
        List<SemanaTreino> semanasTaper = plano.getSemanas().stream()
                .filter(s -> s.getFase() == FaseTreino.TAPER)
                .toList();

        assertFalse(semanasTaper.isEmpty(), "Deve existir semana TAPER");

        double volumeMedioGeral = plano.getSemanas().stream()
                .filter(s -> s.getFase() != FaseTreino.TAPER)
                .mapToDouble(SemanaTreino::getVolumeTotalKm)
                .average()
                .orElse(0);

        for (SemanaTreino taper : semanasTaper) {
            assertTrue(taper.getVolumeTotalKm() < volumeMedioGeral,
                    "Volume no TAPER deve ser menor que a média geral");
        }
    }

    @Test
    void deveTerPeloMenosUmTreinoLongoPorSemana() {
        // Arrange
        ObjetivoCorrida objetivo = ObjetivoCorrida.DEZ_KM;
        NivelExperiencia nivel = NivelExperiencia.INTERMEDIARIO;
        LocalDate dataProva = LocalDate.now().plusWeeks(12);
        int paceMedio = 360;
        List<DiaSemana> dias = List.of(DiaSemana.SEGUNDA, DiaSemana.QUARTA, DiaSemana.SEXTA);

        // Act
        PlanoTreino plano = periodizacaoService.gerarPlano(objetivo, nivel, dataProva, paceMedio, dias);

        // Assert
        for (SemanaTreino semana : plano.getSemanas()) {
            long treinosLongos = semana.getSessoes().stream()
                    .filter(s -> s.getTipo().toString().equals("LONGO"))
                    .count();
            assertTrue(treinosLongos >= 1, "Cada semana deve ter pelo menos 1 treino longo");
        }
    }

    @Test
    void deveGerarPaceAjustadoPorTipoSessao() {
        // Arrange
        ObjetivoCorrida objetivo = ObjetivoCorrida.DEZ_KM;
        NivelExperiencia nivel = NivelExperiencia.INTERMEDIARIO;
        LocalDate dataProva = LocalDate.now().plusWeeks(10);
        int paceMedio = 360; // 6:00/km
        List<DiaSemana> dias = List.of(DiaSemana.SEGUNDA, DiaSemana.QUARTA, DiaSemana.SEXTA, DiaSemana.SABADO);

        // Act
        PlanoTreino plano = periodizacaoService.gerarPlano(objetivo, nivel, dataProva, paceMedio, dias);

        // Assert
        for (SemanaTreino semana : plano.getSemanas()) {
            for (SessaoTreino sessao : semana.getSessoes()) {
                assertNotNull(sessao.getPaceAlvo());
                assertTrue(sessao.getPaceAlvo().matches("\\d+:\\d{2} /km"),
                        "Pace deve estar no formato correto (ex: 6:00 /km)");
            }
        }
    }
}