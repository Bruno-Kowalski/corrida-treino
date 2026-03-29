package com.corridaapp.corridatreino.controller;

import com.corridaapp.corridatreino.entity.PlanoTreino;
import com.corridaapp.corridatreino.service.PlanoTreinoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/planos")
public class PlanoTreinoController {

    private final PlanoTreinoService planoTreinoService;

    public PlanoTreinoController(PlanoTreinoService planoTreinoService) {
        this.planoTreinoService = planoTreinoService;
    }

    @PostMapping("/gerar")
    public ResponseEntity<PlanoTreino> gerarPlano(@AuthenticationPrincipal UserDetails userDetails) {
        PlanoTreino plano = planoTreinoService.gerarPlano(userDetails.getUsername());
        return ResponseEntity.ok(plano);
    }

    @GetMapping
    public ResponseEntity<List<PlanoTreino>> listarPlanos(@AuthenticationPrincipal UserDetails userDetails) {
        List<PlanoTreino> planos = planoTreinoService.listarPlanos(userDetails.getUsername());
        return ResponseEntity.ok(planos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanoTreino> buscarPlano(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        PlanoTreino plano = planoTreinoService.buscarPlano(id, userDetails.getUsername());
        return ResponseEntity.ok(plano);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPlano(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        planoTreinoService.deletarPlano(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}