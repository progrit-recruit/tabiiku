import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const FOREST = "#1D3D2A";
const LIME   = "#C2E03A";
const CREAM  = "#F5EFE6";
const CREAM2 = "#EDE5D8";
const BORDER = "#E2D9CC";
const MUTED  = "#6B7280";

const destinations = [
  { id: "okinawa",  name: "沖縄",  emoji: "🏝️", tag: "海・自然・歴史",   seed: "okinawa-ocean-tropical" },
  { id: "kyoto",   name: "京都",  emoji: "⛩️", tag: "歴史・工芸・禅",   seed: "kyoto-japanese-temple"  },
  { id: "hokkaido",name: "北海道", emoji: "🌾", tag: "農業・星空・生態系", seed: "hokkaido-nature-field"  },
];

const phases = [
  { href: "/plan",  icon: "📊", label: "旅行前", sub: "AIプランニング" },
  { href: "/trip",  icon: "🗺️", label: "旅行中", sub: "AIガイド・クイズ" },
  { href: "/after", icon: "📝", label: "旅行後", sub: "日記・成長診断" },
];

const testimonials = [
  { name: "田中 さやか", meta: "38歳・小2の娘", text: "京都でAIガイドに質問したら娘が歴史の本を自分で読み始めました！", emoji: "👩‍💼" },
  { name: "佐藤 健太",  meta: "42歳・小5の息子", text: "沖縄で「海洋生物学者になりたい」と言い出した息子。旅育のすごさを実感。", emoji: "👨‍💼" },
  { name: "山田 美咲",  meta: "35歳・年長・小3", text: "持ち物リストも完璧で準備が本当に楽でした！旅育テーマも的確。", emoji: "👩‍⚕️" },
];

export default function HomePage() {
  return (
    <div style={{ paddingBottom: 80, background: CREAM, minHeight: "100vh" }}>

      {/* ── App Bar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#FFFFFF",
          borderBottom: `1px solid ${BORDER}`,
          padding: "0 16px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: FOREST,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ✈️
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: FOREST, lineHeight: 1.1 }}>たびいく！</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 500 }}>家族旅行を一生モノの学びに</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: CREAM2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🔔
          </div>
        </div>
      </div>

      {/* ── Hero Photo Banner ── */}
      <div style={{ position: "relative", height: 230 }}>
        <img
          src="https://picsum.photos/seed/family-travel-nature/430/230"
          alt="旅育"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(29,61,42,0.88) 100%)",
          }}
        />
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: LIME,
              color: FOREST,
              borderRadius: 999,
              padding: "3px 10px",
              fontSize: 10,
              fontWeight: 900,
              marginBottom: 8,
            }}
          >
            🏆 AI旅育コンシェルジュ No.1
          </div>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, margin: "0 0 4px", lineHeight: 1.2 }}>
            旅育を、もっと身近に。
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, margin: "0 0 14px" }}>
            AIが計画・ガイド・記録をまるごとサポート
          </p>
          <Link
            href="/plan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: LIME,
              color: FOREST,
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 13,
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            ✨ 無料でプランを作る →
          </Link>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div style={{ background: FOREST, padding: "12px 20px", display: "flex", justifyContent: "space-around" }}>
        {[["98%", "満足度"], ["3.2h", "準備時間削減"], ["12K+", "利用ファミリー"]].map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ color: LIME, fontSize: 18, fontWeight: 900 }}>{val}</div>
            <div style={{ color: "#A8B8A0", fontSize: 10 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Destination Cards ── */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1A1A1A", margin: 0 }}>📍 旅行先を選ぶ</h2>
          <Link href="/plan" style={{ fontSize: 11, fontWeight: 700, color: FOREST, textDecoration: "none" }}>
            すべて見る →
          </Link>
        </div>

        {/* 上: 沖縄 full width */}
        <Link href="/plan" style={{ textDecoration: "none", display: "block", marginBottom: 10 }}>
          <div style={{ borderRadius: 20, overflow: "hidden", position: "relative" }}>
            <img
              src={`https://picsum.photos/seed/${destinations[0]!.seed}/398/180`}
              alt={destinations[0]!.name}
              style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))" }} />
            <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 22 }}>{destinations[0]!.emoji}</span>
                <span style={{ color: "#fff", fontSize: 18, fontWeight: 900 }}>{destinations[0]!.name}</span>
                <span
                  style={{
                    background: LIME,
                    color: FOREST,
                    fontSize: 9,
                    fontWeight: 900,
                    borderRadius: 999,
                    padding: "2px 8px",
                    marginLeft: "auto",
                  }}
                >
                  人気 No.1
                </span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>{destinations[0]!.tag}</div>
            </div>
          </div>
        </Link>

        {/* 下: 京都 + 北海道 2-col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {destinations.slice(1).map(d => (
            <Link key={d.id} href="/plan" style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: 16, overflow: "hidden", position: "relative" }}>
                <img
                  src={`https://picsum.photos/seed/${d.seed}/200/150`}
                  alt={d.name}
                  style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.72))" }} />
                <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 1 }}>
                    <span style={{ fontSize: 16 }}>{d.emoji}</span>
                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>{d.name}</span>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 9 }}>{d.tag}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 3 Phases ── */}
      <div style={{ padding: "20px 16px 0" }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1A1A1A", margin: "0 0 12px" }}>
          🔄 旅行の「前・中・後」を網羅
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phases.map(p => (
            <Link
              key={p.href}
              href={p.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                background: "#FFFFFF",
                borderRadius: 16,
                border: `1.5px solid ${BORDER}`,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: CREAM2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {p.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#1A1A1A", marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{p.sub}</div>
              </div>
              <div style={{ color: BORDER, fontSize: 18 }}>›</div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div style={{ padding: "20px 16px 0" }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1A1A1A", margin: "0 0 12px" }}>⭐️ 利用ファミリーの声</h2>
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 4,
            scrollbarWidth: "none",
          }}
        >
          {testimonials.map(t => (
            <div
              key={t.name}
              style={{
                minWidth: 260,
                background: "#FFFFFF",
                borderRadius: 18,
                padding: 16,
                border: `1.5px solid ${BORDER}`,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: CREAM2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {t.emoji}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>{t.meta}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, marginBottom: 6 }}>⭐️⭐️⭐️⭐️⭐️</div>
              <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6, margin: 0 }}>"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: "20px 16px 8px" }}>
        <div
          style={{
            background: FOREST,
            borderRadius: 20,
            padding: "20px 16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }} className="float-anim">✈️</div>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.3 }}>
            さあ、最高の旅育体験を<br />始めましょう
          </h2>
          <p style={{ color: "#A8B8A0", fontSize: 12, margin: "0 0 16px" }}>
            チャットで話しかけるだけでAIが完璧なプランを作ります
          </p>
          <Link
            href="/plan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: LIME,
              color: FOREST,
              borderRadius: 999,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            ✨ 無料で旅育プランを作る →
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
