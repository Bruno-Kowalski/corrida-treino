package com.corridaapp.corridatreino.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(nullable = false)
    private String source; // mobile, gpx, fit

    @Column(name = "segment_interval_meters", nullable = false)
    private Integer segmentIntervalMeters = 1000;

    @Column(name = "total_distance_meters")
    private Integer totalDistanceMeters;

    @Column(name = "total_duration_seconds")
    private Integer totalDurationSeconds;

    @Column(name = "avg_pace_seconds_per_km")
    private Integer avgPaceSecondsPerKm;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column
    private Boolean registered = false;

    @Column(name = "sessao_treino_id")
    private Long sessaoTreinoId;

    @Column(name = "target_distance_km")
    private Double targetDistanceKm;

    @Column(name = "target_pace")
    private String targetPace;

    @Column(name = "workout_type")
    private String workoutType;

    @Column(name = "start_lat")
    private Double startLat;

    @Column(name = "start_lng")
    private Double startLng;

    @Column(name = "weather_temperature")
    private Double weatherTemperature;

    @Column(name = "weather_humidity")
    private Integer weatherHumidity;

    @Column(name = "weather_wind_speed")
    private Double weatherWindSpeed;

    @Column(name = "weather_code")
    private Integer weatherCode;

    @Column(name = "weather_description")
    private String weatherDescription;

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Boolean getRegistered() {
        return registered;
    }

    public void setRegistered(Boolean registered) {
        this.registered = registered;
    }

    public Long getSessaoTreinoId() {
        return sessaoTreinoId;
    }

    public void setSessaoTreinoId(Long sessaoTreinoId) {
        this.sessaoTreinoId = sessaoTreinoId;
    }

    public Double getTargetDistanceKm() {
        return targetDistanceKm;
    }

    public void setTargetDistanceKm(Double targetDistanceKm) {
        this.targetDistanceKm = targetDistanceKm;
    }

    public String getTargetPace() {
        return targetPace;
    }

    public void setTargetPace(String targetPace) {
        this.targetPace = targetPace;
    }

    public String getWorkoutType() {
        return workoutType;
    }

    public void setWorkoutType(String workoutType) {
        this.workoutType = workoutType;
    }

    public Double getStartLat() {
        return startLat;
    }

    public void setStartLat(Double startLat) {
        this.startLat = startLat;
    }

    public Double getStartLng() {
        return startLng;
    }

    public void setStartLng(Double startLng) {
        this.startLng = startLng;
    }

    public Double getWeatherTemperature() {
        return weatherTemperature;
    }

    public void setWeatherTemperature(Double weatherTemperature) {
        this.weatherTemperature = weatherTemperature;
    }

    public Integer getWeatherHumidity() {
        return weatherHumidity;
    }

    public void setWeatherHumidity(Integer weatherHumidity) {
        this.weatherHumidity = weatherHumidity;
    }

    public Double getWeatherWindSpeed() {
        return weatherWindSpeed;
    }

    public void setWeatherWindSpeed(Double weatherWindSpeed) {
        this.weatherWindSpeed = weatherWindSpeed;
    }

    public Integer getWeatherCode() {
        return weatherCode;
    }

    public void setWeatherCode(Integer weatherCode) {
        this.weatherCode = weatherCode;
    }

    public String getWeatherDescription() {
        return weatherDescription;
    }

    public void setWeatherDescription(String weatherDescription) {
        this.weatherDescription = weatherDescription;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Integer getSegmentIntervalMeters() {
        return segmentIntervalMeters;
    }

    public void setSegmentIntervalMeters(Integer segmentIntervalMeters) {
        this.segmentIntervalMeters = segmentIntervalMeters;
    }

    public Integer getTotalDistanceMeters() {
        return totalDistanceMeters;
    }

    public void setTotalDistanceMeters(Integer totalDistanceMeters) {
        this.totalDistanceMeters = totalDistanceMeters;
    }

    public Integer getTotalDurationSeconds() {
        return totalDurationSeconds;
    }

    public void setTotalDurationSeconds(Integer totalDurationSeconds) {
        this.totalDurationSeconds = totalDurationSeconds;
    }

    public Integer getAvgPaceSecondsPerKm() {
        return avgPaceSecondsPerKm;
    }

    public void setAvgPaceSecondsPerKm(Integer avgPaceSecondsPerKm) {
        this.avgPaceSecondsPerKm = avgPaceSecondsPerKm;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
