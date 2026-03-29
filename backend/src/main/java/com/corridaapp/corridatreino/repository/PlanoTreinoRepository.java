package com.corridaapp.corridatreino.repository;

import com.corridaapp.corridatreino.entity.PlanoTreino;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlanoTreinoRepository extends JpaRepository<PlanoTreino, Long> {
    List<PlanoTreino> findByUsuarioId(Long usuarioId);
}