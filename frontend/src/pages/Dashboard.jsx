import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';
import api from '../services/Api';
import { listarPontosWorkout } from '../services/workoutService';

const OBJETIVO_LABEL = {
  CINCO_KM: '5 KM',
  DEZ_KM: '10 KM',
  MEIA_MARATONA: 'Meia Maratona',
};

const NIVEL_LABEL = {
  INICIANTE: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
};

const FASE_LABEL = {
  BASE: 'Base',
  DESENVOLVIMENTO: 'Desenvolvimento',
  PICO: 'Pico',
  TAPER: 'Taper',
};

const TIPO_LABEL = {
  LONGO: 'Longo',
  INTERVALADO: 'Intervalado',
  TEMPO: 'Tempo',
  RECUPERACAO: 'Recuperação',
};

const TIPO_COR = {
  LONGO: '#FF4500',
  INTERVALADO: '#FF6B2B',
  TEMPO: '#FFB347',
  RECUPERACAO: '#4CAF50',
};

const DIA_LABEL = {
  SEGUNDA: 'Segunda',
  TERCA: 'Terça',
  QUARTA: 'Quarta',
  QUINTA: 'Quinta',
  SEXTA: 'Sexta',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
};

const DIA_OFFSET = {
  SEGUNDA: 0,
  TERCA: 1,
  QUARTA: 2,
  QUINTA: 3,
  SEXTA: 4,
  SABADO: 5,
  DOMINGO: 6,
};

const paceFormatado = (segundos) => {
  if (!segundos) return '--';
  const min = Math.floor(segundos / 60);
  const sec = segundos % 60;
  return `${min}'${sec.toString().padStart(2, '0')}"`;
};

