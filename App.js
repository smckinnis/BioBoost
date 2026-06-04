import { useState, useEffect } from "react";

// ── CONFIG ──────────────────────────────────────────────
const STRIPE_PUBLISHABLE_KEY = "pk_test_51TehCO30S8GGcnJUcIo9qnQ6e97FmxSDTtoRhNulOj417yxg389by65McOz0bWMlX9JRS8kR5XRjC5QWi4I6UyCP00cU9R0UpO";
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/fZueVedbv6Bgb2zewc9sk00";
const FREE_USES = 1;
const STORAGE_KEY = "bioboost_uses";

// ── COLORS ──────────────────────────────────────────────
const C = {
  navy: "#0D1B2A",
  blue: "#1A6FD4",
  sky: "#38BDF8",
  gold: "#F59E0B",
  cream: "#FAFAF7",
  offwhite: "#F3F2EF",
  border: "#E2E0D9",
  muted: "#8A8A82",
  text: "#1C1C1A",
};

// ── LOGO SVG ────────────────────────────────────────────
function BioBoostLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={C.blue} />
          <stop offset="100%" stopColor={C.sky} />
        </linearGradient>
      </defs>
      {/* Rounded square bg */}
      <rect width="40" height="40" rx="10" fill={C.navy} />
      {/* Lightning bolt = "boost" */}
      <path d="M23 6L13 22h8l-4 12 14-18h-9l4-10z" fill="url(#logoGrad)" />
      {/* Small dot accent */}
      <circle cx="31" cy="9" r="2.5" fill={C.gold} />
    </svg>
  );
}

// ── WORDMARK ────────────────────────────────────────────
function Wordmark({ size = "xl" }) {
  const fs = size === "xl" ? "26px" : size === "lg" ? "20px" : "15px";
  return (
    <span style={{ fontFamily: "'Georgia', serif", fontSize: fs, fontWeight: "900", letterSpacing: "-0.03em", color: C.navy }}>
      Bio<span style={{ color: C.blue }}>Boost</span>
    </span>
  );
}

