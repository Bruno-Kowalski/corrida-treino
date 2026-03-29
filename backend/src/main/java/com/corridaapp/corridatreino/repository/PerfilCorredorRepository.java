package com.corridaapp.corridatreino.repository;

import com.corridaapp.corridatreino.entity.PerfilCorredor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PerfilCorredorRepository extends JpaRepository<PerfilCorredor, Long> {
    Optional<PerfilCorredor> findByUsuarioId(Long usuarioId);
}