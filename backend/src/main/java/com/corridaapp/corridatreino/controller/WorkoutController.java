package com.corridaapp.corridatreino.controller;

import com.corridaapp.corridatreino.dto.IniciarWorkoutDTO;
import com.corridaapp.corridatreino.dto.PontoGpsDTO;
import com.corridaapp.corridatreino.dto.WorkoutRespostaDTO;
import com.corridaapp.corridatreino.service.WorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final com.corridaapp.corridatreino.repository.UsuarioRepository usuarioRepository;

    public WorkoutController(WorkoutService workoutService,
            com.corridaapp.corridatreino.repository.UsuarioRepository usuarioRepository) {
        this.workoutService = workoutService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/iniciar")
    public ResponseEntity<Map<String, Long>> iniciar(@RequestBody IniciarWorkoutDTO dto,
            Authentication auth) {
        Long usuarioId = buscarUsuarioId(auth);
        Long workoutId = workoutService.iniciarWorkout(usuarioId, dto);
        return ResponseEntity.ok(Map.of("workoutId", workoutId));
    }

    @PostMapping("/{workoutId}/pontos")
    public ResponseEntity<Void> adicionarPontos(@PathVariable Long workoutId,
            @RequestBody List<PontoGpsDTO> pontos) {
        workoutService.adicionarPontos(workoutId, pontos);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{workoutId}/finalizar")
    public ResponseEntity<WorkoutRespostaDTO> finalizar(@PathVariable Long workoutId) {
        WorkoutRespostaDTO resposta = workoutService.finalizarWorkout(workoutId);
        return ResponseEntity.ok(resposta);
    }

    @GetMapping
    public ResponseEntity<List<WorkoutRespostaDTO>> listar(Authentication auth) {
        Long usuarioId = buscarUsuarioId(auth);
        return ResponseEntity.ok(workoutService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/{workoutId}/pontos")
    public ResponseEntity<List<PontoGpsDTO>> listarPontos(@PathVariable Long workoutId) {
        return ResponseEntity.ok(workoutService.listarPontos(workoutId));
    }

    private Long buscarUsuarioId(Authentication auth) {
        return usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }

    @PatchMapping("/{workoutId}/registrar")
    public ResponseEntity<WorkoutRespostaDTO> registrar(
            @PathVariable Long workoutId,
            @RequestBody Map<String, String> body) {
        String descricao = body.getOrDefault("descricao", "");
        WorkoutRespostaDTO resposta = workoutService.registrarDescricao(workoutId, descricao);
        return ResponseEntity.ok(resposta);
    }
}
