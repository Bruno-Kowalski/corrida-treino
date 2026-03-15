package com.corridaapp.corridatreino.entity;

import com.corridaapp.corridatreino.enums.ObjetivoCorrida;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "planos_treino")
public class PlanoTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ObjetivoCorrida objetivo;

    @Column(name = "total_semanas", nullable = false)
    private Integer totalSemanas;

    @Column(name = "gerado_em")
    private LocalDateTime geradoEm;

    @OneToMany(mappedBy = "plano", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SemanaTreino> semanas;

    @PrePersist
    public void prePersist() {
        this.geradoEm = LocalDateTime.now();
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

    public ObjetivoCorrida getObjetivo() {
        return objetivo;
    }

    public void setObjetivo(ObjetivoCorrida objetivo) {
        this.objetivo = objetivo;
    }

    public Integer getTotalSemanas() {
        return totalSemanas;
    }

    public void setTotalSemanas(Integer totalSemanas) {
        this.totalSemanas = totalSemanas;
    }

    public LocalDateTime getGeradoEm() {
        return geradoEm;
    }

    public void setGeradoEm(LocalDateTime geradoEm) {
        this.geradoEm = geradoEm;
    }

    public List<SemanaTreino> getSemanas() {
        return semanas;
    }

    public void setSemanas(List<SemanaTreino> semanas) {
        this.semanas = semanas;
    }
}