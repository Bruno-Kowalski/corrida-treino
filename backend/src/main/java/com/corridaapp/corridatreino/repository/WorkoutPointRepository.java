package com.corridaapp.corridatreino.repository;

import com.corridaapp.corridatreino.entity.WorkoutPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutPointRepository extends JpaRepository<WorkoutPoint, Long> {
    List<WorkoutPoint> findByWorkoutIdOrderBySeqAsc(Long workoutId);
}

