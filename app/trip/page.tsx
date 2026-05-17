"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { destinations, findDestination, guideQAs, quizzes, stampSpots, type StampSpot } from "@/lib/mockData";

const FOREST = "#1D3D2A";
const LIME   = "#C2E03A";
const CREAM  = "#F5EFE6";
const CREAM2 = "#EDE5D8";
const BORDER = "#E2D9CC";
const MUTED  = "#6B7280";

type ChatMsg = { role: "user" | "assistant"; text: string; typing?: boolean; category?: string };

function TypingDots() {
  return (
    <div className="flex gap-1 py-1">
      {[0,1,2].map(i => <span key={i} className="pulse-dot w-2 h-2 rounded-full inline-block" style={{ background: FOREST }} />)}
    </div>
  );
}

const catColors: Record<string, { bg: string; text: string }> = {
  "自然科学":         { bg: "#DCFCE7", text: "#166534" },
  "歴史・文化":       { bg: "#FEF9C3", text: "#713F12" },
  "伝統工芸":         { bg: "#F3E8FF", text: "#6B21A8" },
  "農業科学":         { bg: "#ECFCCB", text: "#3F6212" },
  "天文学":           { bg: "#E0E7FF", text: "#3730A3" },
  "便利ナビ":         { bg: "#DBEAFE", text: "#1E40AF" },
  "スマートリカバリー":{ bg: "#FEE2E2", text: "#991B1B" },
};

