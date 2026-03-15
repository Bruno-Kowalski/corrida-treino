package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.entity.SessaoTreino;
import com.corridaapp.corridatreino.repository.SemanaTreinoRepository;
import org.springframework.stereotype.Service;

@Service
public class SessaoTreinoService {

    private final SemanaTreinoRepository semanaTreinoRepository;

    public SessaoTreinoService(SemanaTreinoRepository semanaTreinoRepository) {
        this.semanaTreinoRepository = semanaTreinoRepository;
    }

    public SessaoTreino buscarSessao(Long sessaoId) {
        return semanaTreinoRepository.findAll().stream()
                .flatMap(semana -> semana.getSessoes().stream())
                .filter(sessao -> sessao.getId().equals(sessaoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));
    }
}