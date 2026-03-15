package com.corridaapp.corridatreino.repository;

import com.corridaapp.corridatreino.entity.RegistroTreino;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RegistroTreinoRepository extends JpaRepository<RegistroTreino, Long> {
    List<RegistroTreino> findByUsuarioId(Long usuarioId);
    Optional<RegistroTreino> findBySessaoIdAndUsuarioId(Long sessaoId, Long usuarioId);
}