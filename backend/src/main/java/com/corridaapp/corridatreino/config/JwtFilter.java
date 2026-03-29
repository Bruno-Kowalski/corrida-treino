package com.corridaapp.corridatreino.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtFilter.class);

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        log.info("Authorization header: {}", authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Header ausente ou sem Bearer");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        log.info("Token extraido: {}", token);

        boolean valid = jwtUtil.isTokenValid(token);
        log.info("Token valido: {}", valid);

        if (!valid) {
            log.warn("Token invalido ou expirado");
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtUtil.extractEmail(token);
        log.info("Email extraido: {}", email);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("Autenticacao definida para: {}", email);
        }

        filterChain.doFilter(request, response);
    }
}