package com.corridaapp.corridatreino.controller;

import com.corridaapp.corridatreino.dto.PerfilCorredorRequest;
import com.corridaapp.corridatreino.entity.PerfilCorredor;
import com.corridaapp.corridatreino.service.PerfilCorredorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/perfil")
public class PerfilCorredorController {

    private final PerfilCorredorService perfilCorredorService;

    public PerfilCorredorController(PerfilCorredorService perfilCorredorService) {
        this.perfilCorredorService = perfilCorredorService;
    }

    @PostMapping
    public ResponseEntity<PerfilCorredor> salvarPerfil(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody PerfilCorredorRequest request) {
        PerfilCorredor perfil = perfilCorredorService.salvarPerfil(userDetails.getUsername(), request);
        return ResponseEntity.ok(perfil);
    }

    @GetMapping
    public ResponseEntity<PerfilCorredor> buscarPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        PerfilCorredor perfil = perfilCorredorService.buscarPerfil(userDetails.getUsername());
        return ResponseEntity.ok(perfil);
    }
}