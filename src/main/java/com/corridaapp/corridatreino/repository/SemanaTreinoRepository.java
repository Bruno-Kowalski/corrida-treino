package com.corridaapp.corridatreino.repository;

import com.corridaapp.corridatreino.entity.SemanaTreino;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SemanaTreinoRepository extends JpaRepository<SemanaTreino, Long> {
    List<SemanaTreino> findByPlanoIdOrderByNumeroSemanaAsc(Long planoId);
}