// ── SCORE METER ─────────────────────────────────────────
function ScoreMeter({ score }) {
  const color = score >= 80 ? "#22C55E" : score >= 55 ? C.gold : "#EF4444";
  const label = score >= 80 ? "Strong Profile" : score >= 55 ? "Room to Grow" : "Needs Work";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "2px" }}>Profile Strength</div>
          <div style={{ fontSize: "12px", fontWeight: "700", color, letterSpacing: "0.06em" }}>{label}</div>
        </div>
        <div style={{ fontSize: "42px", fontWeight: "900", color, fontFamily: "monospace", lineHeight: 1 }}>
          {score}<span style={{ fontSize: "16px", color: C.muted }}>/100</span>
        </div>
      </div>
      <div style={{ height: "10px", background: C.border, borderRadius: "99px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${score}%`, borderRadius: "99px",
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

// ── COPY BUTTON ─────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: copied ? "#22C55E" : C.blue, color: "#fff", border: "none", borderRadius: "6px", padding: "7px 16px", fontSize: "12px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.04em", transition: "background 0.2s", fontFamily: "Georgia,serif" }}>
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
}

// ── PAYWALL MODAL ────────────────────────────────────────
function PaywallModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.7)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "36px 32px", maxWidth: "420px", width: "100%", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", position: "relative" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
          <BioBoostLogo size={36} />
          <Wordmark size="lg" />
        </div>

        {/* Headline */}
        <div style={{ fontSize: "22px", fontWeight: "900", color: C.navy, marginBottom: "8px", fontFamily: "Georgia,serif", lineHeight: 1.3 }}>
          You've used your free optimization ⚡
        </div>
        <p style={{ color: C.muted, fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>
          Unlock <strong>unlimited bio optimizations</strong>, headline rewrites, and keyword suggestions for a one-time payment.
        </p>

        {/* Benefits */}
        <div style={{ background: C.offwhite, borderRadius: "10px", padding: "16px", marginBottom: "24px", textAlign: "left" }}>
          {["Unlimited LinkedIn bio optimizations", "AI headline suggestions", "SEO keyword recommendations", "Profile strength scoring", "Instant copy-to-clipboard"].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0", fontSize: "13px", color: C.text }}>
              <span style={{ color: "#22C55E", fontWeight: "900", fontSize: "16px" }}>✓</span> {b}
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <a href={STRIPE_PAYMENT_LINK} target="_blank" rel="noopener noreferrer"
          style={{ display: "block", background: C.blue, color: "#fff", borderRadius: "10px", padding: "16px", fontSize: "16px", fontWeight: "900", textDecoration: "none", letterSpacing: "0.02em", fontFamily: "Georgia,serif", marginBottom: "10px", transition: "background 0.2s" }}
          onMouseOver={e => e.target.style.background = C.navy}
          onMouseOut={e => e.target.style.background = C.blue}>
          Unlock BioBoost — $9 one-time
        </a>
        <div style={{ fontSize: "11px", color: C.muted, marginBottom: "16px" }}>Secure payment via Stripe · No subscription · No hidden fees</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────
export default function App() {
  const [uses, setUses] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [form, setForm] = useState({ currentBio: "", role: "", industry: "", tone: "Professional", goal: "Open to opportunities", skills: "", achievement: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
< truncated lines 140-272 >
                  style={{ ...inputBase, cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px" }}>
                  <option>Professional</option>
                  <option>Conversational</option>
                  <option>Bold & Direct</option>
                  <option>Warm & Approachable</option>
                  <option>Creative</option>
                </select>
              </div>
              <div>
                <label style={labelBase}>Primary Goal</label>
                <select name="goal" value={form.goal} onChange={handleChange}
                  style={{ ...inputBase, cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px" }}>
                  <option>Open to opportunities</option>
                  <option>Attract clients / freelance work</option>
                  <option>Build personal brand</option>
                  <option>Network in my industry</option>
                  <option>Showcase expertise</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelBase}>Top Skills (comma-separated)</label>
              <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Product Strategy, Data Analysis, Team Leadership" style={inputBase} />
            </div>

            <div>
              <label style={labelBase}>Proudest Achievement</label>
              <input name="achievement" value={form.achievement} onChange={handleChange} placeholder="e.g. Grew ARR from $2M to $10M in 18 months" style={inputBase} />
            </div>
          </div>

          {error && <div style={{ marginTop: "14px", color: "#EF4444", fontSize: "13px", fontWeight: "600" }}>{error}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{
            marginTop: "22px", width: "100%",
            background: loading ? C.sky : `linear-gradient(135deg, ${C.blue}, ${C.navy})`,
            color: "#fff", border: "none", borderRadius: "10px", padding: "15px",
            fontSize: "15px", fontWeight: "900", cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.04em", fontFamily: "Georgia,serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            boxShadow: loading ? "none" : "0 4px 20px rgba(26,111,212,0.35)",
            transition: "all 0.2s",
          }}>
            {loading ? (
              <><span style={{ width: "16px", height: "16px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Optimizing your bio...</>
            ) : uses >= FREE_USES ? "🔒 Unlock to Optimize — $9" : "⚡ Optimize My LinkedIn Bio"}
          </button>

          {uses < FREE_USES && (
            <div style={{ textAlign: "center", marginTop: "10px", fontSize: "12px", color: C.muted }}>
              ✦ {FREE_USES - uses} free optimization remaining
            </div>
          )}
        </div>

        {/* ── RESULTS ── */}
        {result && (
          <div style={{ display: "grid", gap: "16px", animation: "fadeUp 0.5s ease" }}>

            {/* Score */}
            <div style={{ background: "#fff", borderRadius: "14px", border: `1px solid ${C.border}`, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <ScoreMeter score={result.score} />
            </div>

            {/* Optimized Bio */}
            <div style={{ background: "#fff", borderRadius: "14px", border: `2px solid ${C.blue}33`, padding: "24px", boxShadow: "0 2px 12px rgba(26,111,212,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: C.blue, letterSpacing: "0.12em", textTransform: "uppercase" }}>✦ Optimized Bio</span>
                <CopyBtn text={result.optimizedBio + "\n\n" + result.cta} />
              </div>
              <p style={{ margin: "0 0 16px", fontSize: "15px", lineHeight: 1.8, color: C.text }}>{result.optimizedBio}</p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Closing CTA</span>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555", fontStyle: "italic" }}>{result.cta}</p>
              </div>
            </div>

            {/* Headline */}
            <div style={{ background: "#fff", borderRadius: "14px", border: `1px solid ${C.border}`, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>Headline Suggestion</span>
                <CopyBtn text={result.headline} />
              </div>
              <p style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: C.navy, lineHeight: 1.5 }}>{result.headline}</p>
            </div>

            {/* Keywords */}
            <div style={{ background: "#fff", borderRadius: "14px", border: `1px solid ${C.border}`, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>SEO Keywords to Include</div>
              <div>{result.keywords?.map((k, i) => (
                <span key={i} style={{ display: "inline-block", background: C.blue + "12", color: C.blue, border: `1px solid ${C.blue}30`, borderRadius: "5px", padding: "3px 12px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.04em", marginRight: "7px", marginBottom: "7px", fontFamily: "monospace" }}>{k}</span>
              ))}</div>
            </div>

            {/* Tips */}
            <div style={{ background: "#FFFBEB", borderRadius: "14px", border: `1px solid ${C.gold}44`, padding: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#92400E", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>💡 Improvement Tips</div>
              <ul style={{ margin: 0, padding: "0 0 0 18px", display: "grid", gap: "10px" }}>
                {result.improvements?.map((tip, i) => (
                  <li key={i} style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Upsell CTA */}
            {uses >= FREE_USES && (
              <div style={{ background: C.navy, borderRadius: "14px", padding: "28px", textAlign: "center", color: "#fff" }}>
                <div style={{ fontSize: "18px", fontWeight: "900", marginBottom: "8px", fontFamily: "Georgia,serif" }}>Want to optimize again?</div>
                <p style={{ color: "#94A3B8", fontSize: "13px", marginBottom: "20px" }}>Unlock unlimited optimizations for a one-time $9 payment.</p>
                <a href={STRIPE_PAYMENT_LINK} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", background: C.gold, color: C.navy, borderRadius: "8px", padding: "12px 28px", fontSize: "14px", fontWeight: "900", textDecoration: "none", letterSpacing: "0.04em", fontFamily: "Georgia,serif" }}>
                  Unlock BioBoost — $9
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px" }}>
          <BioBoostLogo size={20} />
          <Wordmark size="sm" />
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: C.muted }}>Secure payments via Stripe · Your data is never stored</p>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        input:focus, textarea:focus, select:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px ${C.blue}18; }
        button:hover { opacity: 0.92; }
      `}</style>
    </div>
  );
      }
