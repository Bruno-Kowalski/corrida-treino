import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  iniciarWorkout,
  enviarPontos,
  finalizarWorkout,
  registrarWorkout,
} from '../services/workoutService';
import '../styles/execucao-treino.css';

const POSICAO_INICIAL = [-15.7942, -47.8825];

function calcDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatTempo(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

function formatPace(segPorKm) {
  if (!segPorKm || segPorKm <= 0 || !isFinite(segPorKm)) return '--:--';
  const m = Math.floor(segPorKm / 60);
  const s = Math.round(segPorKm % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function getTurno() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return '🌅 Manhã';
  if (h >= 12 && h < 18) return '☀️ Tarde';
  return '🌙 Noite';
}

const ESTADO = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  FINISHING: 'finishing',
  SUMMARY: 'summary',
};

function CartaoMetrica({ label, valor, destaque }) {
  return (
    <div className={`et-cartao${destaque ? ' et-cartao--alerta' : ''}`}>
      <span className="et-cartao__val">{valor}</span>
      <span className="et-cartao__lbl">{label}</span>
    </div>
  );
}

export default function ExecucaoTreino() {
  const { state: routeState } = useLocation();
  const navigate = useNavigate();
  const treino = routeState?.treino;

  // Mapa (Leaflet puro)
  const mapDivRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);

  // GPS
  const watchIdRef = useRef(null);
  const lastPosRef = useRef(null);
  const pontosBufferRef = useRef([]);
  const envioIntervalRef = useRef(null);

  // Timer
  const startTimeRef = useRef(null);
  const pausedAccRef = useRef(0);
  const pauseStartRef = useRef(null);
  const rafRef = useRef(null);

  // Elevação
  const lastAltRef = useRef(null);
  const elevGainRef = useRef(0);
  const maxElevRef = useRef(0);
  const turnoRef = useRef(getTurno());

  // Estado UI
  const [estado, setEstado] = useState(ESTADO.IDLE);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [distanciaM, setDistanciaM] = useState(0);
  const [ritmoMedioSeg, setRitmoMedioSeg] = useState(0);
  const [rota, setRota] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [workoutId, setWorkoutId] = useState(null);
  const [resumo, setResumo] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [loadingFinalizar, setLoadingFinalizar] = useState(false);
  const [loadingRegistrar, setLoadingRegistrar] = useState(false);
  const [treinoRegistrado, setTreinoRegistrado] = useState(false);
  const [erroMsg, setErroMsg] = useState(null);

  // ── Inicializa mapa Leaflet ───────────────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || leafletMapRef.current) return;

    leafletMapRef.current = L.map(mapDivRef.current, {
      center: POSICAO_INICIAL,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(leafletMapRef.current);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
        polylineRef.current = null;
      }
    };
  }, []);

  // ── Timer ────────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current - pausedAccRef.current;
    setElapsedMs(elapsed);
    setDistanciaM((prev) => {
      if (prev > 0 && elapsed > 0) {
        setRitmoMedioSeg(elapsed / 1000 / (prev / 1000));
      }
      return prev;
    });
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── Feedback inteligente ─────────────────────────────────────────────────────
  const gerarFeedback = useCallback(
    (distAtualM, paceAtualSeg) => {
      if (!treino) return;
      const msgs = [];

      if (treino.ritmoAlvo && paceAtualSeg > 0) {
        const partes = treino.ritmoAlvo.split(':').map(Number);
        const alvoSeg = partes[0] * 60 + (partes[1] || 0);
        const diff = Math.round(paceAtualSeg - alvoSeg);
        if (diff > 20) msgs.push(`⚠️ ${diff}s/km acima do ritmo alvo — acelere`);
        else if (diff < -20) msgs.push(`⬇️ ${Math.abs(diff)}s/km abaixo do alvo — reduza`);
        else msgs.push('✅ Dentro do ritmo planejado!');
      }

      if (treino.distanciaKm) {
        const restanteM = treino.distanciaKm * 1000 - distAtualM;
        if (restanteM > 0 && restanteM <= 800)
          msgs.push(`🏁 Faltam ${Math.round(restanteM)}m para completar!`);
        else if (restanteM <= 0) msgs.push('🎉 Distância alvo alcançada!');
      }

      if (msgs.length > 0) {
        setFeedback(msgs[0]);
        setTimeout(() => setFeedback(null), 8000);
      }
    },
    [treino]
  );

  // ── Envio periódico de pontos ao backend ────────────────────────────────────
  const iniciarEnvioPontos = useCallback((id) => {
    envioIntervalRef.current = setInterval(async () => {
      if (pontosBufferRef.current.length === 0) return;
      const lote = [...pontosBufferRef.current];
      pontosBufferRef.current = [];
      try {
        await enviarPontos(id, lote);
      } catch {
        pontosBufferRef.current = [...lote, ...pontosBufferRef.current];
      }
    }, 5000);
  }, []);

  // ── GPS ───────────────────────────────────────────────────────────────────────
  const iniciarGPS = useCallback(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, altitude, speed } = pos.coords;

        // Atualiza mapa
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([latitude, longitude], 16);

          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.circleMarker([latitude, longitude], {
              radius: 9,
              color: '#FF5500',
              fillColor: '#FF5500',
              fillOpacity: 1,
              weight: 3,
            }).addTo(leafletMapRef.current);
          }

          setRota((prev) => {
            const nova = [...prev, [latitude, longitude]];
            if (polylineRef.current) {
              polylineRef.current.setLatLngs(nova);
            } else {
              polylineRef.current = L.polyline(nova, {
                color: '#FF5500',
                weight: 4,
                opacity: 0.85,
              }).addTo(leafletMapRef.current);
            }
            return nova;
          });
        }

        // Distância
        if (lastPosRef.current) {
          const delta = calcDistancia(
            lastPosRef.current[0],
            lastPosRef.current[1],
            latitude,
            longitude
          );
          if (delta < 50) {
            setDistanciaM((prev) => {
              const nova = prev + delta;
              if (speed && speed > 0.5) {
                const paceAtual = 1000 / speed;
                gerarFeedback(nova, paceAtual);
              }
              return nova;
            });
          }
        }
        lastPosRef.current = [latitude, longitude];

        // Elevação
        if (altitude !== null) {
          if (lastAltRef.current !== null && altitude > lastAltRef.current)
            elevGainRef.current += altitude - lastAltRef.current;
          if (altitude > maxElevRef.current) maxElevRef.current = altitude;
          lastAltRef.current = altitude;
        }

        // Buffer de pontos
        pontosBufferRef.current.push({
          lat: latitude,
          lng: longitude,
          altitudeM: altitude ?? null,
          registradoEm: new Date().toISOString(),
        });
      },
      (err) => console.warn('GPS:', err.message),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );
  }, [gerarFeedback]);

  const pararGPS = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    clearInterval(envioIntervalRef.current);
  }, []);

  // ── Controles ────────────────────────────────────────────────────────────────
  const handleIniciar = useCallback(async () => {
    setErroMsg(null);
    try {
      const posInicial = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      );
      turnoRef.current = getTurno();
      const { data } = await iniciarWorkout(
        posInicial.coords.latitude,
        posInicial.coords.longitude,
        treino
      );
      setWorkoutId(data.workoutId);
      startTimeRef.current = Date.now();
      pausedAccRef.current = 0;
      setEstado(ESTADO.RUNNING);
      rafRef.current = requestAnimationFrame(tick);
      iniciarGPS();
      iniciarEnvioPontos(data.workoutId);
    } catch (err) {
      if (err?.response) {
        setErroMsg('Este treino já foi concluído e não pode ser iniciado novamente.');
        return;
      }
      setErroMsg('Não foi possível obter localização. Verifique as permissões de GPS.');
    }
  }, [tick, iniciarGPS, iniciarEnvioPontos, treino]);

  const handlePausar = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    pauseStartRef.current = Date.now();
    pararGPS();
    setEstado(ESTADO.PAUSED);
    setShowPauseModal(true);
  }, [pararGPS]);

  const handleContinuar = useCallback(() => {
    if (pauseStartRef.current) {
      pausedAccRef.current += Date.now() - pauseStartRef.current;
      pauseStartRef.current = null;
    }
    setEstado(ESTADO.RUNNING);
    setShowPauseModal(false);
    rafRef.current = requestAnimationFrame(tick);
    iniciarGPS();
    iniciarEnvioPontos(workoutId);
  }, [tick, iniciarGPS, iniciarEnvioPontos, workoutId]);

  const handleFinalizar = useCallback(async () => {
    cancelAnimationFrame(rafRef.current);
    pararGPS();
    setShowPauseModal(false);
    setEstado(ESTADO.FINISHING);
    setLoadingFinalizar(true);
    setErroMsg(null);

    if (pontosBufferRef.current.length > 0) {
      try {
        await enviarPontos(workoutId, pontosBufferRef.current);
        pontosBufferRef.current = [];
      } catch {
        /* silencioso */
      }
    }

    try {
      const { data } = await finalizarWorkout(workoutId);
      setResumo(data);
      setEstado(ESTADO.SUMMARY);
    } catch {
      setErroMsg('Não foi possível processar o treino. Tente novamente.');
      setEstado(ESTADO.PAUSED);
      setShowPauseModal(true);
    } finally {
      setLoadingFinalizar(false);
    }
  }, [pararGPS, workoutId]);

  const handleRegistrar = useCallback(async () => {
    console.log('workoutId ao registrar:', workoutId); // ← adiciona aqui
    setLoadingRegistrar(true);
    setErroMsg(null);
    try {
      await registrarWorkout(workoutId, descricao);
      setTreinoRegistrado(true);
      setTimeout(() => navigate('/dashboard'), 900);
    } catch {
      setErroMsg('Erro ao registrar treino. Tente novamente.');
    } finally {
      setLoadingRegistrar(false);
    }
  }, [workoutId, descricao, navigate]);

  // ── Cleanup ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      pararGPS();
    };
  }, [pararGPS]);

  useEffect(() => {
    if (estado !== ESTADO.SUMMARY || !leafletMapRef.current) return;

    leafletMapRef.current.remove();
    leafletMapRef.current = null;
    markerRef.current = null;
    polylineRef.current = null;
  }, [estado]);

  // ── Tela de Resumo ────────────────────────────────────────────────────────────
  if (estado === ESTADO.SUMMARY && resumo) {
    const distanciaPercorrida = ((resumo.distanciaTotalMetros || 0) / 1000).toFixed(2);
    const distanciaAlvo = treino?.distanciaKm;
    const abaixoDoAlvo = distanciaAlvo && parseFloat(distanciaPercorrida) < distanciaAlvo * 0.85;

    return (
      <div className="et-resumo">
        <div className="et-resumo__content">
        <div className="et-resumo__header">
          <h2>Treino Finalizado 🎉</h2>
          {treino && <span className="et-badge">{treino.tipo}</span>}
        </div>

        <div className="et-resumo__grid">
          <CartaoMetrica label="Tempo total" valor={formatTempo(elapsedMs)} />
          <CartaoMetrica
            label="Distância"
            valor={`${distanciaPercorrida} km`}
            destaque={abaixoDoAlvo}
          />
          <CartaoMetrica label="Ritmo médio" valor={resumo.paceMediaFormatado || '--:--'} />
          <CartaoMetrica label="Ganho elevação" valor={`${elevGainRef.current.toFixed(0)} m`} />
          <CartaoMetrica label="Turno" valor={turnoRef.current} />
          {distanciaAlvo && (
            <CartaoMetrica
              label="Meta"
              valor={`${distanciaPercorrida} / ${distanciaAlvo} km`}
              destaque={abaixoDoAlvo}
            />
          )}
        </div>

        {resumo.clima && (
          <div className="et-resumo__clima">
            🌡️ {resumo.clima.temperatura}°C &nbsp;|&nbsp; 💧 {resumo.clima.umidade}% &nbsp;|&nbsp;
            💨 {resumo.clima.velocidadeVento} km/h &nbsp;|&nbsp;
            {resumo.clima.descricaoClima}
          </div>
        )}

        {resumo.segmentos?.length > 0 && (
          <div className="et-resumo__segmentos">
            <h3>Segmentos por km</h3>
            {resumo.segmentos.map((seg) => (
              <div key={seg.indice} className="et-segmento">
                <span>Km {seg.indice + 1}</span>
                <span>{seg.paceFormatado}</span>
                {seg.ganhoElevacaoM > 0 && <span>↑ {seg.ganhoElevacaoM.toFixed(0)}m</span>}
              </div>
            ))}
          </div>
        )}

        <div className="et-resumo__descricao">
          <label className="et-descricao__label">
            {abaixoDoAlvo
              ? `⚠️ Você ficou ${(distanciaAlvo - parseFloat(distanciaPercorrida)).toFixed(1)} km abaixo da meta. O que aconteceu?`
              : '✍️ Como foi o treino? Seu comentário ajuda a calibrar os próximos.'}
          </label>

          {abaixoDoAlvo && (
            <div className="et-descricao__sugestoes">
              {[
                'Cansei antes do esperado',
                'Faltou resistência',
                'Dor ou desconforto',
                'Falta de tempo',
                'Condições climáticas',
              ].map((op) => (
                <button
                  key={op}
                  className={`et-sugestao-btn${descricao === op ? ' et-sugestao-btn--ativo' : ''}`}
                  onClick={() => setDescricao(op)}
                >
                  {op}
                </button>
              ))}
            </div>
          )}

          <textarea
            className="et-descricao__textarea"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Ritmo bom nos primeiros km, cansei no final..."
            rows={4}
          />
          <p className="et-descricao__hint">
            Suas observações ajudam o sistema a ajustar os próximos treinos ao seu ritmo.
          </p>
        </div>

        {erroMsg && <div className="et-erro">{erroMsg}</div>}

        <div className="et-resumo__actions">
          {treinoRegistrado ? (
            <button className="et-btn et-btn--primary" disabled>
              Treino concluído
            </button>
          ) : (
          <button
            className="et-btn et-btn--primary"
            onClick={handleRegistrar}
            disabled={loadingRegistrar || treinoRegistrado}
          >
            {loadingRegistrar ? 'Registrando...' : '💾 Registrar Treino'}
          </button>
          )}
          <button className="et-btn et-btn--ghost" onClick={() => navigate('/dashboard')}>
            Descartar e voltar
          </button>
        </div>
        </div>
      </div>
    );
  }

  // ── Tela de execução GPS ──────────────────────────────────────────────────────
  return (
    <div className={`et-wrapper${estado !== ESTADO.IDLE ? ' et-wrapper--active' : ''}`}>
      {/* Mapa Leaflet puro */}
      <div ref={mapDivRef} className="et-map" />

      {/* Header com contexto do treino */}
      {treino && estado === ESTADO.IDLE && (
        <div className="et-header">
          <button className="et-back-btn" onClick={() => navigate(-1)}>
            ←
          </button>
          <div className="et-header__info">
            <span className="et-header__tipo">{treino.tipo}</span>
            <span className="et-header__meta">
              {treino.distanciaKm} km · {treino.ritmoAlvo}/km alvo
            </span>
          </div>
        </div>
      )}

      {/* Feedback inteligente */}
      {feedback && <div className="et-feedback">{feedback}</div>}

      {/* Erro */}
      {erroMsg && (
        <div className="et-feedback" style={{ background: 'rgba(220,53,69,0.92)' }}>
          {erroMsg}
          <button
            onClick={() => setErroMsg(null)}
            style={{
              marginLeft: 8,
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Loading ao finalizar */}
      {loadingFinalizar && (
        <div className="et-loading-overlay">
          <p>Processando treino...</p>
        </div>
      )}

      {/* Painel de métricas */}
      <div className="et-panel">
        <div className="et-metrics">
          <div className="et-metric">
            <span className="et-metric__val">{formatTempo(elapsedMs)}</span>
            <span className="et-metric__lbl">Tempo</span>
          </div>
          <div className="et-metric et-metric--center">
            <span className="et-metric__val">{(distanciaM / 1000).toFixed(2)}</span>
            <span className="et-metric__lbl">km</span>
          </div>
          <div className="et-metric">
            <span className="et-metric__val">{formatPace(ritmoMedioSeg)}</span>
            <span className="et-metric__lbl">Ritmo médio</span>
          </div>
        </div>

        <div className="et-controls">
          {estado === ESTADO.IDLE && (
            <button className="et-fab et-fab--start" onClick={handleIniciar}>
              ▶<span>Iniciar</span>
            </button>
          )}
          {estado === ESTADO.RUNNING && (
            <button className="et-fab et-fab--pause" onClick={handlePausar}>
              ⏸<span>Pausar</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal de pausa */}
      {showPauseModal && (
        <div className="et-modal-overlay">
          <div className="et-modal">
            <p className="et-modal__title">Treino pausado</p>
            <p className="et-modal__meta">
              {(distanciaM / 1000).toFixed(2)} km · {formatTempo(elapsedMs)}
            </p>
            <div className="et-modal__actions">
              <button className="et-btn et-btn--primary" onClick={handleContinuar}>
                ▶ Continuar
              </button>
              <button className="et-btn et-btn--danger" onClick={handleFinalizar}>
                🏁 Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
