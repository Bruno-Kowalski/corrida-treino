package com.corridaapp.corridatreino.service;

import com.corridaapp.corridatreino.config.JwtUtil;
import com.corridaapp.corridatreino.dto.AuthResponse;
import com.corridaapp.corridatreino.dto.LoginRequest;
import com.corridaapp.corridatreino.dto.RegisterRequest;
import com.corridaapp.corridatreino.entity.Usuario;
import com.corridaapp.corridatreino.repository.UsuarioRepository;

import org.apache.commons.validator.routines.EmailValidator;

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

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {

        // 🔒 evitar NullPointerException (causa do "erro interno")
        String email = request.getEmail();
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        email = email.trim().toLowerCase();

        // ✅ valida formato
        if (!EmailValidator.getInstance().isValid(email)) {
            throw new IllegalArgumentException("E-mail inválido. Digite um e-mail válido.");
        }

        // ✅ duplicidade
        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Este e-mail já está cadastrado. Tente fazer login.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));

        usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(usuario.getEmail());

        return new AuthResponse(token, usuario.getNome(), usuario.getEmail());
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()));

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        String token = jwtUtil.generateToken(usuario.getEmail());

        return new AuthResponse(
                token,
                usuario.getNome(),
                usuario.getEmail());
    }
}