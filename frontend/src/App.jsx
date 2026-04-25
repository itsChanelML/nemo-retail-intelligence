import { useState, useEffect, useRef } from "react";

const API_URL = "http://127.0.0.1:8000";

const BRANDLY_NIM_KEY = "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";

// ── Brand tokens — Yellow → Green → Blue ──────────────────────
const G = {
  grad:        "linear-gradient(135deg, #F9E547 0%, #22C55E 45%, #3B82F6 100%)",
  gradR:       "linear-gradient(135deg, #3B82F6 0%, #22C55E 50%, #F9E547 100%)",
  gradSoft:    "linear-gradient(135deg, rgba(249,229,71,0.13) 0%, rgba(34,197,94,0.13) 50%, rgba(59,130,246,0.10) 100%)",
  gradText:    "linear-gradient(90deg, #F9E547, #22C55E, #3B82F6)",
  bg:          "#060810",
  surface:     "#0C0F1C",
  surfaceHigh: "#131728",
  border:      "rgba(255,255,255,0.07)",
  borderGlow:  "rgba(34,197,94,0.22)",
  textPrimary: "#F0F4FF",
  textSec:     "rgba(240,244,255,0.50)",
  textMuted:   "rgba(240,244,255,0.28)",
  yellow:      "#F9E547",
  green:       "#22C55E",
  blue:        "#3B82F6",
  teal:        "#14B8A6",
  red:         "#EF4444",
  orange:      "#F97316",
};

// ── Helpers ────────────────────────────────────────────────────
function GradText({ children, style = {} }) {
  return <span style={{ background: G.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", ...style }}>{children}</span>;
}
function GradBar({ pct, h = 6 }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 100, height: h, overflow: "hidden" }}>
      <div style={{ height: h, borderRadius: 100, background: G.grad, width: `${Math.min(100, pct)}%`, transition: "width 1.1s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}
function Card({ children, glow = false, style = {} }) {
  return <div style={{ background: G.surface, borderRadius: 20, padding: "16px 14px", border: `1px solid ${glow ? G.borderGlow : G.border}`, boxShadow: glow ? "0 0 28px rgba(34,197,94,0.08)" : "none", ...style }}>{children}</div>;
}
function Chip({ label, color = G.green }) {
  return <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.8, color, background: `${color}18`, padding: "3px 9px", borderRadius: 100, fontFamily: "'Outfit',sans-serif" }}>{label}</span>;
}
function Avatar({ initials, size = 38 }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: G.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 800, color: "#fff", fontFamily: "'Outfit',sans-serif" }}>{initials}</div>;
}
function Scroll({ children, style = {} }) {
  return <div style={{ overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", height: "100%", paddingBottom: 24, ...style }}>{children}</div>;
}
function SectionLabel({ children }) {
  return <div style={{ fontSize: 10, color: G.textMuted, letterSpacing: 1.4, fontWeight: 700, fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", marginBottom: 10 }}>{children}</div>;
}
function PrimaryBtn({ children, onClick, disabled = false, style = {} }) {
  return <button onClick={onClick} disabled={disabled} style={{ width: "100%", padding: "14px", borderRadius: 14, background: disabled ? "rgba(255,255,255,0.06)" : G.grad, border: "none", color: disabled ? G.textMuted : "#060810", fontSize: 14, fontWeight: 800, fontFamily: "'Outfit',sans-serif", cursor: disabled ? "not-allowed" : "pointer", letterSpacing: 0.2, transition: "opacity 0.2s", ...style }}>{children}</button>;
}

// ── Price Tag Logo ─────────────────────────────────────────────
function PriceTagLogo({ size = 48, animate = false }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={animate ? { animation: "float 3s ease-in-out infinite" } : {}}>
      <defs>
        <linearGradient id="tagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E547" />
          <stop offset="45%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      {/* Tag body */}
      <path d="M6 4C6 1.79 7.79 0 10 0H30L42 12V46C42 48.21 40.21 50 38 50H10C7.79 50 6 48.21 6 46V4Z" fill="url(#tagGrad)" />
      {/* Folded corner */}
      <path d="M30 0L42 12H32C30.9 12 30 11.1 30 10V0Z" fill="rgba(0,0,0,0.25)" />
      {/* Hole */}
      <circle cx="16" cy="8" r="3" fill="rgba(0,0,0,0.3)" />
      {/* String */}
      <line x1="16" y1="5" x2="16" y2="0" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" />
      {/* $ symbol */}
      <text x="24" y="36" textAnchor="middle" fill="rgba(0,0,0,0.5)" fontSize="20" fontWeight="900" fontFamily="'Outfit',sans-serif">$</text>
    </svg>
  );
}

// ── Glassmorphism bouncing orb (dime-sized, actually bounces) ─
const ORB = 18; // diameter in px — dime sized
function GlassOrb() {
  const W = 375, H = 800;
  const [pos, setPos] = useState({ x: 60, y: 140 });
  const vel = useRef({ vx: 1.8, vy: 1.2 });

  useEffect(() => {
    const id = setInterval(() => {
      setPos(p => {
        let { x, y } = p;
        let { vx, vy } = vel.current;
        x += vx;
        y += vy;
        if (x <= 0 || x >= W - ORB) { vx = -vx; x = Math.max(0, Math.min(W - ORB, x)); }
        if (y <= 0 || y >= H - ORB) { vy = -vy; y = Math.max(0, Math.min(H - ORB, y)); }
        vel.current = { vx, vy };
        return { x, y };
      });
    }, 16);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "absolute",
      left: pos.x, top: pos.y,
      width: ORB, height: ORB,
      borderRadius: "50%",
      background: "linear-gradient(135deg, rgba(249,229,71,0.9) 0%, rgba(34,197,94,0.85) 50%, rgba(59,130,246,0.9) 100%)",
      boxShadow: "0 0 12px rgba(249,229,71,0.6), 0 0 24px rgba(34,197,94,0.4), 0 0 6px rgba(59,130,246,0.5)",
      border: "1px solid rgba(255,255,255,0.4)",
      pointerEvents: "none",
      zIndex: 0,
      backdropFilter: "blur(2px)",
    }} />
  );
}

// ── STAGE 1: Splash ────────────────────────────────────────────
function SplashScreen({ onNext }) {
  return (
    <div style={{ height: "100%", background: G.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <GlassOrb />
      {/* Soft noise overlay */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(6,8,16,0.3) 0%, rgba(6,8,16,0.7) 100%)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 32px" }}>
        <div style={{ marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>
          <PriceTagLogo size={72} />
        </div>

        <div style={{ fontSize: 38, fontWeight: 900, color: "#FFFFFF", fontFamily: "'Outfit',sans-serif", letterSpacing: -1.5, marginBottom: 8, textAlign: "center", lineHeight: 1 }}>
          brandly
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "'Outfit',sans-serif", letterSpacing: 1.5, marginBottom: 48, textAlign: "center" }}>
          INTELLIGENCE YOUR BRAND DESERVES
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <PrimaryBtn onClick={onNext}>Get Started</PrimaryBtn>
          <button style={{ width: "100%", padding: "14px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: G.textSec, fontSize: 14, fontWeight: 600, fontFamily: "'Outfit',sans-serif", cursor: "pointer", letterSpacing: 0.2 }}>
            I already have an account
          </button>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 28, alignItems: "center" }}>
          {["🔒 Bank-grade security", "👁 View-only · we never touch your money", "✦ No passwords stored"].map(t => (
            <div key={t} style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "'Outfit',sans-serif", letterSpacing: 0.5, textAlign: "center" }}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── STAGE 2: Email entry ───────────────────────────────────────
function EmailScreen({ onNext }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!email.includes("@")) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    onNext(email);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "32px 20px 24px", background: G.bg }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><PriceTagLogo size={40} /></div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "'Outfit',sans-serif", letterSpacing: -0.8, marginBottom: 6 }}>
          What's your email?
        </div>
        <div style={{ fontSize: 13, color: G.textSec, fontFamily: "'Outfit',sans-serif", lineHeight: 1.6 }}>
          We'll send a one-time code to verify it's really you. No password needed.
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, color: G.textMuted, fontFamily: "'Outfit',sans-serif", letterSpacing: 1.2, fontWeight: 700, marginBottom: 8 }}>EMAIL ADDRESS</div>
        <input
          type="email" autoComplete="email" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{ width: "100%", background: G.surface, border: `1px solid ${email.includes("@") ? G.green + "60" : G.border}`, borderRadius: 14, padding: "16px", color: G.textPrimary, fontSize: 16, fontFamily: "'Outfit',sans-serif", outline: "none", letterSpacing: 0.2 }}
        />
        {email.includes("@") && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, animation: "fadeUp 0.3s ease" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: G.green }} />
            <span style={{ fontSize: 11, color: G.green, fontFamily: "'Outfit',sans-serif" }}>Autofill available · Apple Intelligence detected</span>
          </div>
        )}

        <div style={{ marginTop: 20, padding: "14px", background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14 }}>
          <div style={{ fontSize: 11, color: G.textMuted, fontFamily: "'Outfit',sans-serif", lineHeight: 1.65 }}>
            🔒 We use OAuth 2.0 + one-time codes only. Your email is used for authentication and deal alerts — never sold or shared.
          </div>
        </div>
      </div>

      <PrimaryBtn onClick={submit} disabled={!email.includes("@") || sending}>
        {sending ? "Sending secure code…" : "Send my code →"}
      </PrimaryBtn>
    </div>
  );
}

