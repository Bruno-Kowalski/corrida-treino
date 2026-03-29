package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.config.JwtUtil;
import com.corridaapp.corridatreino.dto.AuthResponse;
import com.corridaapp.corridatreino.dto.LoginRequest;
import com.corridaapp.corridatreino.dto.RegisterRequest;
import com.corridaapp.corridatreino.entity.Usuario;
import com.corridaapp.corridatreino.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));

        usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(usuario.getEmail());
        return new AuthResponse(token, usuario.getNome(), usuario.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha()));

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow(()-> new RuntimeException("Usuário não Encontrado"));

        String token = jwtUtil.generateToken((usuario.getEmail()));
        return new AuthResponse(token, usuario.getNome(), usuario.getEmail());

    }

}
