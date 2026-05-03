package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.dto.*;
import com.corridaapp.corridatreino.entity.*;
import com.corridaapp.corridatreino.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final WorkoutPointRepository workoutPointRepository;
    private final WorkoutSegmentRepository workoutSegmentRepository;
    private final UsuarioRepository usuarioRepository;
    private final OpenMeteoService openMeteoService;

    public WorkoutService(WorkoutRepository workoutRepository,
            WorkoutPointRepository workoutPointRepository,
            WorkoutSegmentRepository workoutSegmentRepository,
            UsuarioRepository usuarioRepository,
            OpenMeteoService openMeteoService) {
        this.workoutRepository = workoutRepository;
        this.workoutPointRepository = workoutPointRepository;
        this.workoutSegmentRepository = workoutSegmentRepository;
        this.usuarioRepository = usuarioRepository;
        this.openMeteoService = openMeteoService;
    }

    public Long iniciarWorkout(Long usuarioId, IniciarWorkoutDTO dto) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (dto.getSessaoTreinoId() != null
                && workoutRepository.existsByUsuarioIdAndSessaoTreinoIdAndRegisteredTrue(usuarioId,
                        dto.getSessaoTreinoId())
                || dto.getSessaoTreinoId() != null
                        && workoutRepository.existsByUsuarioIdAndSessaoTreinoIdAndDescricaoIsNotNull(usuarioId,
                                dto.getSessaoTreinoId())) {
            throw new IllegalStateException("Este treino ja foi registrado");
        }

        Workout workout = new Workout();
        workout.setUsuario(usuario);
        workout.setStartedAt(LocalDateTime.now());
        workout.setSource("mobile");
        workout.setSegmentIntervalMeters(
                dto.getIntervaloSegmentosMetros() != null ? dto.getIntervaloSegmentosMetros() : 1000);
        workout.setSessaoTreinoId(dto.getSessaoTreinoId());
        workout.setTargetDistanceKm(dto.getDistanciaMetaKm());
        workout.setTargetPace(dto.getRitmoAlvo());
        workout.setWorkoutType(dto.getTipoTreino());
        workout.setStartLat(dto.getLat());
        workout.setStartLng(dto.getLng());

        if (dto.getLat() != null && dto.getLng() != null) {
            salvarClima(workout, buscarClima(dto.getLat(), dto.getLng()));
        }

        return workoutRepository.save(workout).getId();
    }

    public void adicionarPontos(Long workoutId, List<PontoGpsDTO> pontos) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout não encontrado"));

        List<WorkoutPoint> entidades = new ArrayList<>();
        int seq = workoutPointRepository.findByWorkoutIdOrderBySeqAsc(workoutId).size();

        for (PontoGpsDTO ponto : pontos) {
            WorkoutPoint point = new WorkoutPoint();
            point.setWorkout(workout);
            point.setLat(ponto.getLat());
            point.setLng(ponto.getLng());
            point.setAltitudeM(ponto.getAltitudeM());
            point.setRecordedAt(ponto.getRegistradoEm() != null ? ponto.getRegistradoEm() : LocalDateTime.now());
            point.setSeq(seq++);
            entidades.add(point);
        }

        workoutPointRepository.saveAll(entidades);
    }

    public WorkoutRespostaDTO finalizarWorkout(Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout não encontrado"));

        workout.setEndedAt(LocalDateTime.now());

        List<WorkoutPoint> pontos = workoutPointRepository.findByWorkoutIdOrderBySeqAsc(workoutId);

        List<WorkoutSegment> segmentos = new ArrayList<>();

        // Permite finalizar mesmo com menos de 2 pontos (ex: teste no desktop)
        if (pontos.size() >= 2) {
            segmentos = calcularSegmentos(workout, pontos);
            workoutSegmentRepository.saveAll(segmentos);

            int distanciaTotal = segmentos.stream().mapToInt(WorkoutSegment::getDistanceMeters).sum();
            int duracaoTotal = segmentos.stream().mapToInt(WorkoutSegment::getDurationSeconds).sum();
            int paceMedia = duracaoTotal > 0 && distanciaTotal > 0
                    ? (duracaoTotal * 1000) / distanciaTotal
                    : 0;

            workout.setTotalDistanceMeters(distanciaTotal);
            workout.setTotalDurationSeconds(duracaoTotal);
            workout.setAvgPaceSecondsPerKm(paceMedia);
        } else {
            // Sem pontos GPS suficientes: salva só o tempo
            long duracaoTotal = java.time.Duration.between(workout.getStartedAt(), workout.getEndedAt()).getSeconds();
            workout.setTotalDistanceMeters(0);
            workout.setTotalDurationSeconds((int) duracaoTotal);
            workout.setAvgPaceSecondsPerKm(0);
        }

        workoutRepository.save(workout);

        // Clima baseado no primeiro ponto disponível
        ClimaDTO clima = climaSalvo(workout);
        if (clima == null && workout.getStartLat() != null && workout.getStartLng() != null) {
            clima = buscarClima(workout.getStartLat(), workout.getStartLng());
            salvarClima(workout, clima);
            workoutRepository.save(workout);
        } else if (clima == null && !pontos.isEmpty()) {
            clima = buscarClima(pontos.get(0).getLat(), pontos.get(0).getLng());
            salvarClima(workout, clima);
            workoutRepository.save(workout);
        }

        return montarResposta(workout, segmentos, clima);
    }

    public WorkoutRespostaDTO registrarDescricao(Long workoutId, String descricao) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout não encontrado"));

        workout.setDescricao(descricao);
        workout.setRegistered(true);
        workoutRepository.save(workout);

        List<WorkoutSegment> segmentos = workoutSegmentRepository
                .findByWorkoutIdOrderBySegmentIndexAsc(workoutId);

        return montarResposta(workout, segmentos, null);
    }

    public List<WorkoutRespostaDTO> listarPorUsuario(Long usuarioId) {
        List<Workout> workouts = workoutRepository.findByUsuarioIdOrderByStartedAtDesc(usuarioId);
        List<WorkoutRespostaDTO> resultado = new ArrayList<>();

        for (Workout workout : workouts) {
            List<WorkoutSegment> segmentos = workoutSegmentRepository
                    .findByWorkoutIdOrderBySegmentIndexAsc(workout.getId());
            resultado.add(montarResposta(workout, segmentos, null));
        }

        return resultado;
    }

    public List<PontoGpsDTO> listarPontos(Long workoutId) {
        List<WorkoutPoint> pontos = workoutPointRepository.findByWorkoutIdOrderBySeqAsc(workoutId);
        List<PontoGpsDTO> resultado = new ArrayList<>();

        for (WorkoutPoint ponto : pontos) {
            PontoGpsDTO dto = new PontoGpsDTO();
            dto.setLat(ponto.getLat());
            dto.setLng(ponto.getLng());
            dto.setAltitudeM(ponto.getAltitudeM());
            dto.setRegistradoEm(ponto.getRecordedAt());
            resultado.add(dto);
        }

        return resultado;
    }

    private List<WorkoutSegment> calcularSegmentos(Workout workout, List<WorkoutPoint> pontos) {
        List<WorkoutSegment> segmentos = new ArrayList<>();
        int intervalo = workout.getSegmentIntervalMeters();
        int segIndex = 0;
        double distanciaAcumulada = 0;
        double ganhoElevacao = 0;
        double perdaElevacao = 0;
        int indiceInicio = 0;

        for (int i = 1; i < pontos.size(); i++) {
            WorkoutPoint anterior = pontos.get(i - 1);
            WorkoutPoint atual = pontos.get(i);

            double distancia = calcularDistanciaHaversine(
                    anterior.getLat(), anterior.getLng(),
                    atual.getLat(), atual.getLng());

            distanciaAcumulada += distancia;

            if (anterior.getAltitudeM() != null && atual.getAltitudeM() != null) {
                double diff = atual.getAltitudeM() - anterior.getAltitudeM();
                if (diff > 0)
                    ganhoElevacao += diff;
                else
                    perdaElevacao += Math.abs(diff);
            }

            if (distanciaAcumulada >= intervalo || i == pontos.size() - 1) {
                WorkoutPoint pontoInicio = pontos.get(indiceInicio);
                WorkoutPoint pontoFim = pontos.get(i);

                long duracaoSegundos = java.time.Duration.between(
                        pontoInicio.getRecordedAt(), pontoFim.getRecordedAt()).getSeconds();

                int pace = duracaoSegundos > 0 && distanciaAcumulada > 0
                        ? (int) ((duracaoSegundos * 1000) / distanciaAcumulada)
                        : 0;

                WorkoutSegment segmento = new WorkoutSegment();
                segmento.setWorkout(workout);
                segmento.setSegmentIndex(segIndex++);
                segmento.setDistanceMeters((int) distanciaAcumulada);
                segmento.setDurationSeconds((int) duracaoSegundos);
                segmento.setPaceSecondsPerKm(pace);
                segmento.setElevationGainM(ganhoElevacao);
                segmento.setElevationLossM(perdaElevacao);
                segmento.setStartedAt(pontoInicio.getRecordedAt());
                segmento.setEndedAt(pontoFim.getRecordedAt());

                segmentos.add(segmento);

                distanciaAcumulada = 0;
                ganhoElevacao = 0;
                perdaElevacao = 0;
                indiceInicio = i;
            }
        }

        return segmentos;
    }

    private double calcularDistanciaHaversine(double lat1, double lng1, double lat2, double lng2) {
        final int RAIO_TERRA = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return RAIO_TERRA * c;
    }

    private ClimaDTO buscarClima(Double lat, Double lng) {
        try {
            OpenMeteoResposta resposta = openMeteoService.buscarClima(lat, lng);
            if (resposta == null || resposta.getAtual() == null)
                return null;

            ClimaDTO clima = new ClimaDTO();
            clima.setTemperatura(resposta.getAtual().getTemperatura());
            clima.setUmidade(resposta.getAtual().getUmidade());
            clima.setVelocidadeVento(resposta.getAtual().getVelocidadeVento());
            clima.setCodigoClima(resposta.getAtual().getCodigoClima());
            clima.setDescricaoClima(interpretarCodigoClima(resposta.getAtual().getCodigoClima()));
            return clima;
        } catch (Exception e) {
            return null;
        }
    }

    private void salvarClima(Workout workout, ClimaDTO clima) {
        if (clima == null)
            return;
        workout.setWeatherTemperature(clima.getTemperatura());
        workout.setWeatherHumidity(clima.getUmidade());
        workout.setWeatherWindSpeed(clima.getVelocidadeVento());
        workout.setWeatherCode(clima.getCodigoClima());
        workout.setWeatherDescription(clima.getDescricaoClima());
    }

    private ClimaDTO climaSalvo(Workout workout) {
        if (workout.getWeatherTemperature() == null
                && workout.getWeatherHumidity() == null
                && workout.getWeatherWindSpeed() == null
                && workout.getWeatherCode() == null
                && workout.getWeatherDescription() == null) {
            return null;
        }

        ClimaDTO clima = new ClimaDTO();
        clima.setTemperatura(workout.getWeatherTemperature());
        clima.setUmidade(workout.getWeatherHumidity());
        clima.setVelocidadeVento(workout.getWeatherWindSpeed());
        clima.setCodigoClima(workout.getWeatherCode());
        clima.setDescricaoClima(workout.getWeatherDescription());
        return clima;
    }

    private String interpretarCodigoClima(Integer codigo) {
        if (codigo == null)
            return "Desconhecido";
        if (codigo == 0)
            return "Céu limpo";
        if (codigo <= 3)
            return "Parcialmente nublado";
        if (codigo <= 48)
            return "Nublado ou névoa";
        if (codigo <= 67)
            return "Chuva";
        if (codigo <= 77)
            return "Neve";
        if (codigo <= 82)
            return "Aguaceiro";
        if (codigo <= 99)
            return "Tempestade";
        return "Desconhecido";
    }

    private WorkoutRespostaDTO montarResposta(Workout workout, List<WorkoutSegment> segmentos, ClimaDTO clima) {
        WorkoutRespostaDTO resposta = new WorkoutRespostaDTO();
        resposta.setId(workout.getId());
        resposta.setIniciadoEm(workout.getStartedAt());
        resposta.setFinalizadoEm(workout.getEndedAt());
        resposta.setDistanciaTotalMetros(workout.getTotalDistanceMeters());
        resposta.setDuracaoTotalSegundos(workout.getTotalDurationSeconds());
        resposta.setPaceMediaSegundosPorKm(workout.getAvgPaceSecondsPerKm());
        resposta.setPaceMediaFormatado(formatarPace(workout.getAvgPaceSecondsPerKm()));
        resposta.setDescricao(workout.getDescricao());
        resposta.setRegistered(Boolean.TRUE.equals(workout.getRegistered()) || workout.getDescricao() != null);
        resposta.setSessaoTreinoId(workout.getSessaoTreinoId());
        resposta.setDistanciaMetaKm(workout.getTargetDistanceKm());
        resposta.setRitmoAlvo(workout.getTargetPace());
        resposta.setTipoTreino(workout.getWorkoutType());
        resposta.setClima(clima != null ? clima : climaSalvo(workout));

        double ganhoElevacao = 0;
        double perdaElevacao = 0;

        List<SegmentoRespostaDTO> segmentosDTO = new ArrayList<>();
        for (WorkoutSegment seg : segmentos) {
            ganhoElevacao += seg.getElevationGainM() != null ? seg.getElevationGainM() : 0;
            perdaElevacao += seg.getElevationLossM() != null ? seg.getElevationLossM() : 0;

            SegmentoRespostaDTO s = new SegmentoRespostaDTO();
            s.setIndice(seg.getSegmentIndex());
            s.setDistanciaMetros(seg.getDistanceMeters());
            s.setDuracaoSegundos(seg.getDurationSeconds());
            s.setPaceFormatado(formatarPace(seg.getPaceSecondsPerKm()));
            s.setGanhoElevacaoM(seg.getElevationGainM());
            s.setPerdaElevacaoM(seg.getElevationLossM());
            segmentosDTO.add(s);
        }

        resposta.setGanhoElevacaoM(ganhoElevacao);
        resposta.setPerdaElevacaoM(perdaElevacao);
        resposta.setSegmentos(segmentosDTO);
        return resposta;
    }

    private String formatarPace(Integer segundosPorKm) {
        if (segundosPorKm == null || segundosPorKm == 0)
            return "--:--";
        int minutos = segundosPorKm / 60;
        int segundos = segundosPorKm % 60;
        return String.format("%d:%02d /km", minutos, segundos);
    }
}