// ── STAGE 3: OTP ───────────────────────────────────────────────
function OTPScreen({ email, onNext }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = useRef([]);
  const DEMO_CODE = "BR24X9"; // demo — first 2 alpha, rest mixed

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const handleKey = (i, val) => {
    if (!/^[a-zA-Z0-9]?$/.test(val)) return;
    const next = [...code];
    next[i] = val.toUpperCase();
    setCode(next);
    setError(false);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
    // Auto verify
    if (next.join("").length === 6) {
      const entered = next.join("");
      if (entered === DEMO_CODE) {
        setVerified(true);
        setTimeout(() => onNext(), 900);
      } else { setError(true); }
    }
  };

  const handleBack = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "32px 20px 24px", background: G.bg }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><PriceTagLogo size={40} /></div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "'Outfit',sans-serif", letterSpacing: -0.8, marginBottom: 6 }}>
          Check your email
        </div>
        <div style={{ fontSize: 13, color: G.textSec, fontFamily: "'Outfit',sans-serif", lineHeight: 1.65 }}>
          We sent a 6-character code to <span style={{ color: G.textPrimary, fontWeight: 600 }}>{email}</span>. It expires in:
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginTop: 10 }}>
          <GradText>{mins}:{secs}</GradText>
        </div>
      </div>

      {/* Demo hint */}
      <div style={{ padding: "10px 14px", background: `${G.yellow}10`, border: `1px solid ${G.yellow}30`, borderRadius: 12, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: G.yellow, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>Demo mode · Enter: BR24X9</div>
      </div>

      {/* Code inputs */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
        {code.map((c, i) => (
          <input key={i} ref={el => inputRefs.current[i] = el}
            maxLength={1} value={c}
            onChange={e => handleKey(i, e.target.value)}
            onKeyDown={e => handleBack(i, e)}
            style={{
              width: 44, height: 54, textAlign: "center", fontSize: 20, fontWeight: 800, fontFamily: "'Outfit',sans-serif",
              background: verified ? `${G.green}15` : error ? `${G.red}15` : G.surface,
              border: `1.5px solid ${verified ? G.green : error ? G.red : c ? G.green + "60" : G.border}`,
              borderRadius: 12, color: verified ? G.green : error ? G.red : G.textPrimary,
              outline: "none", transition: "all 0.2s", cursor: "text", letterSpacing: 0,
            }}
          />
        ))}
      </div>

      {verified && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, animation: "fadeUp 0.3s ease" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.green, boxShadow: `0 0 10px ${G.green}` }} />
          <span style={{ fontSize: 13, color: G.green, fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>Verified! Taking you in…</span>
        </div>
      )}
      {error && (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: G.red, fontFamily: "'Outfit',sans-serif" }}>Incorrect code. Try BR24X9 for demo.</span>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: G.textMuted, fontFamily: "'Outfit',sans-serif" }}>Didn't get it? </span>
        <span style={{ fontSize: 12, color: G.green, fontFamily: "'Outfit',sans-serif", fontWeight: 600, cursor: "pointer" }}>Resend code</span>
      </div>

      <div style={{ padding: "12px 14px", background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14 }}>
        <div style={{ fontSize: 10, color: G.textMuted, fontFamily: "'Outfit',sans-serif", lineHeight: 1.65, textAlign: "center" }}>
          🔐 Codes expire in 5 minutes · One-time use only · Session encrypted with TLS 1.3
        </div>
      </div>
    </div>
  );
}

// ── STAGE 4: Connect Social ────────────────────────────────────
function SocialVerifyScreen({ onNext }) {
  const [connected, setConnected] = useState([]);
  const [loading, setLoading] = useState(null);

  const PLATFORMS = [
    { id: "instagram", label: "Instagram",  icon: "📸", color: "#E1306C", desc: "2.4M followers · 4.2% eng", sub: "Most popular for creators" },
    { id: "linkedin",  label: "LinkedIn",   icon: "💼", color: "#0A66C2", desc: "Professional network",       sub: "Great for brand outreach" },
    { id: "snapchat",  label: "Snapchat",   icon: "👻", color: "#F9E547", desc: "Snap audience insights",     sub: "Rising for Gen Z creators" },
    { id: "tiktok",    label: "TikTok",     icon: "🎵", color: "#69C9D0", desc: "1.8M followers · 6.7% eng", sub: "Highest engagement rates" },
    { id: "youtube",   label: "YouTube",    icon: "▶️", color: "#FF0000", desc: "890K subscribers",           sub: "Long-form deal authority" },
  ];

  const connect = async (id) => {
    if (connected.includes(id)) return;
    setLoading(id);
    await new Promise(r => setTimeout(r, 1400));
    setConnected(c => [...c, id]);
    setLoading(null);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "28px 20px 24px", background: G.bg }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><PriceTagLogo size={40} /></div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "'Outfit',sans-serif", letterSpacing: -0.8, marginBottom: 6 }}>
          Connect a platform
        </div>
        <div style={{ fontSize: 12, color: G.textSec, fontFamily: "'Outfit',sans-serif", lineHeight: 1.65 }}>
          This verifies your creator identity and powers your pitch briefs. Connect at least one to activate your account.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {PLATFORMS.map(p => {
          const isConnected = connected.includes(p.id);
          const isLoading = loading === p.id;
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", background: isConnected ? `${p.color}0D` : G.surface, border: `1px solid ${isConnected ? p.color + "45" : G.border}`, borderRadius: 16, marginBottom: 10, transition: "all 0.2s" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>{p.label}</div>
                <div style={{ fontSize: 10, color: isConnected ? p.color : G.textMuted, fontFamily: "'Outfit',sans-serif" }}>{isConnected ? `✓ ${p.desc}` : p.sub}</div>
              </div>
              <button onClick={() => connect(p.id)} disabled={isConnected || !!loading} style={{
                padding: "7px 14px", borderRadius: 100, fontSize: 10, fontWeight: 700, fontFamily: "'Outfit',sans-serif", cursor: isConnected ? "default" : "pointer", border: "none", transition: "all 0.2s",
                background: isConnected ? `${p.color}20` : isLoading ? "rgba(255,255,255,0.06)" : G.grad,
                color: isConnected ? p.color : isLoading ? G.textMuted : "#060810",
              }}>
                {isConnected ? "Connected ✓" : isLoading ? "Connecting…" : "Connect"}
              </button>
            </div>
          );
        })}

        <div style={{ padding: "12px 14px", background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14, marginTop: 4 }}>
          <div style={{ fontSize: 10, color: G.textMuted, fontFamily: "'Outfit',sans-serif", lineHeight: 1.7 }}>
            🔐 We use OAuth 2.0 — you authorize via each platform's official login. We only read public profile data and follower counts. We never post, DM, or access private messages.
          </div>
        </div>
      </div>

      <div style={{ paddingTop: 12 }}>
        <PrimaryBtn onClick={onNext} disabled={connected.length === 0}>
          {connected.length === 0 ? "Connect at least one platform" : `Activate my account (${connected.length} connected) →`}
        </PrimaryBtn>
        <p style={{ fontSize: 11, color: G.textMuted, textAlign: "center", fontFamily: "'Outfit',sans-serif", marginTop: 10, cursor: "pointer" }} onClick={onNext}>
          Skip for now — I'll connect later
        </p>
      </div>
    </div>
  );
}

// ── STAGE 5: Meet Brandly ──────────────────────────────────────
function MeetBrandlyScreen({ onNext }) {
  const [step, setStep] = useState(0);

  const msgs = [
    { emoji: "✦", title: "Meet brandly.", body: "I'm your AI financial agent. I watch how you spend, then turn it into brand deals — automatically." },
    { emoji: "🧠", title: "I think for you.", body: "Every transaction is analyzed. Every brand you already love becomes a pitch opportunity. I do the work. You get paid." },
    { emoji: "🤝", title: "Squad deals too.", body: "When your creator friends spend at the same brands, I surface co-deal opportunities with combined reach." },
    { emoji: "⚡", title: "Let's get started.", body: "Tell me about yourself and I'll find your first brand deal opportunities within minutes of setup." },
  ];

  const current = msgs[step];
  const isLast = step === msgs.length - 1;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: G.bg, position: "relative", overflow: "hidden" }}>
      {/* Soft orb background */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ marginBottom: 24 }}><PriceTagLogo size={56} animate /></div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {msgs.map((_, i) => (
            <div key={i} style={{ height: 4, borderRadius: 100, background: i <= step ? G.green : G.surfaceHigh, width: i <= step ? 24 : 8, transition: "all 0.35s" }} />
          ))}
        </div>

        <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease" }} key={step}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>{current.emoji}</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit',sans-serif", letterSpacing: -1, marginBottom: 12 }}>
            {current.title}
          </h2>
          <p style={{ fontSize: 15, color: G.textSec, fontFamily: "'Outfit',sans-serif", lineHeight: 1.75 }}>
            {current.body}
          </p>
        </div>
      </div>

      <div style={{ padding: "0 24px 36px" }}>
        <PrimaryBtn onClick={isLast ? onNext : () => setStep(s => s + 1)}>
          {isLast ? "Build my profile →" : "Next →"}
        </PrimaryBtn>
        {!isLast && (
          <p onClick={onNext} style={{ fontSize: 11, color: G.textMuted, textAlign: "center", fontFamily: "'Outfit',sans-serif", marginTop: 12, cursor: "pointer" }}>Skip intro</p>
        )}
      </div>
    </div>
  );
}

