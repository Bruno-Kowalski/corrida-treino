package com.corridaapp.corridatreino.entity;

import com.corridaapp.corridatreino.enums.DiaSemana;
import com.corridaapp.corridatreino.enums.NivelExperiencia;
import com.corridaapp.corridatreino.enums.ObjetivoCorrida;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "perfis_corredor")
public class PerfilCorredor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_experiencia", nullable = false)
    private NivelExperiencia nivelExperiencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ObjetivoCorrida objetivo;

    @Column(name = "pace_medio_segundos")
    private Integer paceMedioSegundos;

    @Column(name = "data_prova")
    private LocalDate dataProva;

    @ElementCollection(targetClass = DiaSemana.class)
    @CollectionTable(name = "perfil_dias_disponiveis", joinColumns = @JoinColumn(name = "perfil_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "dia")
    private List<DiaSemana> diasDisponiveis;

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

    public NivelExperiencia getNivelExperiencia() {
        return nivelExperiencia;
    }

    public void setNivelExperiencia(NivelExperiencia nivelExperiencia) {
        this.nivelExperiencia = nivelExperiencia;
    }

    public ObjetivoCorrida getObjetivo() {
        return objetivo;
    }

    public void setObjetivo(ObjetivoCorrida objetivo) {
        this.objetivo = objetivo;
    }

    public Integer getPaceMedioSegundos() {
        return paceMedioSegundos;
    }

    public void setPaceMedioSegundos(Integer paceMedioSegundos) {
        this.paceMedioSegundos = paceMedioSegundos;
    }

    public LocalDate getDataProva() {
        return dataProva;
    }

    public void setDataProva(LocalDate dataProva) {
        this.dataProva = dataProva;
    }

    public List<DiaSemana> getDiasDisponiveis() {
        return diasDisponiveis;
    }

    public void setDiasDisponiveis(List<DiaSemana> diasDisponiveis) {
        this.diasDisponiveis = diasDisponiveis;
    }
}