const formatarDuracao = (segundos = 0) => {
  if (!segundos) return '--';
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}min`;
  if (m > 0) return `${m}min ${s.toString().padStart(2, '0')}s`;
  return `${s}s`;
};

const formatarDataHora = (valor) =>
  valor
    ? new Date(valor).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--';

const formatarKm = (metros = 0) => `${((metros || 0) / 1000).toFixed(2)} km`;

const somarSegmentos = (segmentos = [], campo) =>
  segmentos.reduce((acc, seg) => acc + (Number(seg[campo]) || 0), 0);

function calcularDataSessao(geradoEm, numeroSemana, diaSemana) {
  const inicio = new Date(geradoEm);
  inicio.setHours(0, 0, 0, 0);
  const semanaInicio = new Date(inicio);
  semanaInicio.setDate(inicio.getDate() + (numeroSemana - 1) * 7);
  const jsDay = semanaInicio.getDay();
  const diaInicioMon = jsDay === 0 ? 6 : jsDay - 1;
  let offset = (DIA_OFFSET[diaSemana] ?? 0) - diaInicioMon;
  if (offset < 0) offset += 7;
  const dataSessao = new Date(semanaInicio);
  dataSessao.setDate(semanaInicio.getDate() + offset);
  return dataSessao;
}

function StatCard({ label, value, sub }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: '24px 20px',
        flex: 1,
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: '#7A869A',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 36,
          color: '#F0F4FF',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: '#7A869A', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SessaoCard({ sessao, isPast, dataSessao, concluido, onRealizarTreino }) {
  const [hovered, setHovered] = useState(false);
  const cor = TIPO_COR[sessao.tipo] || '#FF4500';

  const dataFormatada = dataSessao
    ? dataSessao.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    : null;

  const statusBotao = () => {
    if (concluido) {
      return {
        label: 'Treino concluído',
        bg: 'rgba(76,175,80,0.12)',
        border: 'rgba(76,175,80,0.35)',
        cor: '#4CAF50',
        acao: null,
      };
    }

    if (isPast) {
      return {
        label: '⚠ Pendente',
        bg: 'rgba(255,179,71,0.1)',
        border: 'rgba(255,179,71,0.3)',
        cor: '#FFB347',
        acao: null,
      };
    }
    return {
      label: '▶ Realizar Treino',
      bg: 'rgba(255,69,0,0.12)',
      border: 'rgba(255,69,0,0.4)',
      cor: '#FF4500',
      acao: () => onRealizarTreino(sessao),
    };
  };

  const btn = statusBotao();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,69,0,0.06)' : 'rgba(255,255,255,0.02)',
        borderLeft: `4px solid ${cor}`,
        padding: '28px 32px',
        transition: 'all 0.2s',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
          gap: 16,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: cor,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            {DIA_LABEL[sessao.diaSemana]}
            {dataFormatada ? ` ${dataFormatada}` : ''} · {TIPO_LABEL[sessao.tipo]}
          </span>
          <div
            style={{
              fontSize: 15,
              color: '#F0F4FF',
              fontWeight: 500,
              marginTop: 8,
              lineHeight: 1.5,
            }}
          >
            {sessao.descricao}
          </div>
        </div>

        <button
          onClick={btn.acao ?? undefined}
          disabled={!btn.acao}
          style={{
            background: btn.bg,
            border: `1px solid ${btn.border}`,
            borderRadius: 8,
            padding: '8px 20px',
            color: btn.cor,
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            cursor: btn.acao ? 'pointer' : 'default',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            opacity: btn.acao ? 1 : 0.7,
          }}
          onMouseEnter={(e) => {
            if (btn.acao) e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = btn.acao ? '1' : '0.7';
          }}
        >
          {btn.label}
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 28,
          paddingTop: 12,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {sessao.distanciaKm && (
          <div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#7A869A' }}>
              Distância{' '}
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#F0F4FF',
                fontWeight: 700,
              }}
            >
              {sessao.distanciaKm} km
            </span>
          </div>
        )}
        {sessao.paceAlvo && (
          <div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#7A869A' }}>
              Pace alvo{' '}
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#F0F4FF',
                fontWeight: 700,
              }}
            >
              {sessao.paceAlvo}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoricoDetalhes({ workout, onClose }) {
  if (!workout) return null;

  const ganhoElevacao =
    workout.ganhoElevacaoM ?? somarSegmentos(workout.segmentos, 'ganhoElevacaoM');
  const perdaElevacao =
    workout.perdaElevacaoM ?? somarSegmentos(workout.segmentos, 'perdaElevacaoM');
  const distanciaMeta = workout.distanciaMetaKm ? `${workout.distanciaMetaKm} km` : '--';
  const distanciaPercorrida = formatarKm(workout.distanciaTotalMetros);

  const detalheItem = (label, valor) => (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10,
        padding: 14,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: '#7A869A',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ color: '#F0F4FF', fontSize: 15, fontWeight: 600 }}>{valor || '--'}</div>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(720px, 100%)',
          maxHeight: '86vh',
          overflowY: 'auto',
          background: '#0E1425',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          padding: 24,
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#FF5500',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: 6,
              }}
            >
              {workout.tipoTreino || 'Treino GPS'}
            </div>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                color: '#F0F4FF',
                fontSize: 34,
                margin: 0,
              }}
            >
              Detalhes do treino
            </h2>
            <div style={{ color: '#7A869A', fontSize: 13, marginTop: 4 }}>
              {formatarDataHora(workout.iniciadoEm)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: '#A8B3C5',
              cursor: 'pointer',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            x
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          {detalheItem('Percorrido', distanciaPercorrida)}
          {detalheItem('Meta', distanciaMeta)}
          {detalheItem('Ritmo médio', workout.paceMediaFormatado)}
          {detalheItem('Ritmo alvo', workout.ritmoAlvo)}
          {detalheItem('Tempo', formatarDuracao(workout.duracaoTotalSegundos))}
          {detalheItem('Ganho elevação', `${Math.round(ganhoElevacao || 0)} m`)}
          {detalheItem('Perda elevação', `${Math.round(perdaElevacao || 0)} m`)}
        </div>

        {workout.clima && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              background: 'rgba(255,85,0,0.08)',
              border: '1px solid rgba(255,85,0,0.18)',
              color: '#F0F4FF',
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <strong>Clima:</strong> {workout.clima.descricaoClima || '--'} ·{' '}
            {workout.clima.temperatura ?? '--'}°C · Umidade {workout.clima.umidade ?? '--'}% ·
            Vento {workout.clima.velocidadeVento ?? '--'} km/h
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: '#7A869A',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 8,
            }}
          >
            Observações
          </div>
          <div
            style={{
              color: workout.descricao ? '#F0F4FF' : '#7A869A',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              padding: 14,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {workout.descricao || 'Nenhuma observação registrada.'}
          </div>
        </div>

        {workout.segmentos?.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#7A869A',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 8,
              }}
            >
              Segmentos
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {workout.segmentos.map((seg) => (
                <div
                  key={seg.indice}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 90px',
                    gap: 10,
                    color: '#A8B3C5',
                    fontSize: 13,
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.025)',
                  }}
                >
                  <span>Km {(seg.indice ?? 0) + 1}</span>
                  <span>{seg.paceFormatado || '--'}</span>
                  <span>+{Math.round(seg.ganhoElevacaoM || 0)} m</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PercursoModal({ workout, pontos, loading, erro, onClose }) {
  const [mapEl, setMapEl] = useState(null);

  useEffect(() => {
    if (!mapEl || !pontos?.length) return undefined;

    const latLngs = pontos
      .filter((p) => Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng)))
      .map((p) => [Number(p.lat), Number(p.lng)]);

    if (latLngs.length === 0) return undefined;

    const map = L.map(mapEl, {
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    const linha = L.polyline(latLngs, {
      color: '#FF5500',
      weight: 5,
      opacity: 0.95,
    }).addTo(map);

    L.circleMarker(latLngs[0], {
      radius: 7,
      color: '#4CAF50',
      fillColor: '#4CAF50',
      fillOpacity: 1,
      weight: 2,
    }).addTo(map);

    L.circleMarker(latLngs[latLngs.length - 1], {
      radius: 7,
      color: '#FF3366',
      fillColor: '#FF3366',
      fillOpacity: 1,
      weight: 2,
    }).addTo(map);

    map.fitBounds(linha.getBounds(), { padding: [24, 24] });
    setTimeout(() => map.invalidateSize(), 80);

    return () => map.remove();
  }, [mapEl, pontos]);

  if (!workout) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 320,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(860px, 100%)',
          background: '#0E1425',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#FF5500',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: 4,
              }}
            >
              Percurso do treino
            </div>
            <div style={{ color: '#F0F4FF', fontSize: 16, fontWeight: 700 }}>
              {formatarDataHora(workout.iniciadoEm)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: '#A8B3C5',
              cursor: 'pointer',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            x
          </button>
        </div>

        <div style={{ height: 'min(68vh, 560px)', minHeight: 360, position: 'relative' }}>
          {loading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A8B3C5',
                background: '#080C18',
                zIndex: 2,
              }}
            >
              Carregando percurso...
            </div>
          )}
          {(erro || (!loading && pontos?.length === 0)) && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A8B3C5',
                background: '#080C18',
                zIndex: 2,
                textAlign: 'center',
                padding: 24,
              }}
            >
              {erro || 'Nenhum ponto GPS foi salvo para este treino.'}
            </div>
          )}
          <div ref={setMapEl} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [planoAtivo, setPlanoAtivo] = useState(null);
  const [semanaAtiva, setSemanaAtiva] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gerandoPlano, setGerandoPlano] = useState(false);
  const [erro, setErro] = useState(null);
  const [abaSelecionada, setAbaSelecionada] = useState('treinos');
  const [workoutDetalhe, setWorkoutDetalhe] = useState(null);
  const [percurso, setPercurso] = useState(null);
  const [pontosPercurso, setPontosPercurso] = useState([]);
  const [loadingPercurso, setLoadingPercurso] = useState(false);
  const [erroPercurso, setErroPercurso] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    setErro(null);
    try {
      const perfilRes = await api.get('/perfil').catch(() => ({ data: null }));
      const planosRes = await api.get('/planos').catch(() => ({ data: [] }));
      const workoutsRes = await api.get('/api/workouts').catch(() => ({ data: [] }));

      setPerfil(perfilRes.data);
      setPlanos(planosRes.data ?? []);
      setWorkouts(workoutsRes.data ?? []);

      const listaPlanos = planosRes.data ?? [];
      if (listaPlanos.length > 0) {
        const ultimo = listaPlanos[listaPlanos.length - 1];
        setPlanoAtivo(ultimo);
        if (ultimo.semanas?.length > 0) setSemanaAtiva(ultimo.semanas[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGerarPlano = async () => {
    setGerandoPlano(true);
    try {
      const { data } = await api.post('/planos/gerar');
      setPlanos((prev) => [...prev, data]);
      setPlanoAtivo(data);
      if (data.semanas?.length > 0) setSemanaAtiva(data.semanas[0]);
    } catch {
      setErro('Erro ao gerar plano. Verifique se você tem um perfil cadastrado.');
    } finally {
      setGerandoPlano(false);
    }
  };

  const sessaoConcluida = (sessaoId) =>
    workouts.some(
      (w) =>
        w.registered === true && String(w.sessaoTreinoId ?? '') === String(sessaoId ?? '')
    );

  const encontrarSessaoPorId = (sessaoId) => {
    for (const plano of planos) {
      for (const semana of plano.semanas ?? []) {
        const sessao = (semana.sessoes ?? []).find((s) => String(s.id) === String(sessaoId));
        if (sessao) return sessao;
      }
    }
    return null;
  };

  const enriquecerWorkout = (workout) => {
    const sessao = workout?.sessaoTreinoId ? encontrarSessaoPorId(workout.sessaoTreinoId) : null;
    return {
      ...workout,
      distanciaMetaKm: workout?.distanciaMetaKm ?? sessao?.distanciaKm ?? null,
      ritmoAlvo: workout?.ritmoAlvo ?? sessao?.paceAlvo ?? null,
      tipoTreino: workout?.tipoTreino ?? (sessao?.tipo ? TIPO_LABEL[sessao.tipo] : null),
    };
  };

  const handleRealizarTreino = (sessao) => {
    if (sessaoConcluida(sessao.id)) {
      setErro('Este treino já foi concluído e não pode ser realizado novamente.');
      return;
    }

    navigate('/execucao-treino', {
      state: {
        treino: {
          id: sessao.id,
          tipo: TIPO_LABEL[sessao.tipo],
          distanciaKm: sessao.distanciaKm,
          ritmoAlvo: sessao.paceAlvo,
        },
      },
    });
  };

  const handleVerPercurso = async (workout) => {
    const treino = enriquecerWorkout(workout);
    setPercurso(treino);
    setPontosPercurso([]);
    setErroPercurso(null);
    setLoadingPercurso(true);

    try {
      const { data } = await listarPontosWorkout(workout.id);
      setPontosPercurso(data ?? []);
    } catch {
      setErroPercurso('Não foi possível carregar o percurso deste treino.');
    } finally {
      setLoadingPercurso(false);
    }
  };

  const fecharPercurso = () => {
    setPercurso(null);
    setPontosPercurso([]);
    setErroPercurso(null);
    setLoadingPercurso(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const workoutsRegistrados = workouts.filter((w) => w.registered === true);

  const totalKmRegistrado = workoutsRegistrados
    .filter((w) => w.distanciaTotalMetros)
    .reduce((acc, w) => acc + w.distanciaTotalMetros / 1000, 0);

  const treinosRealizados = workoutsRegistrados.length;

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#080C18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 48,
              color: '#FF4500',
              marginBottom: 16,
            }}
          >
            PACEX
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: '#7A869A',
              letterSpacing: '0.2em',
            }}
          >
            CARREGANDO...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080C18', fontFamily: "'DM Sans', sans-serif" }}>
      {/* NAVBAR */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 40px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(8,12,24,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28,
              color: '#F0F4FF',
              letterSpacing: '0.08em',
            }}
          >
            PACE
          </span>
          <img
            src="/logosemnomecopia.png"
            alt="X"
            style={{ height: 28, width: 'auto', marginLeft: -4 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,69,0,0.15)',
              border: '1px solid rgba(255,69,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: '#FF4500',
              fontWeight: 700,
            }}
          >
            {user?.nome?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span style={{ color: '#A8B3C5', fontSize: 14 }}>{user?.nome}</span>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 16,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '7px 16px',
              color: '#7A869A',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,69,0,0.4)';
              e.currentTarget.style.color = '#FF4500';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#7A869A';
            }}
          >
            Sair
          </button>
        </div>
      </nav>

      <div style={{ paddingTop: 64 }}>
        {/* ERRO */}
        {erro && (
          <div
            style={{
              margin: '20px 40px 0',
              background: 'rgba(255,69,0,0.1)',
              border: '1px solid rgba(255,69,0,0.3)',
              borderRadius: 10,
              padding: '12px 16px',
              color: '#FF6B2B',
              fontSize: 13,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            ⚠ {erro}
            <button
              onClick={() => setErro(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF6B2B',
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* HEADER */}
        <div style={{ padding: '40px 40px 0' }}>
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                color: '#FF4500',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: 8,
              }}
            >
              {(() => {
                const h = new Date().getHours();
                return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
              })()}
            </div>
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 48,
                color: '#F0F4FF',
                lineHeight: 1,
              }}
            >
              {user?.nome?.toUpperCase() || 'ATLETA'}
            </h1>
            {perfil && (
              <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                <span
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#FF4500' }}
                >
                  {NIVEL_LABEL[perfil.nivelExperiencia]}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                <span
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#FF4500' }}
                >
                  Objetivo: {OBJETIVO_LABEL[perfil.objetivo]}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                <span
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#FF4500' }}
                >
                  Pace médio: {paceFormatado(perfil.paceMedioSegundos)}/km
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
            <StatCard label="Planos gerados" value={planos.length} />
            <StatCard label="Treinos realizados" value={treinosRealizados} />
            <StatCard label="KM percorridos" value={`${totalKmRegistrado.toFixed(1)} km`} />
            {perfil && (
              <StatCard
                label="Prova alvo"
                value={OBJETIVO_LABEL[perfil.objetivo]}
                sub={
                  perfil.dataProva
                    ? `Data: ${new Date(perfil.dataProva).toLocaleDateString('pt-BR')}`
                    : null
                }
              />
            )}
          </div>

          {/* Abas */}
          <div
            style={{
              display: 'flex',
              gap: 4,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              marginBottom: 0,
            }}
          >
            {[
              ['treinos', 'Plano de Treino'],
              ['historico', 'Histórico'],
              ['perfil', 'Perfil'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setAbaSelecionada(id)}
                style={{
                  padding: '12px 24px',
                  background: 'none',
                  border: 'none',
                  borderBottom:
                    abaSelecionada === id ? '2px solid #FF4500' : '2px solid transparent',
                  color: abaSelecionada === id ? '#F0F4FF' : '#7A869A',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: -1,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ABA: PLANO DE TREINO */}
        {abaSelecionada === 'treinos' && (
          <div>
            {!planoAtivo ? (
              <div style={{ padding: '32px 40px 60px' }}>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    border: '1px dashed rgba(255,255,255,0.1)',
                    borderRadius: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 36,
                      color: '#7A869A',
                      marginBottom: 12,
                    }}
                  >
                    NENHUM PLANO ATIVO
                  </div>
                  <p style={{ color: '#7A869A', fontSize: 14, marginBottom: 24 }}>
                    Gere seu primeiro plano personalizado de treino.
                  </p>
                  <button
                    onClick={handleGerarPlano}
                    disabled={gerandoPlano}
                    style={{
                      padding: '14px 32px',
                      background: '#FF4500',
                      border: 'none',
                      borderRadius: 10,
                      color: '#fff',
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 20,
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 24px rgba(255,69,0,0.4)',
                    }}
                  >
                    {gerandoPlano ? 'Gerando...' : 'Gerar Plano'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    padding: '24px 40px 0',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255,69,0,0.08)',
                      border: '1px solid rgba(255,69,0,0.2)',
                      borderRadius: 10,
                      padding: '8px 16px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        color: '#FF4500',
                      }}
                    >
                      OBJETIVO{' '}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        color: '#F0F4FF',
                      }}
                    >
                      {OBJETIVO_LABEL[planoAtivo.objetivo]}
                    </span>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 10,
                      padding: '8px 16px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        color: '#7A869A',
                      }}
                    >
                      DURAÇÃO{' '}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        color: '#F0F4FF',
                      }}
                    >
                      {planoAtivo.totalSemanas} semanas
                    </span>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 10,
                      padding: '8px 16px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        color: '#7A869A',
                      }}
                    >
                      GERADO EM{' '}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        color: '#F0F4FF',
                      }}
                    >
                      {new Date(planoAtivo.geradoEm).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div
                  style={{ padding: '5px 40px 0', position: 'relative', display: 'inline-block' }}
                >
                  <div style={{ position: 'relative' }}>
                    <select
                      value={semanaAtiva?.id || ''}
                      onChange={(e) => {
                        const semana = planoAtivo.semanas.find(
                          (s) => s.id === parseInt(e.target.value)
                        );
                        setSemanaAtiva(semana);
                      }}
                      style={{
                        padding: '10px 48px 10px 18px',
                        background: '#0E1425',
                        border: '1px solid rgba(255,69,0,0.3)',
                        borderRadius: 10,
                        color: '#ffffff',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 20,
                        cursor: 'pointer',
                        outline: 'none',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        minWidth: 240,
                        colorScheme: 'dark',
                      }}
                    >
                      {planoAtivo.semanas?.map((semana) => (
                        <option
                          key={semana.id}
                          value={semana.id}
                          style={{ background: '#0E1425', color: '#F0F4FF' }}
                        >
                          Semana {semana.numeroSemana} — {FASE_LABEL[semana.fase]}
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        position: 'absolute',
                        right: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#FF4500',
                      }}
                    >
                      ▾
                    </div>
                  </div>
                </div>

                {semanaAtiva && (
                  <div>
                    <div
                      style={{
                        padding: '24px 40px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 24,
                          color: '#F0F4FF',
                        }}
                      >
                        Semana {semanaAtiva.numeroSemana} — {FASE_LABEL[semanaAtiva.fase]}
                      </span>
                      {semanaAtiva.volumeTotalKm && (
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 11,
                            color: '#7A869A',
                          }}
                        >
                          Volume: {semanaAtiva.volumeTotalKm} km
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${Math.min(semanaAtiva.sessoes?.length || 1, 3)}, 1fr)`,
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {[...(semanaAtiva.sessoes ?? [])]
                        .map((sessao) => ({
                          sessao,
                          dataSessao: calcularDataSessao(
                            planoAtivo.geradoEm,
                            semanaAtiva.numeroSemana,
                            sessao.diaSemana
                          ),
                        }))
                        .sort((a, b) => a.dataSessao - b.dataSessao)
                        .map(({ sessao, dataSessao }, i) => {
                          const isPast = dataSessao < hoje;
                          return (
                            <div
                              key={sessao.id}
                              style={{
                                borderRight:
                                  i < semanaAtiva.sessoes.length - 1
                                    ? '1px solid rgba(255,255,255,0.06)'
                                    : 'none',
                              }}
                            >
                              <SessaoCard
                                sessao={sessao}
                                isPast={isPast}
                                dataSessao={dataSessao}
                                concluido={sessaoConcluida(sessao.id)}
                                onRealizarTreino={handleRealizarTreino}
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ABA: HISTÓRICO */}
        {abaSelecionada === 'historico' && (
          <div style={{ padding: '32px 40px 60px' }}>
            {workoutsRegistrados.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 36,
                    color: '#7A869A',
                    marginBottom: 12,
                  }}
                >
                  NENHUM TREINO AINDA
                </div>
                <p style={{ color: '#7A869A', fontSize: 14 }}>
                  Realize seus treinos pelo GPS e eles aparecerão aqui.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[...workoutsRegistrados].reverse().map((w) => (
                  <div
                    key={w.id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderLeft: '3px solid #FF5500',
                      borderRadius: 12,
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 11,
                          color: '#FF5500',
                          textTransform: 'uppercase',
                          marginBottom: 4,
                        }}
                      >
                        🏃 Treino GPS
                      </div>
                      <div style={{ fontSize: 14, color: '#F0F4FF' }}>
                        {formatarDataHora(w.iniciadoEm)}
                      </div>
                      {w.descricao && (
                        <div
                          style={{
                            fontSize: 13,
                            color: '#A8B3C5',
                            marginTop: 6,
                            lineHeight: 1.4,
                          }}
                        >
                          {w.descricao}
                        </div>
                      )}
                      {w.clima && (
                        <div style={{ fontSize: 12, color: '#7A869A', marginTop: 4 }}>
                          🌡️ {w.clima.temperatura ?? '--'}°C · 💧 {w.clima.umidade ?? '--'}% ·
                          💨 {w.clima.velocidadeVento ?? '--'} km/h ·{' '}
                          {w.clima.descricaoClima || 'Clima registrado'}
                        </div>
                      )}
                      {(w.distanciaMetaKm ?? encontrarSessaoPorId(w.sessaoTreinoId)?.distanciaKm) && (
                        <div style={{ fontSize: 12, color: '#7A869A', marginTop: 4 }}>
                          Meta: {w.distanciaMetaKm ?? encontrarSessaoPorId(w.sessaoTreinoId)?.distanciaKm} km ·
                          Percorrido: {formatarKm(w.distanciaTotalMetros)}
                        </div>
                      )}
                    </div>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}
                    >
                      {w.distanciaTotalMetros > 0 && (
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: 22,
                              color: '#F0F4FF',
                            }}
                          >
                            {(w.distanciaTotalMetros / 1000).toFixed(2)} km
                          </div>
                          <div
                            style={{
                              fontFamily: "'Space Mono', monospace",
                              fontSize: 10,
                              color: '#7A869A',
                            }}
                          >
                            distância
                          </div>
                        </div>
                      )}
                      {w.paceMediaFormatado && w.paceMediaFormatado !== '--:--' && (
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: 22,
                              color: '#F0F4FF',
                            }}
                          >
                            {w.paceMediaFormatado}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Space Mono', monospace",
                              fontSize: 10,
                              color: '#7A869A',
                            }}
                          >
                            ritmo médio
                          </div>
                        </div>
                      )}
                      {w.duracaoTotalSegundos > 0 && (
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: 22,
                              color: '#F0F4FF',
                            }}
                          >
                            {Math.floor(w.duracaoTotalSegundos / 60)}min
                          </div>
                          <div
                            style={{
                              fontFamily: "'Space Mono', monospace",
                              fontSize: 10,
                              color: '#7A869A',
                            }}
                          >
                            tempo
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => setWorkoutDetalhe(enriquecerWorkout(w))}
                        style={{
                          background: 'rgba(255,85,0,0.12)',
                          border: '1px solid rgba(255,85,0,0.35)',
                          borderRadius: 8,
                          padding: '8px 16px',
                          color: '#FF5500',
                          fontSize: 13,
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Detalhes
                      </button>
                      <button
                        onClick={() => handleVerPercurso(w)}
                        style={{
                          background: 'rgba(76,175,80,0.12)',
                          border: '1px solid rgba(76,175,80,0.35)',
                          borderRadius: 8,
                          padding: '8px 16px',
                          color: '#4CAF50',
                          fontSize: 13,
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Ver percurso
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA: PERFIL */}
        {abaSelecionada === 'perfil' && (
          <div style={{ padding: '32px 40px 60px', maxWidth: 700 }}>
            {!perfil ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 36,
                    color: '#7A869A',
                    marginBottom: 12,
                  }}
                >
                  PERFIL NÃO CADASTRADO
                </div>
                <p style={{ color: '#7A869A', fontSize: 14 }}>
                  Cadastre seu perfil para gerar planos personalizados.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Nível de experiência', NIVEL_LABEL[perfil.nivelExperiencia]],
                  ['Objetivo', OBJETIVO_LABEL[perfil.objetivo]],
                  ['Pace médio', `${paceFormatado(perfil.paceMedioSegundos)}/km`],
                  [
                    'Data da prova',
                    perfil.dataProva
                      ? new Date(perfil.dataProva).toLocaleDateString('pt-BR')
                      : '--',
                  ],
                  ['Dias disponíveis', perfil.diasDisponiveis?.map((d) => DIA_LABEL[d]).join(', ')],
                ].map(([label, valor]) => (
                  <div
                    key={label}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12,
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        color: '#7A869A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ color: '#F0F4FF', fontSize: 14, fontWeight: 500 }}>{valor}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <HistoricoDetalhes workout={workoutDetalhe} onClose={() => setWorkoutDetalhe(null)} />
      <PercursoModal
        workout={percurso}
        pontos={pontosPercurso}
        loading={loadingPercurso}
        erro={erroPercurso}
        onClose={fecharPercurso}
      />

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(122,134,154,0.5); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #080C18; }
        ::-webkit-scrollbar-thumb { background: rgba(255,69,0,0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}