function GuideBubble({ msg }: { msg: ChatMsg }) {
  const isAI = msg.role === "assistant";
  const cat = msg.category ? catColors[msg.category] : null;
  return (
    <div className={`chat-bubble flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
      {isAI && (
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-base flex-shrink-0" style={{ background: FOREST }}>
          🧭
        </div>
      )}
      <div className="flex flex-col gap-1 max-w-[75%]">
        {isAI && cat && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full w-fit" style={{ background: cat.bg, color: cat.text }}>
            {msg.category}
          </span>
        )}
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
          style={isAI
            ? { background: "#FFFFFF", border: `1.5px solid ${BORDER}`, color: "#1A1A1A", borderTopLeftRadius: 4 }
            : { background: FOREST, color: "#FFFFFF", borderTopRightRadius: 4 }
          }
        >
          {msg.typing ? <TypingDots /> : msg.text}
        </div>
      </div>
      {!isAI && (
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: CREAM2 }}>
          👤
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz, onAnswer, answered, selectedIdx }: {
  quiz: { question: string; options: string[]; correct: number; explanation: string; emoji: string };
  onAnswer: (i: number) => void;
  answered: boolean;
  selectedIdx: number | null;
}) {
  return (
    <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{quiz.emoji}</span>
        <span className="text-xs font-black px-3 py-1 rounded-full" style={{ background: FOREST, color: LIME }}>
          旅育クイズ
        </span>
      </div>
      <p className="font-black text-base mb-4" style={{ color: "#1A1A1A" }}>{quiz.question}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          let bg = "#FFFFFF", color = "#1A1A1A", border = BORDER;
          if (answered) {
            if (i === quiz.correct)      { bg = LIME;    color = FOREST; border = LIME; }
            else if (i === selectedIdx)  { bg = "#FEE2E2"; color = "#991B1B"; border = "#FCA5A5"; }
            else                         { bg = CREAM;   color = MUTED;  border = BORDER; }
          }
          return (
            <button
              key={opt}
              disabled={answered}
              onClick={() => onAnswer(i)}
              className="w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all"
              style={{ background: bg, color, border: `1.5px solid ${border}` }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3 rounded-2xl p-3 text-sm leading-relaxed" style={{ background: "#EEF8C0", color: FOREST }}>
          <span className="font-black">💡 解説: </span>{quiz.explanation}
        </div>
      )}
    </div>
  );
}

function StampRally({ spots, onCollect }: { spots: StampSpot[]; onCollect: (id: string) => void }) {
  const collected = spots.filter(s => s.collected).length;
  return (
    <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-black" style={{ color: "#1A1A1A" }}>🎮 デジタルスタンプラリー</h3>
          <p className="text-xs" style={{ color: MUTED }}>訪れた場所のスタンプを集めよう！</p>
        </div>
        <span className="px-3 py-1 rounded-full text-sm font-black" style={{ background: FOREST, color: LIME }}>
          {collected} / {spots.length}
        </span>
      </div>
      {collected === spots.length && (
        <div className="mb-4 rounded-2xl p-3 text-center" style={{ background: "#EEF8C0", border: `1.5px solid ${LIME}` }}>
          <p className="text-sm font-black" style={{ color: FOREST }}>🏆 全スタンプ制覇！おめでとう！</p>
        </div>
      )}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {spots.map(s => (
          <button
            key={s.id}
            onClick={() => !s.collected && onCollect(s.id)}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl transition-all"
            style={{
              border: s.collected ? `2px solid ${LIME}` : `2px dashed ${BORDER}`,
              background: s.collected ? "#EEF8C0" : CREAM,
            }}
          >
            <span className={`text-2xl ${s.collected ? "stamp-collected" : "opacity-30"}`}>{s.emoji}</span>
            <span className="text-[9px] text-center leading-tight" style={{ color: MUTED }}>
              {s.name.length > 5 ? s.name.slice(0, 5) + "…" : s.name}
            </span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {spots.map(s => (
          <div key={s.id} className="flex items-center gap-3 rounded-2xl p-3"
            style={{ background: s.collected ? "#EEF8C0" : CREAM, border: `1.5px solid ${s.collected ? LIME : BORDER}` }}>
            <span className="text-2xl">{s.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-sm" style={{ color: "#1A1A1A" }}>{s.name}</div>
              <div className="text-xs" style={{ color: MUTED }}>{s.description}</div>
            </div>
            {s.collected
              ? <span className="text-xs font-black" style={{ color: FOREST }}>✓ 獲得済み</span>
              : <button onClick={() => onCollect(s.id)} className="text-xs font-black px-3 py-1.5 rounded-full" style={{ background: FOREST, color: "#fff" }}>
                  獲得
                </button>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

const SuggestedQs: Record<string, string[]> = {
  okinawa: ["珊瑚礁ってなんでできるの？", "首里城はなぜ赤いの？", "近くにトイレはある？", "急に雨が降ってきた！どうする？"],
  kyoto:   ["金閣寺はなぜ金でできているの？", "西陣織ってなにが特別なの？", "周辺のコンビニはどこ？"],
  hokkaido:["牛乳はどうやって作るの？", "星ってなぜ光るの？", "近くに駐車場はある？"],
};

const tabs = [
  { id: "guide", label: "AIガイド", icon: "🧭" },
  { id: "quiz",  label: "クイズ",   icon: "❓" },
  { id: "stamp", label: "スタンプ", icon: "🎮" },
  { id: "navi",  label: "周辺ナビ", icon: "📍" },
] as const;
type Tab = typeof tabs[number]["id"];

export default function TripPage() {
  const [destInput, setDestInput]   = useState("");
  const [destId, setDestId]         = useState<string | null>(null);
  const [destConfirmed, setDestConfirmed] = useState(false);
  const [messages, setMessages]     = useState<ChatMsg[]>([]);
  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [spots, setSpots]           = useState<StampSpot[]>([]);
  const [quizIdx, setQuizIdx]       = useState(0);
  const [answered, setAnswered]     = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [activeTab, setActiveTab]   = useState<Tab>("guide");
  const bottomRef = useRef<HTMLDivElement>(null);

  const dest   = destinations.find(d => d.id === destId) ?? null;
  const qas    = guideQAs[destId ?? ""] ?? [];
  const qs     = quizzes[destId ?? ""]  ?? [];
  const sqList = SuggestedQs[destId ?? ""] ?? [];

  const confirmDest = (id: string) => {
    const found = destinations.find(d => d.id === id);
    if (!found) return;
    setDestId(id);
    setDestConfirmed(true);
    setSpots(stampSpots[id] ?? []);
    setQuizIdx(0); setAnswered(false); setSelectedOpt(null);
    setMessages([]);
    setTimeout(() => {
      setMessages([{ role: "assistant", text: `${found.emoji} ${found.name}へようこそ！\n\n旅育AIガイドの「たびちゃん」です🧭\n「なぜ？」「どうして？」なんでも聞いてください！` }]);
    }, 300);
  };

  const handleDestInput = () => {
    const found = findDestination(destInput.trim());
    if (found) confirmDest(found.id);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const addTyping = (msg: Omit<ChatMsg, "typing">, delay = 1400) => {
    setMessages(prev => [...prev, { role: "assistant", text: "", typing: true }]);
    setTimeout(() => setMessages(prev => [...prev.slice(0, -1), msg]), delay);
  };

  const handleSend = (q?: string) => {
    const text = (q ?? input).trim();
    if (!text || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);
    const matched = qas.find(qa => qa.question === text);
    setTimeout(() => {
      if (matched) addTyping({ role: "assistant", text: matched.answer, category: matched.category });
      else addTyping({ role: "assistant", text: `「${text}」について調べますね！\n\n${dest?.name}には素晴らしい見どころがたくさんあります 🌟\n\n下の「よくある質問」からも選んでみてください！` });
      setLoading(false);
    }, 300);
  };

  return (
    <div style={{ minHeight: "100vh", background: CREAM, paddingBottom: 96 }}>

      {/* App bar */}
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
          gap: 12,
        }}
      >
        <Link href="/" style={{ textDecoration: "none", fontSize: 20 }}>‹</Link>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#1A1A1A" }}>リアルタイムAIガイド</div>
          <div style={{ fontSize: 10, color: MUTED }}>旅行中サポート</div>
        </div>
        <span style={{ background: FOREST, color: LIME, fontSize: 10, fontWeight: 900, borderRadius: 999, padding: "3px 10px" }}>
          🗺️ 旅行中
        </span>
      </div>

      <div style={{ padding: "16px 16px 0" }}>

        {/* ── 行き先入力（未確定時） ── */}
        {!destConfirmed && (
          <div>
            <div className="bg-white rounded-3xl overflow-hidden mb-4" style={{ border: `1.5px solid ${BORDER}` }}>
              <div style={{ position: "relative", height: 140 }}>
                <img
                  src="https://picsum.photos/seed/japan-travel-guide/400/140"
                  alt="旅行中"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "rgba(29,61,42,0.78)" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>🗺️</div>
                  <div style={{ color: "#fff", fontSize: 16, fontWeight: 900, marginBottom: 4 }}>旅先AIガイドを起動</div>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>旅行先を選ぶとAIガイドが起動します</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-3">
                  <input
                    value={destInput}
                    onChange={e => setDestInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleDestInput()}
                    placeholder="例: 沖縄 / 京都 / 北海道"
                    className="flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none"
                    style={{ background: CREAM, border: `1.5px solid ${BORDER}`, color: "#1A1A1A" }}
                  />
                  <button
                    onClick={handleDestInput}
                    disabled={!destInput.trim()}
                    className="px-5 py-2.5 rounded-full font-black text-sm disabled:opacity-40"
                    style={{ background: FOREST, color: "#fff" }}
                  >
                    決定
                  </button>
                </div>
                <div className="flex gap-2">
                  {destinations.map(d => (
                    <button key={d.id} onClick={() => confirmDest(d.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl text-sm font-bold"
                      style={{ background: CREAM2, color: FOREST, border: `1.5px solid ${BORDER}` }}
                    >
                      {d.emoji} {d.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 行き先確定後：ヘッダー写真 ── */}
        {destConfirmed && dest && (
          <>
            <div className="rounded-2xl overflow-hidden mb-4" style={{ position: "relative" }}>
              <img
                src={`https://picsum.photos/seed/${dest.id}-hero/400/100`}
                alt={dest.name}
                style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(29,61,42,0.75)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{dest.emoji}</span>
                  <div>
                    <div style={{ fontSize: 10, color: LIME, fontWeight: 700 }}>旅行中の行き先</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{dest.prefecture}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#86EFAC" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />
                    <span style={{ fontWeight: 700 }}>接続中</span>
                  </div>
                  <button
                    onClick={() => { setDestConfirmed(false); setDestId(null); setDestInput(""); setMessages([]); }}
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                  >
                    変更
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-2xl mb-4" style={{ background: CREAM2 }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-bold transition-all"
                  style={activeTab === tab.id
                    ? { background: "#FFFFFF", color: FOREST, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }
                    : { background: "transparent", color: MUTED }
                  }
                >
                  <span style={{ fontSize: 16 }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* ─ AIガイド ─ */}
            {activeTab === "guide" && (
              <div className="bg-white rounded-3xl overflow-hidden" style={{ border: `1.5px solid ${BORDER}` }}>
                <div className="h-72 overflow-y-auto p-4 space-y-4" style={{ background: CREAM }}>
                  {messages.map((msg, i) => <GuideBubble key={i} msg={msg} />)}
                  <div ref={bottomRef} />
                </div>
                <div className="px-4 py-3 border-t" style={{ borderColor: BORDER, background: CREAM2 }}>
                  <div className="text-xs font-black mb-2" style={{ color: MUTED }}>💬 よくある質問</div>
                  <div className="flex flex-wrap gap-1.5">
                    {sqList.map(q => (
                      <button key={q} onClick={() => handleSend(q)}
                        className="text-xs font-bold px-3 py-1.5 rounded-full bg-white"
                        style={{ border: `1.5px solid ${BORDER}`, color: FOREST }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3 flex gap-2 border-t bg-white" style={{ borderColor: BORDER }}>
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder="なんでも聞いてください..."
                    className="flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none"
                    style={{ background: CREAM, border: `1.5px solid ${BORDER}`, color: "#1A1A1A" }}
                  />
                  <button onClick={() => handleSend()} disabled={!input.trim() || loading}
                    className="px-5 py-2.5 rounded-full font-black text-sm disabled:opacity-40"
                    style={{ background: FOREST, color: "#fff" }}
                  >
                    送信
                  </button>
                </div>
              </div>
            )}

            {/* ─ クイズ ─ */}
            {activeTab === "quiz" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between" style={{ border: `1.5px solid ${BORDER}` }}>
                  <div>
                    <p className="font-black text-sm" style={{ color: "#1A1A1A" }}>{dest.name} 旅育クイズ</p>
                    <p className="text-xs" style={{ color: MUTED }}>問題 {quizIdx + 1} / {qs.length}</p>
                  </div>
                  <span className="text-3xl">{dest.emoji}</span>
                </div>
                {qs[quizIdx] && (
                  <QuizCard quiz={qs[quizIdx]} onAnswer={i => { setSelectedOpt(i); setAnswered(true); }} answered={answered} selectedIdx={selectedOpt} />
                )}
                {answered && (
                  <button onClick={() => { setQuizIdx(p => (p + 1) % qs.length); setAnswered(false); setSelectedOpt(null); }}
                    className="w-full py-3 rounded-full font-black text-sm"
                    style={{ background: LIME, color: FOREST }}
                  >
                    次の問題へ →
                  </button>
                )}
              </div>
            )}

            {/* ─ スタンプ ─ */}
            {activeTab === "stamp" && (
              <StampRally spots={spots} onCollect={id => setSpots(prev => prev.map(s => s.id === id ? { ...s, collected: true } : s))} />
            )}

            {/* ─ 周辺ナビ ─ */}
            {activeTab === "navi" && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
                  <h3 className="font-black mb-4" style={{ color: "#1A1A1A" }}>📍 子連れ必須設備</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { icon: "🚻", label: "トイレ" },
                      { icon: "🏪", label: "コンビニ" },
                      { icon: "🔒", label: "ロッカー" },
                      { icon: "🚗", label: "駐車場" },
                    ].map(item => (
                      <button key={item.label}
                        className="rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-all"
                        style={{ background: FOREST, color: "#fff" }}
                      >
                        <span className="text-3xl">{item.icon}</span>
                        <span className="text-xs font-black">{item.label}</span>
                        <span className="text-[10px] opacity-70">周辺を検索</span>
                      </button>
                    ))}
                  </div>
                  <div className="rounded-2xl aspect-[16/7] flex items-center justify-center" style={{ background: CREAM2, border: `1.5px solid ${BORDER}` }}>
                    <div className="text-center" style={{ color: MUTED }}>
                      <div className="text-4xl mb-2">🗺️</div>
                      <p className="text-sm font-bold">現在地周辺マップ</p>
                      <p className="text-xs opacity-70">Map API統合予定</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
                  <h3 className="font-black mb-3 flex items-center gap-2" style={{ color: "#1A1A1A" }}>
                    <span>🆘</span> スマートリカバリー
                  </h3>
                  {[
                    { icon: "🌧️", label: "雨が降ってきた", action: "室内代替プランを表示" },
                    { icon: "😷", label: "子どもが体調不良", action: "近くの医療機関を検索" },
                    { icon: "😮", label: "想定外に混んでいる", action: "空いている穴場を提案" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl p-3 mb-2 cursor-pointer hover:opacity-80 transition-all"
                      style={{ background: CREAM, border: `1.5px solid ${BORDER}` }}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-medium" style={{ color: "#1A1A1A" }}>{item.label}</span>
                      </div>
                      <span className="text-xs font-black" style={{ color: FOREST }}>{item.action} →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
