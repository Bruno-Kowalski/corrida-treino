package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.dto.RegistroTreinoRequest;
import com.corridaapp.corridatreino.entity.RegistroTreino;
import com.corridaapp.corridatreino.entity.SessaoTreino;
import com.corridaapp.corridatreino.entity.Usuario;
import com.corridaapp.corridatreino.repository.RegistroTreinoRepository;
import com.corridaapp.corridatreino.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RegistroTreinoService {

    private final RegistroTreinoRepository registroTreinoRepository;
    private final UsuarioRepository usuarioRepository;
    private final SessaoTreinoService sessaoTreinoService;

    public RegistroTreinoService(RegistroTreinoRepository registroTreinoRepository, UsuarioRepository usuarioRepository, SessaoTreinoService sessaoTreinoService) {
        this.registroTreinoRepository = registroTreinoRepository;
        this.usuarioRepository = usuarioRepository;
        this.sessaoTreinoService = sessaoTreinoService;
    }

    @Transactional
    public RegistroTreino registrarTreino(String email, Long sessaoId, RegistroTreinoRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        SessaoTreino sessao = sessaoTreinoService.buscarSessao(sessaoId);

        RegistroTreino registro = registroTreinoRepository.findBySessaoIdAndUsuarioId(sessaoId, usuario.getId()).orElse(new RegistroTreino());

        registro.setSessao(sessao);
        registro.setUsuario(usuario);
        registro.setRealizado(request.getRealizado());
        registro.setDistanciaRealKm(request.getDistanciaRealKm());
        registro.setObservacao(request.getObservacao());

        return registroTreinoRepository.save(registro);
    }

    public List<RegistroTreino> listarRegistros(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return registroTreinoRepository.findByUsuarioId(usuario.getId());
    }
}