import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleCadastro = async () => {
  setErro(null);

  if (!nome || !email || !senha || !confirmarSenha) {
    setErro("Preencha todos os campos.");
    return;
  }
  if (senha.length < 6) {
    setErro("A senha deve ter no mínimo 6 caracteres.");
    return;
  }
  if (senha !== confirmarSenha) {
    setErro("As senhas não coincidem.");
    return;
  }

  setIsLoading(true);
  try {
    const result = await register(nome, email, senha);
    navigate(result.temPerfil ? "/dashboard" : "/perfil-setup");
  } catch (err) {
    setErro(err.response?.data?.message || "Erro ao criar conta. Tente novamente.");
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCadastro();
  };

  const inputStyle = {
  width: "100%", padding: "14px 14px 14px 42px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, color: "#F0F4FF", fontSize: 14,
  fontFamily: "'DM Sans', sans-serif", outline: "none",
  caretColor: "#FF4500", transition: "border-color 0.2s",
  WebkitBoxShadow: "0 0 0px 1000px #080C18 inset", 
  WebkitTextFillColor: "#F0F4FF",                     
};

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "#080C18", fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── LADO ESQUERDO ── */}
      <div style={{
        flex: "0 0 46%", position: "relative",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "56px 52px", overflow: "hidden",
        background: "radial-gradient(ellipse 80% 70% at 60% 90%, rgba(255,69,0,0.2) 0%, transparent 65%), linear-gradient(160deg, #0D1525 0%, #080C18 100%)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4500", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 1, background: "#FF4500" }} />
            Comece agora
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(64px, 6vw, 88px)", color: "#F0F4FF", lineHeight: 0.9, marginBottom: 24 }}>
            SEU PRIMEIRO<br />PASSO<br />COMEÇA <span style={{ color: "#FF4500" }}>AQUI</span>
          </h2>
          <p style={{ color: "#7A869A", fontSize: 14, lineHeight: 1.8, maxWidth: 300, fontWeight: 300 }}>
            Crie sua conta gratuita e receba um plano de treino personalizado em segundos.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {["Plano gerado por IA", "GPS e análise em tempo real", "Histórico completo de treinos"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,69,0,0.15)", border: "1px solid rgba(255,69,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 3.5-4" stroke="#FF4500" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ color: "#A8B3C5", fontSize: 13 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LADO DIREITO ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Logo */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8, justifyContent: "center" }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: "#F0F4FF", letterSpacing: "0.08em", lineHeight: 1 }}>PACE</span>
              <img src="/logosemnomecopia.png" alt="X" style={{ height: 70, width: "auto", marginLeft: -8 }} />
            </div>
            <p style={{ color: "#7A869A", fontSize: 14, textAlign: "center" }}>Crie sua conta gratuita</p>
          </div>

          {/* Erro */}
          {erro && (
            <div style={{ background: "rgba(255,69,0,0.1)", border: "1px solid rgba(255,69,0,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#FF6B2B", fontSize: 13 }}>
              ⚠ {erro}
            </div>
          )}

          {/* Nome */}
          <div style={{ marginBottom: 14, }}>
            <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgb(219, 223, 230)", marginBottom: 8 }}>Nome completo</label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "rgb(219, 223, 230)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} onKeyDown={handleKeyDown} placeholder="Seu Nome" 
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#FF4500"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgb(219, 223, 230)", marginBottom: 8 }}>Email</label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#7A869A" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} placeholder="bruno@email.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#FF4500"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>
          </div>

          {/* Senha */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgb(219, 223, 230)", marginBottom: 8 }}>Senha</label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#7A869A" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input type={showPw ? "text" : "password"} value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={handleKeyDown} placeholder="Mínimo 6 caracteres"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => e.target.style.borderColor = "#FF4500"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
              <button onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7A869A", padding: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {showPw
                    ? <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    : <><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgb(219, 223, 230)", marginBottom: 8 }}>Confirmar senha</label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "rgb(219, 223, 230)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input type={showPw ? "text" : "password"} value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} onKeyDown={handleKeyDown} placeholder="Repita a senha"
                style={{
                  ...inputStyle,
                  borderColor: confirmarSenha && senha !== confirmarSenha ? "rgba(255,69,0,0.5)" : "rgba(255,255,255,0.08)",
                }}
                onFocus={e => e.target.style.borderColor = "#FF4500"}
                onBlur={e => e.target.style.borderColor = confirmarSenha && senha !== confirmarSenha ? "rgba(255,69,0,0.5)" : "rgba(255,255,255,0.08)"}
              />
            </div>
            {confirmarSenha && senha !== confirmarSenha && (
              <div style={{ fontSize: 12, color: "#FF4500", marginTop: 6, fontFamily: "'Space Mono', monospace" }}>As senhas não coincidem</div>
            )}
          </div>

          {/* Botão cadastrar */}
          <button onClick={handleCadastro} disabled={isLoading} style={{
            width: "90%", padding: "16px", textAlign: "center", display: "block", margin: "0 auto",
            background: isLoading ? "rgba(255,69,0,0.5)" : "#FF4500",
            border: "none", borderRadius: 10,
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: "0.15em",
            color: "#fff", cursor: isLoading ? "wait" : "pointer",
            boxShadow: "0 8px 32px rgba(255,69,0,0.4)", transition: "all 0.2s",
          }}>
            {isLoading ? "Criando conta..." : "Criar Conta Grátis"}
          </button>

          <p style={{ textAlign: "center", color: "#7A869A", fontSize: 13, marginTop: 24 }}>
            Já tem uma conta?{" "}
            <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "#FF4500", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Fazer login</button>
          </p>

          <p style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#7A869A", fontSize: 13, textDecoration: "underline" }}>← Voltar ao site</button>
          </p>
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgba(122,134,154,0.5); }
      `}</style>
    </div>
  );
}
