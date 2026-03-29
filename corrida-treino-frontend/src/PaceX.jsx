import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Recursos", "Planos", "Depoimentos", "Login"];

const FEATURES = [
  {
    icon: "⚡",
    title: "Treinos Personalizados",
    desc: "Planos gerados com IA com base no seu ritmo, histórico e objetivo. Cada semana diferente da anterior.",
  },
  {
    icon: "📍",
    title: "GPS Inteligente",
    desc: "Rastreamento em tempo real com análise de elevação, cadência e variação de pace por segmento.",
  },
  {
    icon: "🫀",
    title: "Zonas de Frequência",
    desc: "Monitore suas zonas cardíacas para treinar no limite certo — sem exagerar, sem desperdiçar.",
  },
  {
    icon: "🏆",
    title: "Desafios e Rankings",
    desc: "Compita com amigos e atletas do mundo todo. Suba no ranking e conquiste medalhas semanais.",
  },
  {
    icon: "📈",
    title: "Evolução Visual",
    desc: "Dashboard completo com gráficos de volume, pace médio, VO₂ estimado e progressão de PR.",
  },
  {
    icon: "🔔",
    title: "Coach no Ouvido",
    desc: "Instruções de áudio em tempo real: pace, distância, intervalo — sem tirar os olhos da pista.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "Grátis",
    sub: "Para quem está começando",
    features: ["Até 3 treinos/mês", "GPS básico", "Histórico 30 dias", "App iOS e Android"],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Runner",
    price: "R$ 29",
    sub: "por mês",
    features: ["Treinos ilimitados", "GPS avançado + elevação", "Histórico completo", "Zonas cardíacas", "Planos de 5K a maratona", "Suporte prioritário"],
    cta: "Assinar agora",
    highlight: true,
  },
  {
    name: "Elite",
    price: "R$ 59",
    sub: "por mês",
    features: ["Tudo do Runner", "Coach de IA em tempo real", "Análise biomecânica", "Integração com coach humano", "Relatórios PDF mensais", "Acesso antecipado a recursos"],
    cta: "Virar Elite",
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Camila Torres",
    role: "Maratonista amadora",
    avatar: "CT",
    text: "Baixei achando que era mais um app de corrida. Três meses depois bati meu PR na São Silvestre. O plano personalizado fez toda a diferença.",
    pace: "4'42\"/km",
  },
  {
    name: "Rafael Mendes",
    role: "Triatleta iniciante",
    avatar: "RM",
    text: "Nunca tinha corrido 10km na vida. Em 8 semanas completei minha primeira corrida de rua. O coach de áudio é incrível.",
    pace: "5'55\"/km",
  },
  {
    name: "Juliana Pak",
    role: "Corredora de trilha",
    avatar: "JP",
    text: "A análise de elevação e a cadência em tempo real mudaram como eu encaro as subidas. Recomendo pra qualquer level.",
    pace: "6'10\"/km",
  },
];

const STATS = [
  { num: "48K+", label: "Atletas ativos" },
  { num: "2M+", label: "KM percorridos" },
  { num: "4.9★", label: "Avaliação média" },
  { num: "98%", label: "Taxa de conclusão" },
];

/* ───── sub-components ───── */

function Navbar({ activeSection, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 48px",
      height: 72,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(8,12,24,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      transition: "all 0.35s ease",
    }}>
      <div onClick={() => onNav("hero")} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 2 }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: "0.08em", color: "#F0F4FF" }}>PACE</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: "#FF4500" }}>X</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {NAV_LINKS.map((link) => (
          <button key={link} onClick={() => onNav(link.toLowerCase())}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
              color: activeSection === link.toLowerCase() ? "#FF4500" : "rgba(160,175,200,0.85)",
              letterSpacing: "0.01em",
              transition: "color 0.2s",
              padding: "6px 0",
              borderBottom: activeSection === link.toLowerCase() ? "1px solid #FF4500" : "1px solid transparent",
            }}>{link}</button>
        ))}
        <button onClick={() => onNav("login")} style={{
          background: "#FF4500", color: "#fff", border: "none",
          padding: "10px 24px", borderRadius: 8,
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: "0.12em",
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(255,69,0,0.4)",
          transition: "transform 0.15s, box-shadow 0.2s",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(255,69,0,0.55)"; }}
          onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 4px 24px rgba(255,69,0,0.4)"; }}
        >Entrar</button>
      </div>
    </nav>
  );
}

