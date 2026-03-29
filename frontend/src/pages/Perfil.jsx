import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/Api";

const DIAS = [
  { valor: "SEGUNDA", label: "Seg" },
  { valor: "TERCA", label: "Ter" },
  { valor: "QUARTA", label: "Qua" },
  { valor: "QUINTA", label: "Qui" },
  { valor: "SEXTA", label: "Sex" },
  { valor: "SABADO", label: "Sáb" },
  { valor: "DOMINGO", label: "Dom" },
];

const NIVEIS = [
  { valor: "INICIANTE", label: "Iniciante", desc: "Corro há menos de 1 ano ou irregularmente" },
  { valor: "INTERMEDIARIO", label: "Intermediário", desc: "Corro regularmente há 1-3 anos" },
  { valor: "AVANCADO", label: "Avançado", desc: "Corro há mais de 3 anos com treinos estruturados" },
];

const OBJETIVOS = [
  { valor: "CINCO_KM", label: "5 KM", desc: "Completar ou melhorar nos 5km" },
  { valor: "DEZ_KM", label: "10 KM", desc: "Completar ou melhorar nos 10km" },
  { valor: "MEIA_MARATONA", label: "Meia Maratona", desc: "Completar 21km" },
];

export default function Perfil() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [etapa, setEtapa] = useState(1);
  const [nivel, setNivel] = useState(null);
  const [objetivo, setObjetivo] = useState(null);
  const [paceMin, setPaceMin] = useState("5");
  const [paceSeg, setPaceSeg] = useState("00");
  const [dataProva, setDataProva] = useState("");
  const [dias, setDias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Se já tem perfil, vai pro dashboard
  useEffect(() => {
    api.get("/perfil")
      .then(() => navigate("/dashboard"))
      .catch(() => {}); // sem perfil, fica na página
  }, []);

  const toggleDia = (dia) => {
    setDias(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const handleSalvar = async () => {
    setErro(null);
    if (!nivel || !objetivo || !dataProva || dias.length === 0) {
      setErro("Preencha todos os campos antes de continuar.");
      return;
    }

    const paceMedioSegundos = (parseInt(paceMin) * 60) + parseInt(paceSeg || 0);

    setIsLoading(true);
    try {
      await api.post("/perfil", {
        nivelExperiencia: nivel,
        objetivo,
        paceMedioSegundos,
        dataProva,
        diasDisponiveis: dias,
      });
      navigate("/dashboard");
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao salvar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const podeAvancar = () => {
    if (etapa === 1) return !!nivel;
    if (etapa === 2) return !!objetivo;
    if (etapa === 3) return dias.length > 0;
    return true;
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080C18",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "48px 24px",
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#F0F4FF", letterSpacing: "0.10em" }}>PACE</span>
        <img src="/logosemnomecopia.png" alt="X" style={{ height: 80, width: "auto", marginLeft: -10 }} />
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: 560, marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          {["Nível", "Objetivo", "Dias", "Pace & Data"].map((label, i) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 50, height: 50, borderRadius: "50%",
                background: etapa > i + 1 ? "#FF4500" : etapa === i + 1 ? "rgba(255,69,0,0.2)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${etapa >= i + 1 ? "#FF4500" : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Space Mono', monospace", fontSize: 11,
                color: etapa >= i + 1 ? "#FF4500" : "#7A869A",
              }}>
                {etapa > i + 1 ? "✓" : i + 1}
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: etapa === i + 1 ? "#FF4500" : "#7A869A", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
          <div style={{ height: "100%", background: "#FF4500", borderRadius: 2, width: `${((etapa - 1) / 3) * 100}%`, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 560,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20, padding: "40px",
      }}>

        {/* Erro */}
        {erro && (
          <div style={{ background: "rgba(255,69,0,0.1)", border: "1px solid rgba(255,69,0,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 24, color: "#FF6B2B", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
            ⚠ {erro}
            <button onClick={() => setErro(null)} style={{ background: "none", border: "none", color: "#FF6B2B", cursor: "pointer" }}>×</button>
          </div>
        )}

        {/* ── ETAPA 1: NÍVEL ── */}
        {etapa === 1 && (
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#FF4500", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 25 }}>Etapa 1 de 4</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#F0F4FF", marginBottom: 8, lineHeight: 1 }}>QUAL SEU NÍVEL?</h2>
            <p style={{ color: "#7A869A", fontSize: 14, marginBottom: 28, fontWeight: 300 }}>Isso ajuda a personalizar a intensidade do seu plano.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {NIVEIS.map(n => (
                <button key={n.valor} onClick={() => setNivel(n.valor)} style={{
                  padding: "18px 20px", borderRadius: 12, cursor: "pointer",
                  background: nivel === n.valor ? "rgba(255,69,0,0.1)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${nivel === n.valor ? "#FF4500" : "rgba(255,255,255,0.08)"}`,
                  textAlign: "left", transition: "all 0.2s",
                }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, color: nivel === n.valor ? "#FF4500" : "#F0F4FF", marginBottom: 4 }}>{n.label}</div>
                  <div style={{ fontSize: 13, color: "#7A869A", fontWeight: 300 }}>{n.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ETAPA 2: OBJETIVO ── */}
        {etapa === 2 && (
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>Etapa 2 de 4</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#F0F4FF", marginBottom: 8, lineHeight: 1 }}>QUAL SEU OBJETIVO?</h2>
            <p style={{ color: "#7A869A", fontSize: 14, marginBottom: 28, fontWeight: 300 }}>Vamos montar um plano do zero até a sua prova alvo.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {OBJETIVOS.map(o => (
                <button key={o.valor} onClick={() => setObjetivo(o.valor)} style={{
                  padding: "18px 20px", borderRadius: 12, cursor: "pointer",
                  background: objetivo === o.valor ? "rgba(255,69,0,0.1)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${objetivo === o.valor ? "#FF4500" : "rgba(255,255,255,0.08)"}`,
                  textAlign: "left", transition: "all 0.2s",
                }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: objetivo === o.valor ? "#FF4500" : "#F0F4FF", marginBottom: 4 }}>{o.label}</div>
                  <div style={{ fontSize: 13, color: "#7A869A", fontWeight: 300 }}>{o.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ETAPA 3: DIAS ── */}
        {etapa === 3 && (
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>Etapa 3 de 4</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#F0F4FF", marginBottom: 8, lineHeight: 1 }}>QUANDO VOCÊ CORRE?</h2>
            <p style={{ color: "#7A869A", fontSize: 14, marginBottom: 28, fontWeight: 300 }}>Selecione os dias da semana que você tem disponíveis.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {DIAS.map(d => (
                <button key={d.valor} onClick={() => toggleDia(d.valor)} style={{
                  width: 68, height: 68, borderRadius: 12, cursor: "pointer",
                  background: dias.includes(d.valor) ? "rgba(255,69,0,0.15)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${dias.includes(d.valor) ? "#FF4500" : "rgba(255,255,255,0.08)"}`,
                  color: dias.includes(d.valor) ? "#FF4500" : "#7A869A",
                  fontFamily: "'Space Mono', monospace", fontSize: 12,
                  fontWeight: dias.includes(d.valor) ? 700 : 400,
                  transition: "all 0.2s",
                }}>{d.label}</button>
              ))}
            </div>
            {dias.length > 0 && (
              <p style={{ color: "#7A869A", fontSize: 13, marginTop: 16 }}>
                {dias.length} dia{dias.length > 1 ? "s" : ""} selecionado{dias.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        {/* ── ETAPA 4: PACE & DATA ── */}
        {etapa === 4 && (
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>Etapa 4 de 4</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#F0F4FF", marginBottom: 8, lineHeight: 1 }}>PACE E DATA</h2>
            <p style={{ color: "#7A869A", fontSize: 14, marginBottom: 28, fontWeight: 300 }}>Seu pace médio atual e a data da sua prova alvo.</p>

            {/* Pace */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#7A869A", marginBottom: 12 }}>Pace médio atual (min/km)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <input type="number" min="3" max="15" value={paceMin} onChange={e => setPaceMin(e.target.value)} placeholder="5"
                    style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#F0F4FF", fontSize: 20, fontFamily: "'Bebas Neue', sans-serif", outline: "none", textAlign: "center", caretColor: "#FF4500" }}
                    onFocus={e => e.target.style.borderColor = "#FF4500"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                  <div style={{ textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#7A869A", marginTop: 6 }}>minutos</div>
                </div>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#FF4500" }}>:</span>
                <div style={{ flex: 1 }}>
                  <input type="number" min="0" max="59" value={paceSeg} onChange={e => setPaceSeg(e.target.value.padStart(2, "0"))} placeholder="00"
                    style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#F0F4FF", fontSize: 20, fontFamily: "'Bebas Neue', sans-serif", outline: "none", textAlign: "center", caretColor: "#FF4500" }}
                    onFocus={e => e.target.style.borderColor = "#FF4500"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                  <div style={{ textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#7A869A", marginTop: 6 }}>segundos</div>
                </div>
              </div>
            </div>

            {/* Data da prova */}
            <div>
              <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#7A869A", marginBottom: 12 }}>Data da prova alvo</label>
              <input type="date" value={dataProva} onChange={e => setDataProva(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#F0F4FF", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", caretColor: "#FF4500", colorScheme: "dark" }}
                onFocus={e => e.target.style.borderColor = "#FF4500"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>
          </div>
        )}

        {/* Botões de navegação */}
        <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
          {etapa > 1 && (
            <button onClick={() => setEtapa(e => e - 1)} style={{
              flex: 1, padding: "14px", background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              color: "#7A869A", fontFamily: "'DM Sans', sans-serif",
              fontSize: 15, cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            >← Voltar</button>
          )}

          {etapa < 4 ? (
            <button onClick={() => podeAvancar() && setEtapa(e => e + 1)} style={{
              flex: 2, padding: "14px",
              background: podeAvancar() ? "#FF4500" : "rgba(255,255,255,0.05)",
              border: "none", borderRadius: 10,
              color: podeAvancar() ? "#fff" : "#7A869A",
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.1em",
              cursor: podeAvancar() ? "pointer" : "not-allowed",
              boxShadow: podeAvancar() ? "0 4px 24px rgba(255,69,0,0.35)" : "none",
              transition: "all 0.2s",
            }}>Continuar →</button>
          ) : (
            <button onClick={handleSalvar} disabled={isLoading || !dataProva} style={{
              flex: 2, padding: "14px",
              background: !dataProva || isLoading ? "rgba(255,255,255,0.05)" : "#FF4500",
              border: "none", borderRadius: 10,
              color: !dataProva || isLoading ? "#7A869A" : "#fff",
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.1em",
              cursor: !dataProva || isLoading ? "not-allowed" : "pointer",
              boxShadow: !dataProva || isLoading ? "none" : "0 4px 24px rgba(255,69,0,0.35)",
              transition: "all 0.2s",
            }}>
              {isLoading ? "Salvando..." : "Criar Meu Plano 🚀"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        input::placeholder { color: rgba(122,134,154,0.5); }
      `}</style>
    </div>
  );
}
