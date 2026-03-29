import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = location.pathname === "/login";

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const scrollTo = (id) => {
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 48px", height: 72,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled || isLogin ? "rgba(8,12,24,0.95)" : "transparent",
      backdropFilter: scrolled || isLogin ? "blur(20px)" : "none",
      borderBottom: scrolled || isLogin ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      transition: "all 0.35s ease",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Logo - só aparece fora do login */}
      {!isLogin && (
        <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: "0.08em", color: "#F0F4FF" }}>PACE</span>
          <img src="/logosemnomecopia.png" alt="X" style={{ height: 36, width: "auto", marginLeft: -4 }} />
        </div>
      )}

      {/* Links - só aparecem fora do login */}
      {!isLogin && (
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {[ ].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
              color: "rgba(160,175,200,0.85)",
              letterSpacing: "0.01em",
              transition: "color 0.2s",
              padding: "6px 0",
              borderBottom: "1px solid transparent",
            }}
              onMouseEnter={e => e.target.style.color = "#F0F4FF"}
              onMouseLeave={e => e.target.style.color = "rgba(160,175,200,0.85)"}
            >{label}</button>
          ))}

          

          <button onClick={() => navigate("/login")} style={{
            background: "#FF4500", color: "#fff", border: "none",
            padding: "10px 24px", borderRadius: 8,
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: "0.12em",
            cursor: "pointer",
            boxShadow: "0 4px 24px rgba(255,69,0,0.4)",
            transition: "transform 0.15s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,69,0,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(255,69,0,0.4)"; }}
          >Entrar</button>
        </div>
      )}
    </nav>
  );
}
