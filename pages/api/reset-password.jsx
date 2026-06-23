import React, { useState, useEffect } from "react";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  async function handleReset() {
    setError("");
    if (!password || !confirm) { setError("Completa todos los campos."); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden."); return; }
    if (password.length < 6) { setError("Mínimo 6 caracteres."); return; }
    if (!token) { setError("Enlace inválido. Solicita uno nuevo."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
      } else {
        setError(data.error || "Error al restablecer.");
      }
    } catch (e) {
      setError("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#FDFAF5", fontFamily:"'Outfit',sans-serif", padding:"2rem" }}>
      <div style={{ maxWidth:"420px", width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:700, color:"#C8A46B", letterSpacing:"0.1em" }}>✦ LuMane</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", fontWeight:700, color:"#1A1A1A", marginTop:"0.5rem" }}>
            {done ? "¡Contraseña actualizada!" : "Nueva contraseña"}
          </h1>
          <p style={{ color:"#6E6E6E", fontSize:"0.85rem", marginTop:"0.4rem" }}>
            {done ? "Ya puedes iniciar sesión con tu nueva contraseña." : "Elige una contraseña segura para tu cuenta LuMane."}
          </p>
        </div>

        <div style={{ background:"#fff", borderRadius:"1.5rem", padding:"2rem", border:"1.5px solid #DDD4C8", boxShadow:"0 8px 32px rgba(200,164,107,.1)" }}>
          {done ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🎉</div>
              <p style={{ color:"#6E6E6E", marginBottom:"1.5rem", lineHeight:1.6 }}>Tu contraseña ha sido actualizada correctamente.</p>
              <a href="/" style={{ display:"block", background:"#1A1A1A", color:"#C8A46B", border:"1.5px solid #C8A46B", padding:"1rem", borderRadius:"3rem", textDecoration:"none", fontWeight:700, textAlign:"center", fontSize:"0.95rem" }}>
                Ir a LuMane →
              </a>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background:"rgba(200,50,50,.08)", border:"1px solid rgba(200,50,50,.25)", borderRadius:"0.75rem", padding:"0.8rem", fontSize:"0.82rem", color:"#AA3333", marginBottom:"1.2rem", textAlign:"center" }}>
                  {error}
                </div>
              )}
              <div style={{ marginBottom:"1rem" }}>
                <label style={{ fontSize:"0.65rem", fontWeight:700, color:"#6E6E6E", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"0.4rem" }}>Nueva contraseña *</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1.5px solid #DDD4C8", fontFamily:"'Outfit',sans-serif", fontSize:15, color:"#1A1A1A", outline:"none", background:"#FDFAF5", boxSizing:"border-box" }}
                />
              </div>
              <div style={{ marginBottom:"1.5rem" }}>
                <label style={{ fontSize:"0.65rem", fontWeight:700, color:"#6E6E6E", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"0.4rem" }}>Confirmar contraseña *</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleReset()}
                  placeholder="Repite tu contraseña"
                  style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1.5px solid #DDD4C8", fontFamily:"'Outfit',sans-serif", fontSize:15, color:"#1A1A1A", outline:"none", background:"#FDFAF5", boxSizing:"border-box" }}
                />
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                style={{ width:"100%", background: loading ? "#DDD4C8" : "#1A1A1A", color:"#C8A46B", border:"1.5px solid #C8A46B", padding:"1rem", borderRadius:"3rem", fontSize:"1rem", fontWeight:700, cursor: loading ? "not-allowed" : "pointer", fontFamily:"'Outfit',sans-serif" }}
              >
                {loading ? "Actualizando…" : "Guardar nueva contraseña →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
