import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const FEATURES = [
  { icon: "⚡", title: "Treinos Personalizados", desc: "Planos gerados com IA com base no seu ritmo, histórico e objetivo. Cada semana diferente da anterior." },
  { icon: "📍", title: "GPS Inteligente", desc: "Rastreamento em tempo real com análise de elevação, cadência e variação de pace por segmento." },
  { icon: "🫀", title: "Zonas de Frequência", desc: "Monitore suas zonas cardíacas para treinar no limite certo — sem exagerar, sem desperdiçar." },
  { icon: "🏆", title: "Desafios e Rankings", desc: "Compita com amigos e atletas do mundo todo. Suba no ranking e conquiste medalhas semanais." },
  { icon: "📈", title: "Evolução Visual", desc: "Dashboard completo com gráficos de volume, pace médio, VO₂ estimado e progressão de PR." },
  { icon: "🔔", title: "Coach no Ouvido", desc: "Instruções de áudio em tempo real: pace, distância, intervalo — sem tirar os olhos da pista." },
];

const STATS = [
  { num: "30+", label: "Atletas ativos" },
  { num: "+100K", label: "KM percorridos" },
  { num: "4.5★", label: "Avaliação média" },
  { num: "98%", label: "Taxa de conclusão" },
];

function FeatureCard({ feature }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: hovered ? "rgba(255,69,0,0.06)" : "rgba(255,255,255,0.025)",
      border: `1px solid ${hovered ? "rgba(255,69,0,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 16, padding: "32px 28px",
      transition: "all 0.25s ease",
      transform: hovered ? "translateY(-4px)" : "none",
      cursor: "default",
    }}>
      <div style={{ fontSize: 32, marginBottom: 20 }}>{feature.icon}</div>
      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 17, color: "#F0F4FF", marginBottom: 10 }}>{feature.title}</h3>
      <p style={{ color: "#7A869A", fontSize: 14, lineHeight: 1.7, fontWeight: 300 }}>{feature.desc}</p>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 80);
    return () => clearInterval(t);
  }, []);

  const bars = [0.4, 0.65, 0.5, 0.8, 0.6, 0.9, 0.7, 0.55, 0.85, 0.75];
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#080C18", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Navbar só aparece na Home */}
      <Navbar />

      {/* ── HERO ── */}
      <section id="hero" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 48px 80px", position: "relative", overflow: "hidden",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,69,0,0.12) 0%, transparent 65%), #080C18",
      }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
        }} />

        {/* Pace badge */}
        <div style={{
          position: "absolute", top: 140, right: 80,
          background: "rgba(255,69,0,0.08)", border: "1px solid rgba(255,69,0,0.25)",
          borderRadius: 12, padding: "14px 20px",
          animation: "float 3s ease-in-out infinite",
        }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,69,0,0.8)", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: 4 }}>Pace atual</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#FF4500", lineHeight: 1, display: "block", marginBottom: 8 }}>4'38"/km</span>
          <div style={{ display: "flex", gap: 3 }}>
            {bars.map((h, i) => (
              <div key={i} style={{ width: 4, borderRadius: 2, background: i === (tick % bars.length) ? "#FF4500" : "rgba(255,69,0,0.3)", height: `${h * 28}px`, transition: "background 0.08s" }} />
            ))}
          </div>
        </div>

        {/* KM badge */}
        <div style={{
          position: "absolute", top: 200, left: 80,
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "14px 20px",
          animation: "float 4s ease-in-out infinite 1s",
        }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A869A", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>Semana</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#F0F4FF" }}>42.3</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#7A869A" }}>km</span>
          </div>
          <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
            <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg, #FF4500, #FF6B2B)", borderRadius: 2 }} />
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, background: "rgba(255,69,0,0.08)", border: "1px solid rgba(255,69,0,0.2)", borderRadius: 100, padding: "6px 18px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF4500", animation: "pulse 1.5s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", letterSpacing: "0.15em", textTransform: "uppercase" }}>Agora com Coach de IA</span>
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(72px, 10vw, 128px)", lineHeight: 0.9, letterSpacing: "0.02em", color: "#F0F4FF", marginBottom: 32 }}>
            CORRA COM<br />
            <span style={{ color: "#FF4500", textShadow: "0 0 60px rgba(255,69,0,0.4)" }}>PROPÓSITO</span>
          </h1>

          <p style={{ fontSize: 18, color: "#7A869A", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px", fontWeight: 300 }}>
            Treinos personalizados por IA, análise em tempo real e evolução garantida. Do seu primeiro 5K à maratona dos sonhos.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/login")} style={{
              padding: "16px 40px", background: "#FF4500", color: "#fff", border: "none",
              borderRadius: 10, fontFamily: "'Bebas Neue', sans-serif", fontSize: 20,
              letterSpacing: "0.12em", cursor: "pointer",
              boxShadow: "0 8px 40px rgba(255,69,0,0.45)", transition: "transform 0.15s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(255,69,0,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 40px rgba(255,69,0,0.45)"; }}
            >Começar Grátis</button>

            <button onClick={() => scrollTo("recursos")} style={{
              padding: "16px 40px", background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
              color: "#F0F4FF", fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              fontWeight: 500, cursor: "pointer", transition: "border-color 0.2s, background 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "transparent"; }}
            >Ver Recursos →</button>
          </div>

          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 72, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#F0F4FF", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A869A", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECURSOS ── */}
      <section id="recursos" style={{ padding: "100px 48px", background: "#0E1425" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", textTransform: "uppercase", letterSpacing: "0.2em" }}>Recursos</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, color: "#F0F4FF", marginTop: 12, lineHeight: 1 }}>TUDO QUE VOCÊ PRECISA</h2>
            <p style={{ color: "#7A869A", fontSize: 16, marginTop: 16, fontWeight: 300 }}>Do iniciante ao atleta de elite, o PaceX tem o recurso certo pra cada fase.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} />)}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#080C18", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 48px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12 }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#F0F4FF", letterSpacing: "0.08em" }}>PACE</span>
                <img src="/logosemnomecopia.png" alt="X" style={{ height: 28, width: "auto", marginLeft: -4 }} />
              </div>
              <p style={{ color: "#7A869A", fontSize: 13, lineHeight: 1.7, maxWidth: 240, fontWeight: 300 }}>O app de corrida que evolui junto com você. Seu objetivo, seu ritmo, seu plano.</p>
            </div>
            {[
              { title: "Produto", links: ["Recursos", "Planos"] },
              { title: "Empresa", links: ["Sobre nós"] },
              { title: "Suporte", links: [] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ color: "#7A869A", fontSize: 13, textDecoration: "none" }}>{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "#7A869A", fontSize: 12 }}>© 2025 PaceX. Todos os direitos reservados.</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,69,0,0.6)" }}>CORRA COM PROPÓSITO</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}