// ── Onboarding agent (post-Meet Brandly) ──────────────────────
const CREATOR_TYPES = [
  { id: "influencer", label: "Influencer", emoji: "📱" }, { id: "athlete", label: "Athlete", emoji: "🏆" },
  { id: "musician",   label: "Musician",   emoji: "🎵" }, { id: "streamer", label: "Streamer", emoji: "🎮" },
  { id: "comedian",   label: "Comedian",   emoji: "😂" }, { id: "journalist", label: "Journalist", emoji: "✍️" },
];
const CATEGORIES = [
  { id: "fashion",  label: "Fashion",       emoji: "👗" }, { id: "beauty",  label: "Beauty",    emoji: "💄" },
  { id: "fitness",  label: "Fitness",       emoji: "🏋️" }, { id: "food",    label: "Food",      emoji: "🍽️" },
  { id: "travel",   label: "Travel",        emoji: "✈️" }, { id: "tech",    label: "Tech",      emoji: "💻" },
  { id: "gaming",   label: "Gaming",        emoji: "🎮" }, { id: "wellness",label: "Wellness",  emoji: "🧘" },
  { id: "sports",   label: "Sports",        emoji: "⚽" }, { id: "music",   label: "Music",     emoji: "🎧" },
];
const SUBCATEGORIES = {
  fashion: ["Luxury","Streetwear","Activewear","Sustainable","Vintage","Designer","Fast Fashion","Accessories"],
  beauty:  ["Skincare","Makeup","Haircare","Fragrance","Nail","Clean Beauty","Men's Grooming","K-Beauty"],
  fitness: ["Gym & Strength","Running","Yoga","Cycling","CrossFit","Nutrition","Recovery","Outdoor"],
  food:    ["Fast Casual","Fine Dining","Plant-Based","Meal Prep","Snacks","Coffee","Desserts","Alcohol"],
  travel:  ["Luxury","Budget","Adventure","Business","Hotels","Airlines","Cruises","Experiences"],
  tech:    ["Consumer Electronics","Gaming","Wearables","Smart Home","Audio","Cameras","Mobile","Software"],
  gaming:  ["PC Gaming","Console","Mobile","Esports","VR/AR","Streaming Gear","Publishers","Accessories"],
  wellness:["Mental Health","Sleep","Supplements","Meditation","Holistic","Spa","CBD","Fitness Tech"],
  sports:  ["Athletic Wear","Equipment","Nutrition","Footwear","Recovery","Outdoor","Water Sports","Leagues"],
  music:   ["Instruments","Streaming","Headphones","DJ/Production","Recording","Live Events","Merch","Lessons"],
};
const TOP_BRANDS = {
  fashion: ["Zara","H&M","ASOS","Nike","Adidas","Gucci","Louis Vuitton","Balenciaga","Off-White","Supreme","Gymshark","Lululemon","Reformation","Shein","Urban Outfitters"],
  beauty:  ["Sephora","Ulta","MAC","Fenty Beauty","Charlotte Tilbury","Glossier","Rare Beauty","NARS","Drunk Elephant","CeraVe","La Mer","Tatcha","Morphe","NYX","e.l.f."],
  fitness: ["Gymshark","Lululemon","Nike","Under Armour","Peloton","MyProtein","GNC","Optimum Nutrition","WHOOP","Theragun","Hyperice","Reebok","Fabletics","Bowflex","NordicTrack"],
  food:    ["Chipotle","Sweetgreen","Shake Shack","Panera","DoorDash","HelloFresh","Starbucks","Celsius","Athletic Greens","RXBAR","Chick-fil-A","Grubhub","Uber Eats","Daily Harvest","Panera"],
  travel:  ["Delta","United","American Airlines","Marriott","Hilton","Airbnb","Expedia","Chase Sapphire","Amex Travel","Hertz","Uber","Lyft","TripAdvisor","Booking.com","Hyatt"],
  tech:    ["Apple","Samsung","Sony","Google","Microsoft","Bose","JBL","Anker","Logitech","Razer","DJI","GoPro","Ring","Nest","Tile"],
  gaming:  ["Razer","SteelSeries","HyperX","Logitech G","PlayStation","Xbox","Nintendo","Corsair","ASUS ROG","Alienware","Secretlab","Elgato","Streamlabs","Epic Games","Steam"],
  wellness:["Headspace","Calm","Peloton","Theragun","Eight Sleep","WHOOP","AG1","Ritual","Seed","Hims","Hers","Noom","WW","Oura","Levels"],
  sports:  ["Nike","Adidas","Under Armour","New Balance","ASICS","Gatorade","Bodyarmor","Oakley","Wilson","Callaway","TaylorMade","Yeti","Hydro Flask","Trek","Rawlings"],
  music:   ["Spotify","Apple Music","Sennheiser","Beats","JBL","Roland","Fender","Gibson","Shure","Audio-Technica","Rode","Yamaha","Native Instruments","Ableton","Steinberg"],
};

function AgentBubble({ msg }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 18, animation: "fadeUp 0.4s ease" }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: G.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>✦</div>
      <div style={{ background: G.surface, border: `1px solid ${G.borderGlow}`, borderRadius: "4px 16px 16px 16px", padding: "11px 13px", maxWidth: "88%" }}>
        <div style={{ fontSize: 9, color: G.green, fontWeight: 700, letterSpacing: 1, fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>BRANDLY AGENT</div>
        <p style={{ margin: 0, fontSize: 12, color: G.textPrimary, lineHeight: 1.65, fontFamily: "'Outfit',sans-serif" }}>{msg}</p>
      </div>
    </div>
  );
}

