package com.corridaapp.corridatreino.controller;

import com.corridaapp.corridatreino.dto.RegistroTreinoRequest;
import com.corridaapp.corridatreino.entity.RegistroTreino;
import com.corridaapp.corridatreino.service.RegistroTreinoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registros")
public class RegistroTreinoController {

    private final RegistroTreinoService registroTreinoService;

    public RegistroTreinoController(RegistroTreinoService registroTreinoService) {
        this.registroTreinoService = registroTreinoService;
    }

    @PostMapping("/sessao/{sessaoId}")
    public ResponseEntity<RegistroTreino> registrarTreino(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long sessaoId, @Valid @RequestBody RegistroTreinoRequest request) {
        RegistroTreino registro = registroTreinoService.registrarTreino(userDetails.getUsername(), sessaoId, request);
        return ResponseEntity.ok(registro);
    }

    @GetMapping
    public ResponseEntity<List<RegistroTreino>> listarRegistros(@AuthenticationPrincipal UserDetails userDetails) {
        List<RegistroTreino> registros = registroTreinoService.listarRegistros(userDetails.getUsername());
        return ResponseEntity.ok(registros);
    }
}