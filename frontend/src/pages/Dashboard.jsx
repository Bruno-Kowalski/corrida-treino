import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/Api";

const OBJETIVO_LABEL = {
  CINCO_KM: "5 KM",
  DEZ_KM: "10 KM",
  MEIA_MARATONA: "Meia Maratona",
};

const NIVEL_LABEL = {
  INICIANTE: "Iniciante",
  INTERMEDIARIO: "Intermediário",
  AVANCADO: "Avançado",
};

const FASE_LABEL = {
  BASE: "Base",
  DESENVOLVIMENTO: "Desenvolvimento",
  PICO: "Pico",
  TAPER: "Taper",
};

const TIPO_LABEL = {
  LONGO: "Longo",
  INTERVALADO: "Intervalado",
  TEMPO: "Tempo",
  RECUPERACAO: "Recuperação",
};

const TIPO_COR = {
  LONGO: "#FF4500",
  INTERVALADO: "#FF6B2B",
  TEMPO: "#FFB347",
  RECUPERACAO: "#4CAF50",
};

const DIA_LABEL = {
  SEGUNDA: "Segunda",
  TERCA: "Terça",
  QUARTA: "Quarta",
  QUINTA: "Quinta",
  SEXTA: "Sexta",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

const paceFormatado = (segundos) => {
  if (!segundos) return "--";
  const min = Math.floor(segundos / 60);
  const sec = segundos % 60;
  return `${min}'${sec.toString().padStart(2, "0")}"`;
};

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "24px 20px",
      flex: 1, minWidth: 140,
    }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#7A869A", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#F0F4FF", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#7A869A", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SessaoCard({ sessao, onRegistrar }) {
  const [hovered, setHovered] = useState(false);
  const cor = TIPO_COR[sessao.tipo] || "#FF4500";

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: hovered ? "rgba(255,69,0,0.06)" : "rgba(255,255,255,0.02)",
      borderLeft: `4px solid ${cor}`,
      borderRadius: 0,
      padding: "28px 32px",
      transition: "all 0.2s",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: cor, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            {DIA_LABEL[sessao.diaSemana]} · {TIPO_LABEL[sessao.tipo]}
          </span>
          <div style={{ fontSize: 15, color: "#F0F4FF", fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>{sessao.descricao}</div>
        </div>
        <button onClick={() => onRegistrar(sessao)} style={{
          background: "rgba(255,69,0,0.1)", border: "1px solid rgba(255,69,0,0.3)",
          borderRadius: 8, padding: "8px 20px",
          color: "#FF4500", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
          whiteSpace: "nowrap", flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#FF4500"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,69,0,0.1)"; e.currentTarget.style.color = "#FF4500"; }}
        >Registrar</button>
      </div>
      <div style={{ display: "flex", gap: 28, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {sessao.distanciaKm && (
          <div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A869A" }}>Distância </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#F0F4FF", fontWeight: 700 }}>{sessao.distanciaKm} km</span>
          </div>
        )}
        {sessao.paceAlvo && (
          <div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A869A" }}>Pace alvo </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#F0F4FF", fontWeight: 700 }}>{sessao.paceAlvo}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalRegistro({ sessao, onClose, onSalvar }) {
  const [realizado, setRealizado] = useState(true);
  const [distancia, setDistancia] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    setLoading(true);
    await onSalvar(sessao.id, { realizado, distanciaRealKm: distancia ? parseFloat(distancia) : null, observacao });
    setLoading(false);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0E1425", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16, padding: "32px", width: "100%", maxWidth: 440,
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#F0F4FF", marginBottom: 4 }}>Registrar Treino</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", marginBottom: 24 }}>
          {DIA_LABEL[sessao.diaSemana]} · {TIPO_LABEL[sessao.tipo]}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#7A869A", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: 10 }}>Treino realizado?</label>
          <div style={{ display: "flex", gap: 10 }}>
            {[true, false].map(val => (
              <button key={String(val)} onClick={() => setRealizado(val)} style={{
                flex: 1, padding: "10px",
                background: realizado === val ? "#FF4500" : "rgba(255,255,255,0.04)",
                border: `1px solid ${realizado === val ? "#FF4500" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8, color: "#F0F4FF",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                cursor: "pointer", transition: "all 0.2s",
              }}>{val ? "✓ Sim" : "✗ Não"}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#7A869A", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: 8 }}>Distância real (km)</label>
          <input type="number" step="0.1" value={distancia} onChange={e => setDistancia(e.target.value)} placeholder={sessao.distanciaKm ? `Planejado: ${sessao.distanciaKm} km` : "Ex: 8.5"}
            style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#F0F4FF", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", caretColor: "#FF4500" }}
            onFocus={e => e.target.style.borderColor = "#FF4500"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
          />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#7A869A", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: 8 }}>Observação</label>
          <textarea value={observacao} onChange={e => setObservacao(e.target.value)} placeholder="Como foi o treino? Alguma observação?" rows={3}
            style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#F0F4FF", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", caretColor: "#FF4500", resize: "none" }}
            onFocus={e => e.target.style.borderColor = "#FF4500"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#7A869A", fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer" }}>Cancelar</button>
          <button onClick={handleSalvar} disabled={loading} style={{ flex: 2, padding: "13px", background: "#FF4500", border: "none", borderRadius: 10, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.1em", cursor: "pointer", boxShadow: "0 4px 20px rgba(255,69,0,0.4)" }}>
            {loading ? "Salvando..." : "Salvar Registro"}
          </button>
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
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gerandoPlano, setGerandoPlano] = useState(false);
  const [sessaoModal, setSessaoModal] = useState(null);
  const [erro, setErro] = useState(null);
  const [abaSelecionada, setAbaSelecionada] = useState("treinos");

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [perfilRes, planosRes, registrosRes] = await Promise.all([
        api.get("/perfil").catch(() => ({ data: null })),
        api.get("/planos"),
        api.get("/registros"),
      ]);
      setPerfil(perfilRes.data);
      setPlanos(planosRes.data);
      setRegistros(registrosRes.data);
      if (planosRes.data.length > 0) {
        const ultimo = planosRes.data[planosRes.data.length - 1];
        setPlanoAtivo(ultimo);
        if (ultimo.semanas?.length > 0) setSemanaAtiva(ultimo.semanas[0]);
      }
    } catch (err) {
      setErro("Erro ao carregar dados. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleGerarPlano = async () => {
    setGerandoPlano(true);
    try {
      const { data } = await api.post("/planos/gerar");
      setPlanos(prev => [...prev, data]);
      setPlanoAtivo(data);
      if (data.semanas?.length > 0) setSemanaAtiva(data.semanas[0]);
    } catch (err) {
      setErro("Erro ao gerar plano. Verifique se você tem um perfil cadastrado.");
    } finally {
      setGerandoPlano(false);
    }
  };

  const handleRegistrar = async (sessaoId, dados) => {
    try {
      const { data } = await api.post(`/registros/sessao/${sessaoId}`, dados);
      setRegistros(prev => [...prev, data]);
    } catch (err) {
      setErro("Erro ao registrar treino.");
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const totalKmRegistrado = registros.filter(r => r.realizado && r.distanciaRealKm).reduce((acc, r) => acc + r.distanciaRealKm, 0);
  const treinosRealizados = registros.filter(r => r.realizado).length;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080C18", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#FF4500", marginBottom: 16 }}>PACEX</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#7A869A", letterSpacing: "0.2em" }}>CARREGANDO...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080C18", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 40px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(8,12,24,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#F0F4FF", letterSpacing: "0.08em" }}>PACE</span>
          <img src="/logosemnomecopia.png" alt="X" style={{ height: 28, width: "auto", marginLeft: -4 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,69,0,0.15)", border: "1px solid rgba(255,69,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", fontWeight: 700 }}>
            {user?.nome?.charAt(0).toUpperCase() || "U"}
          </div>
          <span style={{ color: "#A8B3C5", fontSize: 14 }}>{user?.nome}</span>
          <button onClick={handleLogout} style={{ marginLeft: 16, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 16px", color: "#7A869A", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,69,0,0.4)"; e.currentTarget.style.color = "#FF4500"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#7A869A"; }}
          >Sair</button>
        </div>
      </nav>

      <div style={{ paddingTop: 64 }}>

        {/* ── ERRO ── */}
        {erro && (
          <div style={{ margin: "20px 40px 0", background: "rgba(255,69,0,0.1)", border: "1px solid rgba(255,69,0,0.3)", borderRadius: 10, padding: "12px 16px", color: "#FF6B2B", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            ⚠ {erro}
            <button onClick={() => setErro(null)} style={{ background: "none", border: "none", color: "#FF6B2B", cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
        )}

        {/* ── HEADER ── */}
        <div style={{ padding: "40px 40px 0" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#FF4500", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>Bem-vindo de volta</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#F0F4FF", lineHeight: 1 }}>{user?.nome?.toUpperCase() || "ATLETA"}</h1>
            {perfil && (
              <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#FF4500" }}>{NIVEL_LABEL[perfil.nivelExperiencia]}</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#FF4500" }}>Objetivo: {OBJETIVO_LABEL[perfil.objetivo]}</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#FF4500" }}>Pace médio: {paceFormatado(perfil.paceMedioSegundos)}/km</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
            <StatCard label="Planos gerados" value={planos.length} />
            <StatCard label="Treinos feitos" value={treinosRealizados} />
            <StatCard label="KM registrados" value={`${totalKmRegistrado.toFixed(1)} km`} />
            {perfil && <StatCard label="Prova alvo" value={OBJETIVO_LABEL[perfil.objetivo]} sub={perfil.dataProva ? `Data: ${new Date(perfil.dataProva).toLocaleDateString("pt-BR")}` : null} />}
          </div>

          {/* Abas */}
          <div style={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 0 }}>
            {[["treinos", "Plano de Treino"], ["historico", "Histórico"], ["perfil", "Perfil"]].map(([id, label]) => (
              <button key={id} onClick={() => setAbaSelecionada(id)} style={{
                padding: "12px 24px", background: "none", border: "none",
                borderBottom: abaSelecionada === id ? "2px solid #FF4500" : "2px solid transparent",
                color: abaSelecionada === id ? "#F0F4FF" : "#7A869A",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                cursor: "pointer", transition: "all 0.2s", marginBottom: -1,
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* ── ABA: PLANO DE TREINO ── */}
        {abaSelecionada === "treinos" && (
          <div>
            {!planoAtivo ? (
              <div style={{ padding: "32px 40px 60px" }}>
                <div style={{ textAlign: "center", padding: "80px 20px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#7A869A", marginBottom: 12 }}>NENHUM PLANO ATIVO</div>
                  <p style={{ color: "#7A869A", fontSize: 14, marginBottom: 24 }}>Gere seu primeiro plano personalizado de treino.</p>
                  <button onClick={handleGerarPlano} disabled={gerandoPlano} style={{ padding: "14px 32px", background: "#FF4500", border: "none", borderRadius: 10, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.1em", cursor: "pointer", boxShadow: "0 4px 24px rgba(255,69,0,0.4)" }}>
                    {gerandoPlano ? "Gerando..." : "Gerar Plano"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Info do plano */}
                <div style={{ padding: "24px 40px 0", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                  <div style={{ background: "rgba(255,69,0,0.08)", border: "1px solid rgba(255,69,0,0.2)", borderRadius: 10, padding: "8px 16px" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500" }}>OBJETIVO </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#F0F4FF" }}>{OBJETIVO_LABEL[planoAtivo.objetivo]}</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 16px" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A869A" }}>DURAÇÃO </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#F0F4FF" }}>{planoAtivo.totalSemanas} semanas</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 16px" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A869A" }}>GERADO EM </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#F0F4FF" }}>{new Date(planoAtivo.geradoEm).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>

                {/* Seletor de semanas — dropdown customizado */}
<div style={{ padding: "5px 40px 0", position: "relative", display: "inline-block" }}>
  <div style={{ position: "relative" }}>
    <select
      value={semanaAtiva?.id || ""}
      onChange={e => {
        const semana = planoAtivo.semanas.find(s => s.id === parseInt(e.target.value));
        setSemanaAtiva(semana);
      }}
      style={{
        padding: "10px 48px 10px 18px",
        background: "#0E1425",
        border: "1px solid rgba(255,69,0,0.3)",
        borderRadius: 10,
        color: "#ffffff",
        fontFamily: "'Space Mono', monospace",
        fontSize: 20,
        cursor: "pointer",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
        minWidth: 240,
        colorScheme: "dark",
      }}
    >
      {planoAtivo.semanas?.map(semana => (
        <option
          key={semana.id}
          value={semana.id}
          style={{ background: "#0E1425", color: "#F0F4FF" }}
        >
          Semana {semana.numeroSemana} — {FASE_LABEL[semana.fase]}
        </option>
      ))}
    </select>
    {/* Seta customizada */}
    <div style={{
      position: "absolute", right: 14, top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none", color: "#FF4500",
    }}>▾</div>
  </div>
</div>

                {/* Sessões — full width */}
                {semanaAtiva && (
                  <div>
                    <div style={{ padding: "24px 40px 16px", display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#F0F4FF" }}>Semana {semanaAtiva.numeroSemana} — {FASE_LABEL[semanaAtiva.fase]}</span>
                      {semanaAtiva.volumeTotalKm && (
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A869A" }}>Volume: {semanaAtiva.volumeTotalKm} km</span>
                      )}
                    </div>

                    {/* Grid full width sem padding lateral */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${Math.min(semanaAtiva.sessoes?.length || 1, 3)}, 1fr)`,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      {semanaAtiva.sessoes?.map((sessao, i) => (
                        <div key={sessao.id} style={{
                          borderRight: i < (semanaAtiva.sessoes.length - 1) ? "1px solid rgba(255,255,255,0.06)" : "none",
                        }}>
                          <SessaoCard sessao={sessao} onRegistrar={setSessaoModal} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: HISTÓRICO ── */}
        {abaSelecionada === "historico" && (
          <div style={{ padding: "32px 40px 60px" }}>
            {registros.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#7A869A", marginBottom: 12 }}>NENHUM REGISTRO AINDA</div>
                <p style={{ color: "#7A869A", fontSize: 14 }}>Complete seus treinos e registre o progresso aqui.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[...registros].reverse().map(reg => (
                  <div key={reg.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${reg.realizado ? "#4CAF50" : "rgba(255,255,255,0.15)"}`, borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: reg.realizado ? "#4CAF50" : "#7A869A", textTransform: "uppercase", marginBottom: 4 }}>
                        {reg.realizado ? "✓ Realizado" : "✗ Não realizado"}
                      </div>
                      <div style={{ fontSize: 14, color: "#F0F4FF" }}>
                        {reg.sessao?.tipo ? TIPO_LABEL[reg.sessao.tipo] : "Sessão"} — {reg.sessao?.diaSemana ? DIA_LABEL[reg.sessao.diaSemana] : ""}
                      </div>
                      {reg.observacao && <div style={{ fontSize: 13, color: "#7A869A", marginTop: 4 }}>{reg.observacao}</div>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {reg.distanciaRealKm && (
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#F0F4FF" }}>{reg.distanciaRealKm} km</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: PERFIL ── */}
        {abaSelecionada === "perfil" && (
          <div style={{ padding: "32px 40px 60px", maxWidth: 700 }}>
            {!perfil ? (
              <div style={{ textAlign: "center", padding: "80px 20px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#7A869A", marginBottom: 12 }}>PERFIL NÃO CADASTRADO</div>
                <p style={{ color: "#7A869A", fontSize: 14 }}>Cadastre seu perfil para gerar planos personalizados.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  ["Nível de experiência", NIVEL_LABEL[perfil.nivelExperiencia]],
                  ["Objetivo", OBJETIVO_LABEL[perfil.objetivo]],
                  ["Pace médio", `${paceFormatado(perfil.paceMedioSegundos)}/km`],
                  ["Data da prova", perfil.dataProva ? new Date(perfil.dataProva).toLocaleDateString("pt-BR") : "--"],
                  ["Dias disponíveis", perfil.diasDisponiveis?.map(d => DIA_LABEL[d]).join(", ")],
                ].map(([label, valor]) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A869A", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                    <span style={{ color: "#F0F4FF", fontSize: 14, fontWeight: 500 }}>{valor}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {sessaoModal && (
        <ModalRegistro sessao={sessaoModal} onClose={() => setSessaoModal(null)} onSalvar={handleRegistrar} />
      )}

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(122,134,154,0.5); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #080C18; }
        ::-webkit-scrollbar-thumb { background: rgba(255,69,0,0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}