function HeroSection({ onNav }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 80);
    return () => clearInterval(t);
  }, []);

  const bars = [0.4, 0.65, 0.5, 0.8, 0.6, 0.9, 0.7, 0.55, 0.85, 0.75];

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "120px 48px 80px",
      position: "relative", overflow: "hidden",
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,69,0,0.12) 0%, transparent 65%), #080C18",
    }}>
      {/* Animated grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
      }} />

      {/* Floating pace badge */}
      <div style={{
        position: "absolute", top: 140, right: 80,
        background: "rgba(255,69,0,0.08)", border: "1px solid rgba(255,69,0,0.25)",
        borderRadius: 12, padding: "14px 20px",
        display: "flex", flexDirection: "column", gap: 4,
        animation: "float 3s ease-in-out infinite",
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,69,0,0.8)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Pace atual</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#FF4500", lineHeight: 1 }}>4'38"/km</span>
        <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              width: 4, borderRadius: 2,
              background: i === (tick % bars.length) ? "#FF4500" : "rgba(255,69,0,0.3)",
              height: `${h * 28}px`,
              transition: "background 0.08s",
            }} />
          ))}
        </div>
      </div>

      {/* Floating km badge */}
      <div style={{
        position: "absolute", top: 200, left: 80,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: "14px 20px",
        animation: "float 4s ease-in-out infinite 1s",
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A869A", textTransform: "uppercase", letterSpacing: "0.1em" }}>Semana</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#F0F4FF" }}>42.3</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#7A869A" }}>km</span>
        </div>
        <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginTop: 8 }}>
          <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg, #FF4500, #FF6B2B)", borderRadius: 2 }} />
        </div>
      </div>

      {/* Main headline */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, background: "rgba(255,69,0,0.08)", border: "1px solid rgba(255,69,0,0.2)", borderRadius: 100, padding: "6px 18px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF4500", animation: "pulse 1.5s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", letterSpacing: "0.15em", textTransform: "uppercase" }}>Agora com Coach de IA</span>
        </div>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(72px, 10vw, 128px)",
          lineHeight: 0.9, letterSpacing: "0.02em",
          color: "#F0F4FF", marginBottom: 32,
        }}>
          CORRA COM<br />
          <span style={{ color: "#FF4500", WebkitTextStroke: "0px", textShadow: "0 0 60px rgba(255,69,0,0.4)" }}>PROPÓSITO</span>
        </h1>

        <p style={{ fontSize: 18, color: "#7A869A", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px", fontWeight: 300 }}>
          Treinos personalizados por IA, análise em tempo real e evolução garantida. Do seu primeiro 5K à maratona dos sonhos.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => onNav("login")} style={{
            padding: "16px 40px", background: "#FF4500", color: "#fff", border: "none",
            borderRadius: 10, fontFamily: "'Bebas Neue', sans-serif", fontSize: 20,
            letterSpacing: "0.12em", cursor: "pointer",
            boxShadow: "0 8px 40px rgba(255,69,0,0.45)",
            transition: "transform 0.15s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(255,69,0,0.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 40px rgba(255,69,0,0.45)"; }}
          >Começar Grátis</button>

          <button onClick={() => onNav("recursos")} style={{
            padding: "16px 40px", background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
            color: "#F0F4FF", fontFamily: "'DM Sans', sans-serif", fontSize: 15,
            fontWeight: 500, cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "transparent"; }}
          >Ver Recursos →</button>
        </div>

        {/* Stats */}
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
  );
}

