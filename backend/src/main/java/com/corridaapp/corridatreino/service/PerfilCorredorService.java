package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.dto.PerfilCorredorRequest;
import com.corridaapp.corridatreino.entity.PerfilCorredor;
import com.corridaapp.corridatreino.entity.Usuario;
import com.corridaapp.corridatreino.repository.PerfilCorredorRepository;
import com.corridaapp.corridatreino.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PerfilCorredorService {

    private final PerfilCorredorRepository perfilCorredorRepository;
    private final UsuarioRepository usuarioRepository;

    public PerfilCorredorService(PerfilCorredorRepository perfilCorredorRepository, UsuarioRepository usuarioRepository) {
        this.perfilCorredorRepository = perfilCorredorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PerfilCorredor salvarPerfil(String email, PerfilCorredorRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PerfilCorredor perfil = perfilCorredorRepository.findByUsuarioId(usuario.getId()).orElse(new PerfilCorredor());

        perfil.setUsuario(usuario);
        perfil.setNivelExperiencia(request.getNivelExperiencia());
        perfil.setObjetivo(request.getObjetivo());
        perfil.setPaceMedioSegundos(request.getPaceMedioSegundos());
        perfil.setDataProva(request.getDataProva());
        perfil.setDiasDisponiveis(request.getDiasDisponiveis());

        return perfilCorredorRepository.save(perfil);
    }

    public PerfilCorredor buscarPerfil(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return perfilCorredorRepository.findByUsuarioId(usuario.getId()).orElseThrow(() -> new RuntimeException("Perfil não encontrado"));
    }
}