function ProgressDots({ total, current, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "none", border: "none", color: G.textMuted, cursor: "pointer", fontSize: 20, padding: "0 8px 0 0" }}>←</button>
      )}
      <div style={{ display: "flex", gap: 6, flex: 1, justifyContent: "center" }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ height: 4, borderRadius: 100, background: i < current ? G.green : G.surfaceHigh, width: i < current ? 20 : 8, transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

function OnboardingAgent({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ type: "", name: "", handle: "", categories: [], subcategories: {}, brands: {} });
  const [catIdx, setCatIdx] = useState(0);
  const [custom, setCustom] = useState("");
  const [cardConnected, setCardConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const toggle = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  const toggleBrand = (cat, brand) => setProfile(p => ({ ...p, brands: { ...p.brands, [cat]: toggle(p.brands[cat] || [], brand) } }));
  const selCats = profile.categories;
  const curCat = selCats[catIdx];

  const addCustom = (cat) => {
    if (!custom.trim()) return;
    toggleBrand(cat, custom.trim());
    setCustom("");
  };

  const nextCat = () => {
    if (catIdx < selCats.length - 1) setCatIdx(i => i + 1);
    else setStep(4);
  };

  const connectCard = async () => {
    setConnecting(true);
    await new Promise(r => setTimeout(r, 2000));
    setCardConnected(true);
    setConnecting(false);
  };

  const finalize = async () => {
    setInitializing(true);
    await new Promise(r => setTimeout(r, 2600));
    onComplete();
  };

  // Step 0: name/handle
  if (step === 0) return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "48px 20px 24px", background: G.bg }}>
      <ProgressDots total={5} current={1} onBack={null} />
      <AgentBubble msg="First things first — what's your name and creator handle? Your squad will find you by handle." />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <input placeholder="Your name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
          style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14, padding: "14px 16px", color: G.textPrimary, fontSize: 14, fontFamily: "'Outfit',sans-serif", outline: "none", width: "100%" }} />
        <input placeholder="@yourhandle" value={profile.handle} onChange={e => setProfile(p => ({ ...p, handle: e.target.value }))}
          style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14, padding: "14px 16px", color: G.textPrimary, fontSize: 14, fontFamily: "'Outfit',sans-serif", outline: "none", width: "100%" }} />
      </div>
      <PrimaryBtn onClick={() => setStep(1)} disabled={!profile.name || !profile.handle}>Continue →</PrimaryBtn>
    </div>
  );

  // Step 1: creator type
  if (step === 1) return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "48px 20px 24px", background: G.bg }}>
      <ProgressDots total={5} current={2} onBack={() => setStep(0)} />
      <AgentBubble msg="What kind of creator are you? This shapes which brands I'll prioritize for you." />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingBottom: 16 }}>
          {CREATOR_TYPES.map(t => (
            <div key={t.id} onClick={() => setProfile(p => ({ ...p, type: t.id }))} style={{ background: profile.type === t.id ? G.gradSoft : G.surface, border: `1px solid ${profile.type === t.id ? G.borderGlow : G.border}`, borderRadius: 16, padding: "18px 12px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{t.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
      <PrimaryBtn onClick={() => setStep(2)} disabled={!profile.type}>Continue →</PrimaryBtn>
    </div>
  );

  // Step 2: categories
  if (step === 2) return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "48px 20px 24px", background: G.bg }}>
      <ProgressDots total={5} current={3} onBack={() => setStep(1)} />
      <AgentBubble msg="Pick your content categories. The more you choose, the more deal signals I can find for you." />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingBottom: 16 }}>
          {CATEGORIES.map(c => {
            const sel = profile.categories.includes(c.id);
            return (
              <div key={c.id} onClick={() => setProfile(p => ({ ...p, categories: toggle(p.categories, c.id) }))} style={{ background: sel ? G.gradSoft : G.surface, border: `1px solid ${sel ? G.borderGlow : G.border}`, borderRadius: 16, padding: "16px 10px", textAlign: "center", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                {sel && <div style={{ position: "absolute", top: 8, right: 10, width: 16, height: 16, borderRadius: "50%", background: G.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>✓</div>}
                <div style={{ fontSize: 24, marginBottom: 6 }}>{c.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>{c.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <PrimaryBtn onClick={() => { setCatIdx(0); setStep(3); }} disabled={profile.categories.length === 0}>Continue →</PrimaryBtn>
    </div>
  );

  // Step 3: subcategories + brands per category
  if (step === 3 && curCat) {
    const cat = CATEGORIES.find(c => c.id === curCat);
    const subs = SUBCATEGORIES[curCat] || [];
    const brands = TOP_BRANDS[curCat] || [];
    const selSubs = profile.subcategories[curCat] || [];
    const selBrands = profile.brands[curCat] || [];

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "48px 20px 24px", background: G.bg }}>
        <ProgressDots total={5} current={3} onBack={() => { if (catIdx > 0) setCatIdx(i => i - 1); else setStep(2); }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 22 }}>{cat?.emoji}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>{cat?.label}</div>
            <div style={{ fontSize: 10, color: G.textMuted, fontFamily: "'Outfit',sans-serif" }}>{catIdx + 1} of {selCats.length}</div>
          </div>
        </div>
        <AgentBubble msg={`Within ${cat?.label}, which lanes are you most in? And have you worked with any of these brands before?`} />

        <div style={{ flex: 1, overflowY: "auto" }}>
          <SectionLabel>Your lanes</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            {subs.map(s => {
              const sel = selSubs.includes(s);
              return (
                <div key={s} onClick={() => setProfile(p => ({ ...p, subcategories: { ...p.subcategories, [curCat]: toggle(selSubs, s) } }))}
                  style={{ padding: "8px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, fontFamily: "'Outfit',sans-serif", cursor: "pointer", transition: "all 0.2s", background: sel ? G.gradSoft : G.surface, border: `1px solid ${sel ? G.borderGlow : G.border}`, color: sel ? G.textPrimary : G.textSec }}>
                  {s}
                </div>
              );
            })}
          </div>

          <SectionLabel>Previous brand deals (tap all that apply)</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {brands.map(b => {
              const sel = selBrands.includes(b);
              return (
                <div key={b} onClick={() => toggleBrand(curCat, b)}
                  style={{ padding: "8px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, fontFamily: "'Outfit',sans-serif", cursor: "pointer", transition: "all 0.2s", background: sel ? G.gradSoft : G.surface, border: `1px solid ${sel ? G.borderGlow : G.border}`, color: sel ? G.green : G.textSec }}>
                  {sel ? "✓ " : ""}{b}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <input placeholder="Add a brand not listed…" value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === "Enter" && addCustom(curCat)}
              style={{ flex: 1, background: G.surface, border: `1px solid ${G.border}`, borderRadius: 12, padding: "10px 14px", color: G.textPrimary, fontSize: 12, fontFamily: "'Outfit',sans-serif", outline: "none" }} />
            <button onClick={() => addCustom(curCat)} style={{ background: G.gradSoft, border: `1px solid ${G.borderGlow}`, borderRadius: 12, padding: "10px 16px", color: G.green, fontSize: 12, fontWeight: 700, fontFamily: "'Outfit',sans-serif", cursor: "pointer" }}>Add</button>
          </div>
        </div>
        <PrimaryBtn onClick={nextCat}>{catIdx < selCats.length - 1 ? `Next: ${CATEGORIES.find(c => c.id === selCats[catIdx + 1])?.label} →` : "Continue →"}</PrimaryBtn>
      </div>
    );
  }

  // Step 4: Connect card (Plaid)
  if (step === 4) return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "48px 20px 24px", background: G.bg }}>
      <ProgressDots total={5} current={4} onBack={() => setStep(3)} />
      <AgentBubble msg="Last step — connect your card and I'll start finding deals from your real spend. This is what makes brandly click." />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Card art */}
        <div style={{ borderRadius: 20, padding: "48px 20px 24px", background: "linear-gradient(135deg, #0D1A0D, #0A1020)", border: `1px solid ${G.border}`, marginBottom: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)" }} />
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "'Outfit',sans-serif", marginBottom: 24 }}>BRANDLY × PLAID</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Outfit',sans-serif", letterSpacing: 2, marginBottom: 20 }}>•••• •••• •••• ——</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "'Outfit',sans-serif", letterSpacing: 1 }}>CARD HOLDER</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'Outfit',sans-serif" }}>{profile.name || "YOUR NAME"}</div>
            </div>
            {cardConnected && <div style={{ fontSize: 11, color: G.green, fontFamily: "'Outfit',sans-serif", fontWeight: 700, animation: "fadeUp 0.3s ease" }}>✓ LIVE</div>}
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[["🔒", "Bank-grade", "256-bit SSL"], ["👁", "View-only", "We never touch your money"], ["🏦", "Plaid", "7,000+ apps trust it"]].map(([icon, title, sub]) => (
            <div key={title} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>{title}</div>
              <div style={{ fontSize: 9, color: G.textMuted, fontFamily: "'Outfit',sans-serif", lineHeight: 1.4 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {!cardConnected
        ? <PrimaryBtn onClick={connectCard} disabled={connecting}>{connecting ? "Connecting securely…" : "Connect via Plaid"}</PrimaryBtn>
        : <PrimaryBtn onClick={() => setStep(5)}>Continue →</PrimaryBtn>
      }
      <p onClick={() => setStep(5)} style={{ fontSize: 11, color: G.textMuted, textAlign: "center", fontFamily: "'Outfit',sans-serif", marginTop: 10, cursor: "pointer" }}>Skip — add card later</p>
    </div>
  );

  // Step 5: Initializing
  if (step === 5) return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", background: G.bg }}>
      {!initializing ? (
        <>
          <div style={{ fontSize: 52, marginBottom: 20, animation: "pulse 1.5s infinite" }}>✦</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "'Outfit',sans-serif", textAlign: "center", marginBottom: 8 }}>
            <GradText>Building your intelligence profile…</GradText>
          </h2>
          <p style={{ fontSize: 13, color: G.textSec, fontFamily: "'Outfit',sans-serif", textAlign: "center", lineHeight: 1.7, marginBottom: 28 }}>
            I'm scanning your spend, pulling your social reach, and finding your first brand deals.
          </p>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {["Syncing card transactions via Plaid…", "Pulling social follower + engagement data…", "Detecting brand deal opportunities…", "Checking squad spend overlaps…"].map((msg, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: G.surface, borderRadius: 12, animation: `fadeUp 0.4s ease ${i * 0.25}s both` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: G.green, boxShadow: `0 0 6px ${G.green}`, animation: "pulse 1.5s infinite" }} />
                <span style={{ fontSize: 12, color: G.textSec, fontFamily: "'Outfit',sans-serif" }}>{msg}</span>
              </div>
            ))}
          </div>
          <PrimaryBtn onClick={finalize}>I'm ready →</PrimaryBtn>
        </>
      ) : (
        <>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "'Outfit',sans-serif", textAlign: "center", marginBottom: 8 }}>
            <GradText>You're in!</GradText>
          </h2>
          <p style={{ fontSize: 13, color: G.textSec, fontFamily: "'Outfit',sans-serif", textAlign: "center", lineHeight: 1.7 }}>
            I've already found 4 brand deal opportunities. Let's get you paid. 💸
          </p>
        </>
      )}
    </div>
  );

  return null;
}

// ── Agent log data ─────────────────────────────────────────────
const AGENT_LOG = [
  { id:1,  stage:"PERCEIVE", icon:"👁",  text:"Connected to your American Express · syncing purchases",     ts:"Just now", done:true  },
  { id:2,  stage:"PERCEIVE", icon:"👁",  text:"Found your Instagram · 2.4M followers, 4.2% engagement",     ts:"Just now", done:true  },
  { id:3,  stage:"PERCEIVE", icon:"👁",  text:"Found your TikTok · 1.8M followers, 6.7% engagement",        ts:"Just now", done:true  },
  { id:4,  stage:"PLAN",     icon:"🧠",  text:"Looking for purchases above your $250 deal threshold",        ts:"2s ago",   done:true  },
  { id:5,  stage:"PLAN",     icon:"🧠",  text:"Matching your spending to your fitness + beauty profile",     ts:"2s ago",   done:true  },
  { id:6,  stage:"PLAN",     icon:"🧠",  text:"Chipotle: you've spent $312 this month · deal territory 🎯",  ts:"3s ago",   done:true  },
  { id:7,  stage:"PLAN",     icon:"🧠",  text:"Delta: $2,940 in flights · ambassador level spend detected",  ts:"4s ago",   done:true  },
  { id:8,  stage:"ACT",      icon:"⚡",  text:"Writing your Chipotle pitch using your Instagram reach",      ts:"5s ago",   done:true  },
  { id:9,  stage:"ACT",      icon:"⚡",  text:"Noticed Kai Styles also spends $280+ at Chipotle",            ts:"6s ago",   done:true  },
  { id:10, stage:"ACT",      icon:"⚡",  text:"You two have 4.2M combined reach · flagged as a squad deal",  ts:"6s ago",   done:true  },
  { id:11, stage:"REFLECT",  icon:"🔄",  text:"Reviewed your pitch · adding your TikTok engagement boost",  ts:"7s ago",   done:true  },
  { id:12, stage:"REFLECT",  icon:"🔄",  text:"Chipotle pitch confidence bumped from 94% to 97% ✓",         ts:"8s ago",   done:true  },
  { id:13, stage:"PERCEIVE", icon:"👁",  text:"Watching your spending for new opportunities…",               ts:"Now",      done:false },
];
const SC = { PERCEIVE: G.blue, PLAN: G.yellow, ACT: G.green, REFLECT: G.teal };

function AgentPill({ onExpand }) {
  const latest = AGENT_LOG.find(l => !l.done) || AGENT_LOG[AGENT_LOG.length - 1];
  return (
    <div onClick={onExpand} style={{ background: "rgba(12,15,28,0.96)", backdropFilter: "blur(16px)", borderTop: `1px solid ${G.borderGlow}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.green, boxShadow: `0 0 8px ${G.green}`, animation: "pulse 2s infinite", flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 11, color: G.textSec, fontFamily: "'Outfit',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <span style={{ color: SC[latest.stage], fontWeight: 700 }}>{latest.stage}</span> · {latest.text}
      </span>
      <span style={{ fontSize: 10, color: G.textMuted, fontFamily: "'Outfit',sans-serif" }}>↑</span>
    </div>
  );
}

function AgentLogOverlay({ onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 30, background: "rgba(6,8,16,0.98)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", animation: "fadeUp 0.3s ease" }}>
      <div style={{ padding: "20px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${G.border}`, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>Agent Activity</div>
          <div style={{ fontSize: 10, color: G.textMuted, fontFamily: "'Outfit',sans-serif", letterSpacing: 1, marginTop: 2 }}>How brandly finds your deals</div>        </div>
        <button onClick={onClose} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 100, padding: "6px 14px", color: G.textSec, fontSize: 12, fontFamily: "'Outfit',sans-serif", cursor: "pointer" }}>Close</button>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px 20px", borderBottom: `1px solid ${G.border}`, flexShrink: 0 }}>
        {[
          { key:"PERCEIVE", label:"Watching",  color:SC.PERCEIVE },
          { key:"PLAN",     label:"Thinking",  color:SC.PLAN     },
          { key:"ACT",      label:"Working",   color:SC.ACT      },
          { key:"REFLECT",  label:"Improving", color:SC.REFLECT  },
        ].map(s => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
            <span style={{ fontSize: 9, color: s.color, fontWeight: 700, fontFamily: "'Outfit',sans-serif", letterSpacing: 0.8 }}>{s.label}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {[...AGENT_LOG].reverse().map((entry, i) => (
          <div key={entry.id} style={{ display: "flex", gap: 12, marginBottom: 14, opacity: entry.done ? 1 : 0.6 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${SC[entry.stage]}18`, border: `1px solid ${SC[entry.stage]}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{entry.icon}</div>
              {i < AGENT_LOG.length - 1 && <div style={{ width: 1, flex: 1, background: `${SC[entry.stage]}20`, marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <Chip label={entry.stage} color={SC[entry.stage]} />
                <span style={{ fontSize: 9, color: G.textMuted, fontFamily: "'Outfit',sans-serif" }}>{entry.ts}</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: entry.done ? G.textPrimary : G.textSec, lineHeight: 1.6, fontFamily: "'Outfit',sans-serif" }}>{entry.text}</p>
              {!entry.done && <div style={{ display: "flex", gap: 4, marginTop: 6 }}>{[0, 1, 2].map(d => <div key={d} style={{ width: 4, height: 4, borderRadius: "50%", background: SC[entry.stage], animation: `pulse ${1 + d * 0.3}s infinite` }} />)}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main app screens (abbreviated — same as V3) ────────────────
const TRANSACTIONS = [
  { id:1, merchant:"Chipotle",       emoji:"🌯", amount:312.40, category:"food",    partner:true,  cashback:3, deals:true,  time:"This month" },
  { id:2, merchant:"Delta Airlines", emoji:"✈️", amount:2940,   category:"travel",  partner:false, cashback:1, deals:true,  time:"This month" },
  { id:3, merchant:"Gymshark",       emoji:"🏋️", amount:487,    category:"fitness", partner:true,  cashback:3, deals:true,  time:"This month" },
  { id:4, merchant:"Sephora",        emoji:"💄", amount:623,    category:"beauty",  partner:true,  cashback:3, deals:true,  time:"This month" },
  { id:5, merchant:"Spotify",        emoji:"🎵", amount:9.99,   category:"music",   partner:true,  cashback:3, deals:false, time:"Apr 24"     },
  { id:6, merchant:"Nike",           emoji:"✓",  amount:289,    category:"fitness", partner:true,  cashback:2, deals:true,  time:"Apr 21"     },
];
const DEAL_ALERTS = [
  { merchant:"Chipotle",       emoji:"🌯", insight:"$312 spend this month — above the $250 brand deal threshold.", action:"Have your manager reach out.", potential:"$5K–$20K",  color:G.yellow },
  { merchant:"Delta Airlines", emoji:"✈️", insight:"$2,940 on Delta. Ambassador-tier spend detected.",             action:"Delta creator program is recruiting.", potential:"$10K–$50K", color:G.blue  },
  { merchant:"Gymshark",       emoji:"🏋️", insight:"$487/mo at Gymshark — you're doing their marketing.",         action:"Let your agency negotiate.",           potential:"$8K–$30K",  color:G.green },
  { merchant:"Sephora",        emoji:"💄", insight:"$623 beauty spend this month. Authentic brand love.",          action:"Sephora Beauty Insider creator program.", potential:"$5K–$25K", color:G.teal },
];
const FRIENDS = [
  { id:1, name:"Kai Styles", handle:"@kaistyles", avatar:"KS", niche:"Gaming · Streaming", challengePct:100, cashback:412, online:true,  sharedBrands:["Gymshark","Chipotle"] },
  { id:2, name:"Mia Chen",   handle:"@miachen",   avatar:"MC", niche:"Beauty · Lifestyle",  challengePct:66,  cashback:289, online:true,  sharedBrands:["Sephora"] },
  { id:3, name:"Trae W.",    handle:"@traewill",  avatar:"TW", niche:"Sports · Fitness",    challengePct:75,  cashback:198, online:false, sharedBrands:["Gymshark","Nike"] },
];
const CHALLENGES = [
  { id:1, title:"Loyalty Stack", emoji:"🔥", desc:"Shop 4 partner brands", target:4, progress:3, reward:"2% bonus" },
  { id:2, title:"Beauty Run",    emoji:"💄", desc:"3 beauty purchases",     target:3, progress:2, reward:"$15 credit" },
  { id:3, title:"Fit Check",     emoji:"🏋️", desc:"2 activewear purchases", target:2, progress:2, reward:"10% off Gymshark" },
];

// ── callNemotron ───────────────────────────────────────────────
async function callNemotron(prompt, apiKey) {
  try {
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "nvidia/llama-3.3-nemotron-super-49b-v1", messages: [{ role: "user", content: prompt }], max_tokens: 140, temperature: 0.72 }),
    });
    const d = await res.json();
    return d.choices?.[0]?.message?.content || null;
  } catch { return null; }
}

function HomeScreen({ onOpenAgent, onGoToDeals }) {
  const total = TRANSACTIONS.reduce((s, t) => s + t.amount, 0);
  const cb    = TRANSACTIONS.reduce((s, t) => s + t.amount * t.cashback / 100, 0);
  return (
    <Scroll>
      <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ borderRadius: 24, padding: "22px 18px", background: G.surface, border: `1px solid ${G.border}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <SectionLabel>April 2026 · Your Money</SectionLabel>
          <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, fontFamily: "'Outfit',sans-serif", lineHeight: 1, marginBottom: 6 }}>
            <GradText>${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</GradText>
          </div>
          <div style={{ fontSize: 12, color: G.textSec, fontFamily: "'Outfit',sans-serif", marginBottom: 18 }}>total tracked spend</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[{ label: "Cashback", value: `$${cb.toFixed(0)}`, color: G.green }, { label: "Pipeline", value: "$78K+", color: G.yellow }, { label: "Partners", value: `${TRANSACTIONS.filter(t => t.partner).length}/${TRANSACTIONS.length}`, color: G.blue }].map(s => (
              <div key={s.label} style={{ background: G.surfaceHigh, borderRadius: 14, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: s.color, fontFamily: "'Outfit',sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: 9, color: G.textMuted, fontFamily: "'Outfit',sans-serif", letterSpacing: 0.6, marginTop: 2 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        <div onClick={onOpenAgent} style={{ borderRadius: 18, padding: "14px", background: G.gradSoft, border: `1px solid ${G.borderGlow}`, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.green, boxShadow: `0 0 8px ${G.green}`, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 10, color: G.green, fontWeight: 700, letterSpacing: 1, fontFamily: "'Outfit',sans-serif" }}>Your deal agent is active · 4 opportunities found</span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: G.textSec, fontFamily: "'Outfit',sans-serif", lineHeight: 1.6 }}>Latest: <span style={{ color: G.textPrimary }}>Confidence score updated — Chipotle 94% → 97%</span></p>
          <div style={{ fontSize: 10, color: G.yellow, fontFamily: "'Outfit',sans-serif", marginTop: 6, fontWeight: 600 }}>See how brandly found these deals →</div>
        </div>

        <div>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>Deal Signals</span>
            <div onClick={onGoToDeals} style={{ cursor: "pointer" }}>
              <GradText style={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>4 live →</GradText>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
            {DEAL_ALERTS.map(d => (
              <div key={d.merchant} style={{ minWidth: 130, flexShrink: 0, background: G.surface, border: `1px solid ${G.border}`, borderRadius: 18, padding: "14px 12px" }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{d.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: G.textPrimary, fontFamily: "'Outfit',sans-serif", marginBottom: 3 }}>{d.merchant}</div>
                <div style={{ fontSize: 10, color: d.color, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{d.potential}</div>
              </div>
            ))}
          </div>
        </div>

        <Card glow>
          <SectionLabel>🤝 Squad Co-Deal Alert</SectionLabel>
          <div style={{ fontSize: 13, color: G.textPrimary, fontFamily: "'Outfit',sans-serif", lineHeight: 1.65, marginBottom: 10 }}>
            You + <span style={{ color: G.yellow, fontWeight: 700 }}>Kai Styles</span> both spend $290+ at Chipotle. A duo pitch could be worth <span style={{ color: G.green, fontWeight: 700 }}>$25K–$60K</span>.
          </div>
          <GradBar pct={72} />
          <div style={{ fontSize: 10, color: G.textMuted, fontFamily: "'Outfit',sans-serif", marginTop: 6 }}>Combined reach: 4.2M · Go to Community →</div>
        </Card>

        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", padding: "10px 16px", borderRadius: 100, background: G.surface, border: `1px solid ${G.border}` }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.green, boxShadow: `0 0 8px ${G.green}` }} />
          <span style={{ fontSize: 12, color: G.textSec, fontFamily: "'Outfit',sans-serif" }}>American Express connected · Syncing live</span>
        </div>
      </div>
    </Scroll>
  );
}

function SpendScreen() {
  const total = TRANSACTIONS.reduce((s, t) => s + t.amount, 0);
  const catMap = {}; TRANSACTIONS.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  const cats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const cc = { food: G.yellow, travel: G.blue, fitness: G.green, beauty: G.teal, music: G.yellow };
  return (
    <Scroll>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel>April · {TRANSACTIONS.length} Transactions</SectionLabel>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: G.textPrimary, fontFamily: "'Outfit',sans-serif", marginBottom: 14 }}>Spend by Category</div>
          {cats.map(([cat, amt]) => (
            <div key={cat} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: G.textSec, fontFamily: "'Outfit',sans-serif", textTransform: "capitalize" }}>{cat}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: cc[cat] || G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>${amt.toLocaleString()}</span>
              </div>
              <GradBar pct={(amt / total) * 100} />
            </div>
          ))}
        </Card>
        {TRANSACTIONS.map(t => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: G.surface, borderRadius: 16, border: `1px solid ${t.deals ? G.borderGlow : G.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: t.partner ? G.gradSoft : G.surfaceHigh, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{t.emoji}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>{t.merchant}</div>
                <div style={{ fontSize: 10, color: G.textMuted, fontFamily: "'Outfit',sans-serif" }}>{t.time} · {t.cashback}% back</div>
                {t.deals && <div style={{ fontSize: 10, color: G.green, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>🤝 Deal signal</div>}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>${t.amount.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: t.cashback === 3 ? G.green : t.cashback === 2 ? G.blue : G.textMuted, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>+${(t.amount * t.cashback / 100).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </Scroll>
  );
}

function DealsScreen({ apiKey, onSaveBrief  }) {
  const [open, setOpen] = useState(null);
  const [briefs, setBriefs] = useState({});
  const [loading, setLoading] = useState({});
  const gen = async (i) => {
    const d = DEAL_ALERTS[i]; setLoading(l => ({ ...l, [i]: true }));
    const r = await callNemotron(`You are brandly. Creator has 2.4M Instagram followers. They spent heavily at ${d.merchant}. Write 3 punchy lines (line breaks): 1) why brand needs this creator 2) what makes pitch unique 3) first outreach step. Direct.`, apiKey);
    setBriefs(b => ({ ...b, [i]: r || `${d.merchant} needs authentic creators with real spend history — your data proves genuine brand love.\n\nYour 2.4M reach at 4.2% engagement puts you in the top 5% for this category.\n\nHave your manager reach out to ${d.merchant.toLowerCase().replace(/\s/g, "")}@partnerships.com with your media kit this week.` }));
    setLoading(l => ({ ...l, [i]: false }));
  };
  return (
    <Scroll>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel>AI-Detected · Brand Opportunities</SectionLabel>
        {DEAL_ALERTS.map((d, i) => (
          <Card key={d.merchant} glow={open === i}>
            <div onClick={() => setOpen(open === i ? null : i)} style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: `${d.color}18`, border: `1px solid ${d.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{d.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>{d.merchant}</span>
                  <Chip label={d.potential} color={d.color} />
                </div>
                <div style={{ fontSize: 12, color: G.textSec, fontFamily: "'Outfit',sans-serif", lineHeight: 1.55 }}>{d.insight}</div>
                <div style={{ fontSize: 11, color: d.color, fontFamily: "'Outfit',sans-serif", marginTop: 5, fontWeight: 600 }}>→ {d.action}</div>
              </div>
            </div>
            {open === i && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${G.border}` }}>
                {!briefs[i] ? <PrimaryBtn onClick={() => gen(i)} disabled={loading[i]}>{loading[i] ? "brandly is thinking…" : "✍️ Write my pitch"}</PrimaryBtn>
                  : <><SectionLabel>Nemotron Pitch Brief</SectionLabel><p style={{ margin: "0 0 12px", fontSize: 12, color: G.textPrimary, lineHeight: 1.75, fontFamily: "'Outfit',sans-serif", whiteSpace: "pre-line" }}>{briefs[i]}</p>
                    <button onClick={() => onSaveBrief({ merchant: d.merchant, brief: briefs[i], confidence: d.potential, date: new Date().toLocaleDateString() })} style={{ width:"100%", padding:"11px", borderRadius:12, background:"transparent", border:`1px solid ${G.borderGlow}`, color:G.green, fontSize:12, fontWeight:700, fontFamily:"'Outfit',sans-serif", cursor:"pointer" }}>💾 Save to my profile</button>
                    <button style={{ width:"100%", padding:"11px", borderRadius:12, background:"transparent", border:`1px solid ${G.border}`, color:G.textMuted, fontSize:12, fontWeight:700, fontFamily:"'Outfit',sans-serif", cursor:"pointer", marginTop:8 }}>📤 Send to my manager</button>
                    </>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </Scroll>
  );
}

function CommunityScreen() {
  const [challenged, setChallenged] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});

  return (
    <Scroll>
      <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Suggested friends */}
        <div style={{ padding:"12px 0" }}>
          <div style={{ fontSize:11, color:G.textMuted, fontFamily:"'Outfit',sans-serif", letterSpacing:1, fontWeight:700, marginBottom:10 }}>PEOPLE YOU MIGHT KNOW</div>
          <div style={{ display:"flex", gap:12, overflowX:"auto" }}>
            {[
              { name:"Zara B.",   avatar:"ZB", niche:"Fashion" },
              { name:"Leo Tran",  avatar:"LT", niche:"Gaming"  },
              { name:"Nia Scott", avatar:"NS", niche:"Beauty"  },
              { name:"Dre Miles", avatar:"DM", niche:"Fitness" },
            ].map(s => (
              <div key={s.name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, flexShrink:0 }}>
                <Avatar initials={s.avatar} size={44} />
                <div style={{ fontSize:10, color:G.textPrimary, fontFamily:"'Outfit',sans-serif", fontWeight:600 }}>{s.name}</div>
                <button style={{ fontSize:9, color:G.green, fontFamily:"'Outfit',sans-serif", fontWeight:700, background:`${G.green}15`, border:`1px solid ${G.green}30`, borderRadius:100, padding:"3px 10px", cursor:"pointer" }}>Add</button>
              </div>
            ))}
          </div>
        </div>

        {FRIENDS.map(f => (
          <div key={f.id} onClick={() => setActiveChat(f)} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 18, padding: "14px", cursor:"pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ position: "relative" }}>
                <Avatar initials={f.avatar} size={42} />
                {f.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: G.green, border: `2px solid ${G.surface}` }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>{f.name}</div>
                <div style={{ fontSize: 10, color: G.textMuted, fontFamily: "'Outfit',sans-serif" }}>{f.handle} · {f.niche}</div>
              </div>
            </div>
            {f.sharedBrands.length > 0 && <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>{f.sharedBrands.map(b => <Chip key={b} label={`🤝 ${b}`} color={G.yellow} />)}</div>}
            <div style={{ background: G.surfaceHigh, borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: G.textSec, fontFamily: "'Outfit',sans-serif" }}>Challenge progress</span>
                <span style={{ fontSize: 11, color: f.challengePct === 100 ? G.green : G.yellow, fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>{f.challengePct}%</span>
              </div>
              <GradBar pct={f.challengePct} h={5} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: G.textSec, fontFamily: "'Outfit',sans-serif" }}>💰 <span style={{ color: G.green, fontWeight: 700 }}>${f.cashback}</span> cashback</div>
              <button
                onClick={e => { e.stopPropagation(); setChallenged(c => c.includes(f.id) ? c : [...c, f.id]); }}
                style={{ fontSize:10, fontFamily:"'Outfit',sans-serif", fontWeight:700, borderRadius:100, padding:"5px 14px", cursor:"pointer", border:"none",
                  background: challenged.includes(f.id) ? `${G.green}25` : `${G.green}15`,
                  color: G.green,
                }}>
                {challenged.includes(f.id) ? "✓ Challenged!" : "Challenge →"}
              </button>
            </div>
          </div>
        ))}

        {/* Chat overlay */}
        {activeChat && (
          <div style={{ position:"fixed", inset:0, zIndex:50, background:G.bg, display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${G.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
              <button onClick={() => setActiveChat(null)} style={{ background:"none", border:"none", color:G.textMuted, cursor:"pointer", fontSize:20 }}>←</button>
              <Avatar initials={activeChat.avatar} size={36} />
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:G.textPrimary, fontFamily:"'Outfit',sans-serif" }}>{activeChat.name}</div>
                <div style={{ fontSize:10, color:G.green, fontFamily:"'Outfit',sans-serif" }}>● Online</div>
              </div>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ background:G.surface, borderRadius:"4px 16px 16px 16px", padding:"10px 14px", maxWidth:"80%", alignSelf:"flex-start" }}>
                <p style={{ margin:0, fontSize:12, color:G.textPrimary, fontFamily:"'Outfit',sans-serif", lineHeight:1.6 }}>
                  Hey! brandly noticed we both spend at {activeChat.sharedBrands?.[0] || "the same brands"} 👀 should we pitch together?
                </p>
              </div>
              {(messages[activeChat.id]||[]).map((m,i) => (
                <div key={i} style={{ background:G.gradSoft, borderRadius:"16px 4px 16px 16px", padding:"10px 14px", maxWidth:"80%", alignSelf:"flex-end" }}>
                  <p style={{ margin:0, fontSize:12, color:G.textPrimary, fontFamily:"'Outfit',sans-serif", lineHeight:1.6 }}>{m}</p>
                </div>
              ))}
            </div>
            <div style={{ padding:"12px 16px", borderTop:`1px solid ${G.border}`, display:"flex", gap:10, flexShrink:0 }}>
              <input value={message} onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if(e.key==="Enter" && message.trim()){ setMessages(m=>({...m,[activeChat.id]:[...(m[activeChat.id]||[]),message.trim()]})); setMessage(""); }}}
                placeholder="Send a message…"
                style={{ flex:1, background:G.surface, border:`1px solid ${G.border}`, borderRadius:100, padding:"10px 16px", color:G.textPrimary, fontSize:12, fontFamily:"'Outfit',sans-serif", outline:"none" }} />
              <button
                onClick={() => { if(message.trim()){ setMessages(m=>({...m,[activeChat.id]:[...(m[activeChat.id]||[]),message.trim()]})); setMessage(""); }}}
                style={{ background:G.grad, border:"none", borderRadius:100, padding:"10px 18px", color:"#060810", fontSize:12, fontWeight:700, fontFamily:"'Outfit',sans-serif", cursor:"pointer" }}>→</button>
            </div>
          </div>
        )}

      </div>
    </Scroll>
  );
}

function ChallengesScreen() {
  return (
    <Scroll>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel>April · Active Challenges</SectionLabel>
        <div style={{ borderRadius: 18, padding: "14px", background: G.gradSoft, border: `1px solid ${G.borderGlow}` }}>
          <div style={{ fontSize: 11, color: G.green, fontWeight: 700, letterSpacing: 1, fontFamily: "'Outfit',sans-serif", marginBottom: 6 }}>🤝 SQUAD CHALLENGE ACTIVE</div>
          <div style={{ fontSize: 13, color: G.textPrimary, fontFamily: "'Outfit',sans-serif", lineHeight: 1.6 }}>You + Kai Styles are both in <strong>Fit Check</strong>. Finish together for a squad bonus.</div>
        </div>
        {CHALLENGES.map(c => {
          const pct = (c.progress / c.target) * 100; const done = pct >= 100;
          return (
            <Card key={c.id} glow={done}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: done ? `${G.green}15` : G.gradSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>{c.title}</span>
                    {done && <Chip label="DONE ✓" color={G.green} />}
                  </div>
                  <div style={{ fontSize: 12, color: G.textSec, fontFamily: "'Outfit',sans-serif" }}>{c.desc}</div>
                </div>
              </div>
              <GradBar pct={pct} h={7} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 11, color: G.textMuted, fontFamily: "'Outfit',sans-serif" }}>{c.progress} of {c.target}</span>
                <span style={{ fontSize: 11, color: done ? G.green : G.yellow, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>🎁 {c.reward}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </Scroll>
  );
}

function ProfileScreen({ savedBriefs = [] }) {
  return (
    <Scroll>
      <div style={{ padding: "8px 16px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Avatar initials="JR" size={72} /></div>
          <div style={{ fontSize: 20, fontWeight: 800, color: G.textPrimary, fontFamily: "'Outfit',sans-serif", letterSpacing: -0.5 }}>Jordan Rivera</div>
          <div style={{ fontSize: 12, color: G.textMuted, fontFamily: "'Outfit',sans-serif", marginBottom: 8 }}>@jordanrivera</div>
          <Chip label="Creator Pro" color={G.green} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
            {[{ label: "Reach", value: "5.1M" }, { label: "Pipeline", value: "$78K+" }, { label: "Badges", value: "3/6" }].map(s => (
              <div key={s.label} style={{ background: G.surfaceHigh, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "'Outfit',sans-serif" }}><GradText>{s.value}</GradText></div>
                <div style={{ fontSize: 9, color: G.textMuted, fontFamily: "'Outfit',sans-serif", letterSpacing: 0.6, marginTop: 2 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </Card>
        {[{ id: "instagram", label: "Instagram", icon: "📸", color: "#E1306C", info: "@jordanrivera · 2.4M · 4.2%", connected: true },
          { id: "tiktok", label: "TikTok", icon: "🎵", color: "#69C9D0", info: "@jordan.rivera · 1.8M · 6.7%", connected: true },
          { id: "youtube", label: "YouTube", icon: "▶️", color: "#FF0000", info: "890K · 3.1%", connected: true },
          { id: "snapchat", label: "Snapchat", icon: "👻", color: "#F9E547", info: "Not connected", connected: false },
          { id: "linkedin", label: "LinkedIn", icon: "💼", color: "#0A66C2", info: "Not connected", connected: false },
        ].map(s => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: G.surface, border: `1px solid ${s.connected ? s.color + "40" : G.border}`, borderRadius: 16 }}>
            <span style={{ fontSize: 22, width: 34, textAlign: "center" }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>{s.label}</div>
              <div style={{ fontSize: 10, color: G.textMuted, fontFamily: "'Outfit',sans-serif" }}>{s.info}</div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Outfit',sans-serif", padding: "5px 12px", borderRadius: 100, background: s.connected ? `${s.color}18` : "transparent", border: `1px solid ${s.connected ? s.color + "50" : G.border}`, color: s.connected ? s.color : G.textMuted }}>
              {s.connected ? "Connected ✓" : "Connect"}
            </div>
          </div>
        ))}
        {/* Saved Pitches */}
        {savedBriefs.length > 0 && (
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:G.textPrimary, fontFamily:"'Outfit',sans-serif", marginBottom:12 }}>My Saved Pitches</div>
            {savedBriefs.map((b, i) => (
              <div key={i} style={{ background:G.surface, border:`1px solid ${G.borderGlow}`, borderRadius:16, padding:"14px", marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:G.textPrimary, fontFamily:"'Outfit',sans-serif" }}>{b.merchant}</span>
                  <Chip label={b.confidence} color={G.green} />
                </div>
                <p style={{ margin:0, fontSize:12, color:G.textSec, lineHeight:1.65, fontFamily:"'Outfit',sans-serif" }}>{b.brief}</p>
                <div style={{ fontSize:10, color:G.textMuted, fontFamily:"'Outfit',sans-serif", marginTop:8 }}>Saved {b.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Scroll>
  );
}


// ── Root ───────────────────────────────────────────────────────
const APP_TABS = [
  { label: "Home",       icon: "⚡" }, { label: "Spend",      icon: "💳" },
  { label: "Deals",      icon: "🤝" }, { label: "Community",  icon: "👥" },
  { label: "Challenges", icon: "🎯" }, { label: "Profile",    icon: "✦"  },
];

// Auth flow stages
const AUTH = { SPLASH:0, EMAIL:1, OTP:2, SOCIAL:3, MEET:4, ONBOARD:5, APP:6 };

export default function BrandlyApp() {
  const [stage, setStage] = useState(AUTH.SPLASH);
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState(0);
  const [showLog, setShowLog] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [savedBriefs, setSavedBriefs] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

const askB = async (question) => {
    setChatInput("");
    setChatMessages(prev => [...prev, { q: question, a: "", loading: true }]);
    
    const context = `You are brandly, an AI deal agent for creators. The creator has: 2.4M Instagram followers (4.2% engagement), 1.8M TikTok followers (6.7% engagement), $4,661 total spend this month, $78K+ deal pipeline, active deals: Chipotle ($312 spend, $5K-$20K potential), Delta Airlines ($2,940 spend, $10K-$50K potential), Gymshark ($487 spend, $8K-$30K potential), Sephora ($623 spend, $5K-$25K potential). Squad friend Kai Styles has overlapping Gymshark and Chipotle spend.

Answer this question in 2-3 sentences max. Be direct, warm, and specific to their actual data. No fluff.

Question: ${question}`;

    try {
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${BRANDLY_NIM_KEY}` },
        body: JSON.stringify({
          model: "nvidia/llama-3.3-nemotron-super-49b-v1",
          messages: [{ role: "user", content: context }],
          max_tokens: 120,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content || "I'm having trouble connecting right now. Try again in a moment.";
      setChatMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, a: answer, loading: false } : m));
    } catch {
      setChatMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, a: "I'm having trouble connecting right now. Try again in a moment.", loading: false } : m));
    }
  };

  const screens = [
    <HomeScreen onOpenAgent={() => setShowLog(true)} onGoToDeals={() => setTab(2)} />,
    <SpendScreen />,
    <DealsScreen apiKey={BRANDLY_NIM_KEY} onSaveBrief={(brief) => setSavedBriefs(b => [...b, brief])} />,
    <CommunityScreen />,
    <ChallengesScreen />,
    <ProfileScreen savedBriefs={savedBriefs} />,
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#03040A", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
      `}</style>

      {/* Phone */}
      <div style={{ width: 375, height: 800, background: G.bg, borderRadius: 48, border: "1.5px solid rgba(255,255,255,0.09)", boxShadow: "0 50px 140px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", animation: "fadeUp 0.5s ease", position: "relative", overflow: "hidden" }}>

        {/* Notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 110, height: 28, background: G.bg, borderRadius: "0 0 18px 18px", zIndex: 10 }} />

        {/* Auth screens */}
        {stage === AUTH.SPLASH  && <SplashScreen onNext={() => setStage(AUTH.EMAIL)} />}
        {stage === AUTH.EMAIL   && <EmailScreen onNext={(e) => { setEmail(e); setStage(AUTH.OTP); }} />}
        {stage === AUTH.OTP     && <OTPScreen email={email} onNext={() => setStage(AUTH.SOCIAL)} />}
        {stage === AUTH.SOCIAL  && <SocialVerifyScreen onNext={() => setStage(AUTH.MEET)} />}
        {stage === AUTH.MEET    && <MeetBrandlyScreen onNext={() => setStage(AUTH.ONBOARD)} />}
        {stage === AUTH.ONBOARD && <OnboardingAgent onComplete={() => setStage(AUTH.APP)} />}

        {/* Main app */}
        {stage === AUTH.APP && (
          <>
            <div style={{ padding: "13px 24px 0", display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>9:41</span>
              <span style={{ fontSize: 12, color: G.textPrimary, fontFamily: "'Outfit',sans-serif" }}>●●● ▲</span>
            </div>
            <div style={{ padding: "10px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PriceTagLogo size={28} />
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Outfit',sans-serif", letterSpacing: -1 }}><GradText>brandly</GradText></div>
                  <div style={{ fontSize: 9, color: G.textMuted, fontFamily: "'Outfit',sans-serif", letterSpacing: 1 }}>CREATOR COMMERCE INTELLIGENCE</div>
                </div>
              </div>
              <button onClick={() => setShowChat(!showChat)} style={{ background: `${G.green}18`, border: `1px solid ${G.green}40`, borderRadius: 20, padding: "6px 14px", fontSize: 10, color: G.green, fontFamily: "'Outfit',sans-serif", fontWeight: 700, cursor: "pointer", letterSpacing: 0.3 }}>
                ⚡ Ask brandly
              </button>
            </div>
            <div style={{ flex: 1, overflow: "hidden", paddingTop: 4, position: "relative" }}>
              {screens[tab]}
              {showLog && <AgentLogOverlay onClose={() => setShowLog(false)} />}
              {showChat && (
                <div style={{ position:"absolute", inset:0, zIndex:40, background:G.bg, display:"flex", flexDirection:"column" }}>
                  <div style={{ padding:"16px 20px", borderBottom:`1px solid ${G.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
                    <button onClick={() => { setShowChat(false); setChatMessages([]); }} style={{ background:"none", border:"none", color:G.textMuted, cursor:"pointer", fontSize:20 }}>←</button>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:G.grad, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✦</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:G.textPrimary, fontFamily:"'Outfit',sans-serif" }}>Ask brandly</div>
                      <div style={{ fontSize:10, color:G.green, fontFamily:"'Outfit',sans-serif" }}>● Your AI deal agent</div>
                    </div>
                  </div>

                  <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
                    {chatMessages.length === 0 && (
                      <>
                        <div style={{ textAlign:"center", marginBottom:8 }}>
                          <div style={{ fontSize:32, marginBottom:12 }}>✦</div>
                          <p style={{ fontSize:14, color:G.textSec, fontFamily:"'Outfit',sans-serif", lineHeight:1.7 }}>How can I help you today?</p>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                          {["Find me a brand deal this week", "Help me write a pitch", "Who should I collab with?", "How's my money working for me?"].map(q => (
                            <button key={q} onClick={() => askB(q)} style={{ padding:"12px 16px", borderRadius:12, background:G.surface, border:`1px solid ${G.border}`, color:G.textPrimary, fontSize:13, fontFamily:"'Outfit',sans-serif", cursor:"pointer", textAlign:"left" }}>{q}</button>
                          ))}
                        </div>
                      </>
                    )}
                    {chatMessages.map((m, i) => (
                      <div key={i} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        <div style={{ background:G.gradSoft, borderRadius:"16px 4px 16px 16px", padding:"10px 14px", maxWidth:"80%", alignSelf:"flex-end" }}>
                          <p style={{ margin:0, fontSize:12, color:G.textPrimary, fontFamily:"'Outfit',sans-serif", lineHeight:1.6 }}>{m.q}</p>
                        </div>
                        <div style={{ background:G.surface, borderRadius:"4px 16px 16px 16px", padding:"10px 14px", maxWidth:"88%", alignSelf:"flex-start", border:`1px solid ${G.borderGlow}` }}>
                          {m.loading
                            ? <div style={{ display:"flex", gap:4 }}>{[0,1,2].map(d => <div key={d} style={{ width:6, height:6, borderRadius:"50%", background:G.green, animation:`pulse ${1+d*0.3}s infinite` }} />)}</div>
                            : <>
                                <div style={{ fontSize:9, color:G.green, fontWeight:700, letterSpacing:1, fontFamily:"'Outfit',sans-serif", marginBottom:4 }}>BRANDLY</div>
                                <p style={{ margin:0, fontSize:12, color:G.textPrimary, fontFamily:"'Outfit',sans-serif", lineHeight:1.65 }}>{m.a}</p>
                              </>
                          }
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding:"12px 16px", borderTop:`1px solid ${G.border}`, display:"flex", gap:10, flexShrink:0 }}>
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => { if(e.key==="Enter" && chatInput.trim()) askB(chatInput.trim()); }}
                      placeholder="Ask anything about your deals…"
                      style={{ flex:1, background:G.surface, border:`1px solid ${G.border}`, borderRadius:100, padding:"10px 16px", color:G.textPrimary, fontSize:12, fontFamily:"'Outfit',sans-serif", outline:"none" }} />
                    <button onClick={() => { if(chatInput.trim()) askB(chatInput.trim()); }}
                      style={{ background:G.grad, border:"none", borderRadius:100, padding:"10px 18px", color:"#060810", fontSize:12, fontWeight:700, fontFamily:"'Outfit',sans-serif", cursor:"pointer" }}>→</button>
                  </div>
                </div>
              )}
            </div>
            {!showLog && <AgentPill onExpand={() => setShowLog(true)} />}
            <div style={{ flexShrink: 0, background: "rgba(6,8,16,0.97)", backdropFilter: "blur(24px)", borderTop: `1px solid ${G.border}`, padding: "8px 2px 20px", display: "flex" }}>
              {APP_TABS.map((t, i) => {
                const active = tab === i;
                return (
                  <button key={t.label} onClick={() => setTab(i)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: active ? G.gradSoft : "transparent", border: active ? `1px solid ${G.borderGlow}` : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.2s" }}>{t.icon}</div>
                    <span style={{ fontSize: 8, fontFamily: "'Outfit',sans-serif", fontWeight: active ? 700 : 400, color: active ? G.green : G.textMuted, letterSpacing: 0.4 }}>{t.label.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 12, right: 14, fontSize: 9, color: "rgba(255,255,255,0.12)", fontFamily: "'Outfit',sans-serif" }}>
        brandly · NVIDIA Inception · Nemotron-49B
      </div>
    </div>
  );
}