function FeaturesSection() {
  return (
    <section id="recursos" style={{ padding: "100px 48px", background: "#0E1425" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", textTransform: "uppercase", letterSpacing: "0.2em" }}>Recursos</span>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, color: "#F0F4FF", marginTop: 12, lineHeight: 1 }}>TUDO QUE VOCÊ PRECISA</h2>
          <p style={{ color: "#7A869A", fontSize: 16, marginTop: 16, fontWeight: 300 }}>Do iniciante ao atleta de elite, o PaceX tem o recurso certo pra cada fase.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
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

function PlansSection() {
  return (
    <section id="planos" style={{ padding: "100px 48px", background: "#080C18" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", textTransform: "uppercase", letterSpacing: "0.2em" }}>Planos</span>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, color: "#F0F4FF", marginTop: 12, lineHeight: 1 }}>ESCOLHA SEU RITMO</h2>
          <p style={{ color: "#7A869A", fontSize: 16, marginTop: 16, fontWeight: 300 }}>Sem fidelidade. Cancele quando quiser.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {PLANS.map((plan, i) => (
            <PlanCard key={i} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: plan.highlight ? "rgba(255,69,0,0.08)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${plan.highlight ? "#FF4500" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, padding: "36px 28px",
        position: "relative", overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-4px)" : plan.highlight ? "translateY(-8px)" : "none",
        boxShadow: plan.highlight ? "0 20px 60px rgba(255,69,0,0.2)" : "none",
      }}>
      {plan.highlight && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: "#FF4500", color: "#fff",
          fontFamily: "'Space Mono', monospace", fontSize: 10,
          padding: "4px 12px", borderRadius: 100,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>Popular</div>
      )}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A869A", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>{plan.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: "#F0F4FF", lineHeight: 1 }}>{plan.price}</span>
          {plan.sub !== "Para quem está começando" && <span style={{ color: "#7A869A", fontSize: 13 }}>{plan.sub}</span>}
        </div>
        {plan.sub === "Para quem está começando" && <div style={{ color: "#7A869A", fontSize: 13, marginTop: 4 }}>{plan.sub}</div>}
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, marginBottom: 32 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: plan.highlight ? "#FF4500" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 3.5-4" stroke={plan.highlight ? "#fff" : "#7A869A"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ color: "#A8B3C5", fontSize: 14 }}>{f}</span>
          </div>
        ))}
      </div>

      <button style={{
        width: "100%", padding: "14px",
        background: plan.highlight ? "#FF4500" : "transparent",
        border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.15)",
        borderRadius: 10, color: "#F0F4FF",
        fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.1em",
        cursor: "pointer",
        boxShadow: plan.highlight ? "0 6px 30px rgba(255,69,0,0.4)" : "none",
        transition: "all 0.2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
      >{plan.cta}</button>
    </div>
  );
}

function TestimonialsSection() {
  return (
    <section id="depoimentos" style={{ padding: "100px 48px", background: "#0E1425" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", textTransform: "uppercase", letterSpacing: "0.2em" }}>Depoimentos</span>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, color: "#F0F4FF", marginTop: 12, lineHeight: 1 }}>QUEM JÁ CORRE COM A GENTE</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16, padding: "32px 28px",
        transition: "all 0.25s", transform: hovered ? "translateY(-4px)" : "none",
      }}>
      <div style={{ color: "#FF4500", fontSize: 28, marginBottom: 16, letterSpacing: -2 }}>❝</div>
      <p style={{ color: "#A8B3C5", fontSize: 15, lineHeight: 1.75, fontWeight: 300, marginBottom: 28 }}>{t.text}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "rgba(255,69,0,0.15)", border: "1px solid rgba(255,69,0,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", fontWeight: 700,
          }}>{t.avatar}</div>
          <div>
            <div style={{ color: "#F0F4FF", fontSize: 14, fontWeight: 600 }}>{t.name}</div>
            <div style={{ color: "#7A869A", fontSize: 12 }}>{t.role}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#FF4500" }}>{t.pace}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#7A869A" }}>pace médio</div>
        </div>
      </div>
    </div>
  );
}

function LoginSection() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1800);
  };

  return (
    <section id="login" style={{
      minHeight: "100vh", display: "flex",
      background: "#080C18",
    }}>
      {/* Left */}
      <div style={{
        flex: "0 0 46%", position: "relative",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "56px 52px", overflow: "hidden",
        background: "radial-gradient(ellipse 80% 70% at 60% 90%, rgba(255,69,0,0.2) 0%, transparent 65%), linear-gradient(160deg, #0D1525 0%, #080C18 100%)",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 1, background: "#FF4500" }} /> Acesso ao treino
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 80, color: "#F0F4FF", lineHeight: 0.9, marginBottom: 24 }}>
            BEM-<br />VINDO<br />DE <span style={{ color: "#FF4500" }}>VOLTA</span>
          </h2>
          <p style={{ color: "#7A869A", fontSize: 14, lineHeight: 1.8, maxWidth: 300, fontWeight: 300 }}>Seu próximo treino está esperando. Entre e continue sua evolução de onde parou.</p>
          <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[["48K", "Atletas"], ["2M+", "KM"], ["4.9★", "Nota"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#F0F4FF" }}>{n}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#7A869A", textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: "#F0F4FF", letterSpacing: "0.08em" }}>PACE</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: "#FF4500" }}>X</span>
            </div>
            <p style={{ color: "#7A869A", fontSize: 14 }}>Acesse seu treino personalizado</p>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#7A869A", marginBottom: 8 }}>Email</label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#7A869A" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="bruno@email.com"
                style={{
                  width: "100%", padding: "14px 14px 14px 42px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, color: "#F0F4FF", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", outline: "none",
                  caretColor: "#FF4500", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#FF4500"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#7A869A", marginBottom: 8 }}>Senha</label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#7A869A" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••"
                style={{
                  width: "100%", padding: "14px 44px 14px 42px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, color: "#F0F4FF", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", outline: "none",
                  caretColor: "#FF4500", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#FF4500"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
              <button onClick={() => setShowPw(p => !p)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#7A869A", padding: 4,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {showPw
                    ? <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    : <><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                  }
                </svg>
              </button>
            </div>
          </div>
          <div style={{ textAlign: "right", marginBottom: 28 }}>
            <a href="#" style={{ fontSize: 12, color: "#7A869A", textDecoration: "none" }}>Esqueceu a senha?</a>
          </div>

          <button onClick={handleLogin} style={{
            width: "100%", padding: "16px",
            background: isLoading ? "rgba(255,69,0,0.5)" : "#FF4500",
            border: "none", borderRadius: 10,
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.15em",
            color: "#fff", cursor: isLoading ? "wait" : "pointer",
            boxShadow: "0 8px 32px rgba(255,69,0,0.4)",
            transition: "all 0.2s",
          }}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0", color: "#7A869A" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>ou</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Google", icon: <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
              { label: "Apple", icon: <svg width="16" height="16" viewBox="0 0 814 1000" fill="#F0F4FF"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.6 56 282.1 56 282.1c0-151.3 99.5-230.9 197.1-230.9 54.3 0 99.5 35.5 133.2 35.5 32.2 0 82.9-37.8 147.2-37.8 18.7 0 108.2 1.9 164.6 78.7z"/></svg> },
            ].map(btn => (
              <button key={btn.label} style={{
                padding: "13px", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
                color: "#F0F4FF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>

          <p style={{ textAlign: "center", color: "#7A869A", fontSize: 13 }}>
            Ainda não tem conta?{" "}
            <a href="#" style={{ color: "#FF4500", fontWeight: 600, textDecoration: "none" }}>Crie grátis agora</a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#080C18", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 48px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#F0F4FF", letterSpacing: "0.08em" }}>PACE</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#FF4500" }}>X</span>
            </div>
            <p style={{ color: "#7A869A", fontSize: 13, lineHeight: 1.7, maxWidth: 240, fontWeight: 300 }}>O app de corrida que evolui junto com você. Seu objetivo, seu ritmo, seu plano.</p>
          </div>
          {[
            { title: "Produto", links: ["Recursos", "Planos", "App iOS", "App Android"] },
            { title: "Empresa", links: ["Sobre nós", "Blog", "Carreiras", "Imprensa"] },
            { title: "Suporte", links: ["Central de ajuda", "Contato", "Status", "Termos"] },
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
  );
}

/* ───── MAIN APP ───── */
export default function App() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: #080C18; overflow-x: hidden; }
      input::placeholder { color: rgba(122,134,154,0.5); }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #080C18; }
      ::-webkit-scrollbar-thumb { background: rgba(255,69,0,0.3); border-radius: 2px; }
    `;
    document.head.appendChild(style);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.4 });

    ["hero", "recursos", "planos", "depoimentos", "login"].forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#080C18", minHeight: "100vh" }}>
      <Navbar activeSection={activeSection} onNav={scrollTo} />
      <HeroSection onNav={scrollTo} />
      <FeaturesSection />
      <PlansSection />
      <TestimonialsSection />
      <LoginSection />
      <Footer />
    </div>
  );
}
