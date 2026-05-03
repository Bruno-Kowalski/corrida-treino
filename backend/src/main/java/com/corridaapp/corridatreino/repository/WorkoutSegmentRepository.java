package com.corridaapp.corridatreino.repository;

import com.corridaapp.corridatreino.entity.WorkoutSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutSegmentRepository extends JpaRepository<WorkoutSegment, Long> {
    List<WorkoutSegment> findByWorkoutIdOrderBySegmentIndexAsc(Long workoutId);
}