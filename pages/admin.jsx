import React, { useState } from "react";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  async function login() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) {
        setError("Contraseña incorrecta.");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setAuthed(true);
    } catch (e) {
      setError("Error de conexión.");
    }
    setLoading(false);
  }

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/admin-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FDF4F5", fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: "1.5rem", padding: "2.5rem", maxWidth: "380px", width: "90%", boxShadow: "0 8px 32px rgba(196,104,122,.15)" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✦</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 700, color: "#2A1018" }}>Panel LuMane</h1>
            <p style={{ fontSize: "0.8rem", color: "#999" }}>Acceso de administradora</p>
          </div>
          {error && <div style={{ background: "rgba(200,50,50,.08)", color: "#AA3333", padding: "0.7rem", borderRadius: "0.6rem", fontSize: "0.82rem", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Contraseña de administradora"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid rgba(196,104,122,.3)", marginBottom: "1rem", fontSize: 15, outline: "none", boxSizing: "border-box" }}
          />
          <button onClick={login} disabled={loading} style={{ width: "100%", background: "linear-gradient(135deg,#6B1F8A,#C4687A)", color: "#fff", border: "none", padding: "0.9rem", borderRadius: "3rem", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
            {loading ? "Entrando…" : "Entrar →"}
          </button>
        </div>
      </div>
    );
  }

  const subs = data?.subscribers || [];
  const stats = data?.stats || { totalActive: 0, totalCancelled: 0, totalRevenue: "0.00" };

  return (
    <div style={{ minHeight: "100vh", background: "#FDF4F5", fontFamily: "'Outfit',sans-serif", padding: "2rem 1.2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", fontWeight: 700, color: "#2A1018" }}>✦ Panel LuMane</h1>
          <button onClick={refresh} style={{ background: "#fff", border: "1.5px solid rgba(196,104,122,.3)", color: "#C4687A", padding: "0.5rem 1.2rem", borderRadius: "2rem", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>
            {loading ? "Cargando…" : "🔄 Actualizar"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "#fff", borderRadius: "1rem", padding: "1.3rem", border: "1px solid rgba(90,154,90,.2)" }}>
            <div style={{ fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.08em" }}>Activos</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 700, color: "#5A9A5A" }}>{stats.totalActive}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "1rem", padding: "1.3rem", border: "1px solid rgba(170,85,85,.2)" }}>
            <div style={{ fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.08em" }}>Cancelados</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 700, color: "#AA5555" }}>{stats.totalCancelled}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "1rem", padding: "1.3rem", border: "1px solid rgba(196,104,122,.2)" }}>
            <div style={{ fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ingresos aprox.</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 700, color: "#C4687A" }}>${stats.totalRevenue}</div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "1.2rem", overflow: "hidden", border: "1px solid rgba(196,104,122,.12)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "rgba(196,104,122,.06)", textAlign: "left" }}>
                  <th style={{ padding: "0.8rem 1rem" }}>Nombre</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Correo</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Plan</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Monto</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Pasarela</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Estado</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {subs.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#999" }}>Aún no hay suscriptores registrados.</td></tr>
                )}
                {subs.map((s, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(196,104,122,.08)" }}>
                    <td style={{ padding: "0.7rem 1rem" }}>{s.name || "—"}</td>
                    <td style={{ padding: "0.7rem 1rem" }}>{s.email}</td>
                    <td style={{ padding: "0.7rem 1rem", textTransform: "capitalize" }}>{s.plan}</td>
                    <td style={{ padding: "0.7rem 1rem" }}>{s.currency} {s.amount}</td>
                    <td style={{ padding: "0.7rem 1rem" }}>
                      <span style={{ background: s.gateway === "wompi" ? "rgba(255,200,0,.15)" : "rgba(99,91,255,.12)", color: s.gateway === "wompi" ? "#B8860B" : "#5A4FCF", padding: "0.2rem 0.6rem", borderRadius: "1rem", fontSize: "0.72rem", fontWeight: 700 }}>
                        {s.gateway === "wompi" ? "🇨🇴 Wompi" : "🌍 Stripe"}
                      </span>
                    </td>
                    <td style={{ padding: "0.7rem 1rem" }}>
                      <span style={{ color: s.status === "active" ? "#5A9A5A" : "#AA5555", fontWeight: 700 }}>
                        {s.status === "active" ? "● Activo" : "○ Cancelado"}
                      </span>
                    </td>
                    <td style={{ padding: "0.7rem 1rem", color: "#999", fontSize: "0.78rem" }}>{new Date(s.createdAt).toLocaleDateString("es")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
