package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.entity.PerfilCorredor;
import com.corridaapp.corridatreino.entity.PlanoTreino;
import com.corridaapp.corridatreino.entity.Usuario;
import com.corridaapp.corridatreino.repository.PerfilCorredorRepository;
import com.corridaapp.corridatreino.repository.PlanoTreinoRepository;
import com.corridaapp.corridatreino.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlanoTreinoService {

    private final PlanoTreinoRepository planoTreinoRepository;
    private final PerfilCorredorRepository perfilCorredorRepository;
    private final UsuarioRepository usuarioRepository;
    private final PeriodizacaoService periodizacaoService;

    public PlanoTreinoService(PlanoTreinoRepository planoTreinoRepository, PerfilCorredorRepository perfilCorredorRepository, UsuarioRepository usuarioRepository, PeriodizacaoService periodizacaoService) {
        this.planoTreinoRepository = planoTreinoRepository;
        this.perfilCorredorRepository = perfilCorredorRepository;
        this.usuarioRepository = usuarioRepository;
        this.periodizacaoService = periodizacaoService;
    }

    @Transactional
    public PlanoTreino gerarPlano(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PerfilCorredor perfil = perfilCorredorRepository.findByUsuarioId(usuario.getId()).orElseThrow(() -> new RuntimeException("Perfil não encontrado. Cadastre seu perfil antes de gerar um plano."));

        PlanoTreino plano = periodizacaoService.gerarPlano(
                perfil.getObjetivo(),
                perfil.getNivelExperiencia(),
                perfil.getDataProva(),
                perfil.getPaceMedioSegundos(),
                perfil.getDiasDisponiveis()
        );

        plano.setUsuario(usuario);
        return planoTreinoRepository.save(plano);
    }

    public List<PlanoTreino> listarPlanos(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return planoTreinoRepository.findByUsuarioId(usuario.getId());
    }

    public PlanoTreino buscarPlano(Long id, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PlanoTreino plano = planoTreinoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));

        if (!plano.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Acesso negado");
        }

        return plano;
    }

    @Transactional
    public void deletarPlano(Long id, String email) {
        PlanoTreino plano = buscarPlano(id, email);
        planoTreinoRepository.delete(plano);
    }
}