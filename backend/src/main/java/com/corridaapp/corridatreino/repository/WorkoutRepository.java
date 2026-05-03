package com.corridaapp.corridatreino.repository;

import com.corridaapp.corridatreino.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUsuarioIdOrderByStartedAtDesc(Long usuarioId);

    boolean existsByUsuarioIdAndSessaoTreinoIdAndRegisteredTrue(Long usuarioId, Long sessaoTreinoId);

    boolean existsByUsuarioIdAndSessaoTreinoIdAndDescricaoIsNotNull(Long usuarioId, Long sessaoTreinoId);
}
