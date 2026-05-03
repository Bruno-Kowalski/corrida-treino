package com.corridaapp.corridatreino.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_segments")
public class WorkoutSegment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @Column(name = "segment_index", nullable = false)
    private Integer segmentIndex;

    @Column(name = "distance_meters", nullable = false)
    private Integer distanceMeters;

    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds;

    @Column(name = "pace_seconds_per_km", nullable = false)
    private Integer paceSecondsPerKm;

    @Column(name = "elevation_gain_m")
    private Double elevationGainM;

    @Column(name = "elevation_loss_m")
    private Double elevationLossM;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at", nullable = false)
    private LocalDateTime endedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Workout getWorkout() {
        return workout;
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
    }

    public Integer getSegmentIndex() {
        return segmentIndex;
    }

    public void setSegmentIndex(Integer segmentIndex) {
        this.segmentIndex = segmentIndex;
    }

    public Integer getDistanceMeters() {
        return distanceMeters;
    }

    public void setDistanceMeters(Integer distanceMeters) {
        this.distanceMeters = distanceMeters;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public Integer getPaceSecondsPerKm() {
        return paceSecondsPerKm;
    }

    public void setPaceSecondsPerKm(Integer paceSecondsPerKm) {
        this.paceSecondsPerKm = paceSecondsPerKm;
    }

    public Double getElevationGainM() {
        return elevationGainM;
    }

    public void setElevationGainM(Double elevationGainM) {
        this.elevationGainM = elevationGainM;
    }

    public Double getElevationLossM() {
        return elevationLossM;
    }

    public void setElevationLossM(Double elevationLossM) {
        this.elevationLossM = elevationLossM;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
    }
}