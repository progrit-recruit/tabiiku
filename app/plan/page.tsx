"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { destinations, findDestination, packingList, type Destination, type SubPlan } from "@/lib/mockData";

const FOREST = "#1D3D2A";
const LIME   = "#C2E03A";
const CREAM  = "#F5EFE6";
const CREAM2 = "#EDE5D8";
const BORDER = "#E2D9CC";
const MUTED  = "#6B7280";

type Message = { role: "user" | "assistant"; text: string; typing?: boolean };
type Phase = "basic" | "values" | "style" | "generating" | "plans" | "booked";

const VALUE_GROUPS = [
  { label: "人間性",     icon: "💗", bg: "#FFF5F5", color: "#C0392B",
    values: [{ text: "思いやり", rec: true }, { text: "優しさ", rec: false }, { text: "協調性", rec: false }, { text: "感謝", rec: false }] },
  { label: "行動特性",   icon: "⚡", bg: "#FFFBEB", color: "#B45309",
    values: [{ text: "積極性", rec: true }, { text: "挑戦心", rec: false }, { text: "自主性", rec: false }, { text: "リーダーシップ", rec: false }] },
  { label: "学習・探究", icon: "🔬", bg: "#EFF6FF", color: "#1D4ED8",
    values: [{ text: "好奇心", rec: true }, { text: "探究心", rec: true }, { text: "創造力", rec: false }, { text: "論理的思考", rec: false }] },
  { label: "感性",       icon: "🌿", bg: "#F0FDF4", color: "#15803D",
    values: [{ text: "感受性", rec: false }, { text: "自然を大切にする心", rec: true }, { text: "芸術への興味", rec: false }, { text: "多様性理解", rec: false }] },
] as const;

const PACE_OPTIONS = [
  { label: "ゆっくり過ごしたい", icon: "🌸" },
  { label: "アクティブに動きたい", icon: "⚡" },
  { label: "バランスよく楽しみたい", icon: "⚖️" },
];
const TYPE_OPTIONS = [
  { label: "自然体験中心", icon: "🌿" },
  { label: "歴史・文化中心", icon: "🏯" },
  { label: "食体験中心", icon: "🍱" },
  { label: "学び重視", icon: "📚" },
  { label: "遊び重視", icon: "🎮" },
];
const FAMILY_GOAL_OPTIONS = [
  { label: "親子の会話を増やしたい", icon: "💬" },
  { label: "思い出をたくさん作りたい", icon: "📸" },
  { label: "子どもの自主性を伸ばしたい", icon: "🌱" },
];
const FAMILY_CHIPS = ["父", "母", "子ども×1", "子ども×2", "子ども×3", "祖父母あり"];
const BUDGET_CHIPS = ["〜20万円", "20〜30万円", "30〜40万円", "40万円〜"];

const BASIC_QUESTIONS = [
  "まず、**旅行先**（都道府県）を教えてください。\n例：「沖縄」「京都」「北海道」",
  "旅行の**時期・日数**はいつ頃をご希望ですか？\n例：「8月上旬、3泊4日」",
  "**ご家族の構成**を教えてください。\n下のボタンから選んで「確認する」を押してください。",
  "**お子さんの年齢・学年**を教えてください。\n例：「8歳（小2）と11歳（小5）」",
  "**ご予算の目安**（交通費込みの概算）はいかがですか？",
];

function getAIReason(values: string[], plan: SubPlan): string {
  const matched: string[] = [];
  if (values.some(v => ["探究心", "好奇心", "論理的思考", "創造力"].includes(v)) && /科学|生態|天文|冒険/.test(plan.theme))
    matched.push("探究心・好奇心を育てたいご希望");
  if (values.some(v => ["感受性", "自然を大切にする心"].includes(v)) && /自然|農業|生態/.test(plan.theme))
    matched.push("自然への感受性を大切にしたいご希望");
  if (values.some(v => ["積極性", "挑戦心"].includes(v)) && /冒険|農業|科学/.test(plan.theme))
    matched.push("積極性・挑戦心を伸ばしたいご希望");
  if (values.some(v => ["思いやり", "協調性", "感謝"].includes(v)) && /文化|歴史|工芸|農業/.test(plan.theme))
    matched.push("思いやり・感謝の心を育てたいご希望");
  if (values.some(v => ["芸術への興味", "感受性"].includes(v)) && /工芸|哲学|文化|歴史/.test(plan.theme))
    matched.push("芸術・文化への興味を大切にしたいご希望");
  return matched.length === 0
    ? "ご家族の旅育テーマとライフスタイルをもとに選定"
    : matched.join("・") + "から選定";
}

const STEP_LABELS = ["基本情報", "価値観", "スタイル", "プラン選択", "予約確定"];
function getActiveStep(phase: Phase): number {
  return { basic: 0, values: 1, style: 2, generating: 3, plans: 3, booked: 4 }[phase];
}

// ── Sub-components ──
function TypingDots() {
  return (
    <div className="flex gap-1 py-1">
      {[0,1,2].map(i => <span key={i} className="pulse-dot w-2 h-2 rounded-full inline-block" style={{ background: FOREST }} />)}
    </div>
  );
}

function ChatBubble({ msg }: { msg: Message }) {
  const isAI = msg.role === "assistant";
  return (
    <div className={`chat-bubble flex gap-2.5 ${isAI ? "" : "flex-row-reverse"}`}>
      {isAI && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0" style={{ background: FOREST }}>🤖</div>
      )}
      <div className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
        style={isAI
          ? { background: "#FFF", border: `1.5px solid ${BORDER}`, color: "#1A1A1A", borderTopLeftRadius: 4 }
          : { background: FOREST, color: "#FFF", borderTopRightRadius: 4 }}>
        {msg.typing ? <TypingDots /> : msg.text}
      </div>
      {!isAI && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: CREAM2 }}>👤</div>
      )}
    </div>
  );
}

function SubPlanCard({ plan, selected, onSelect, aiReason }: {
  plan: SubPlan; selected: boolean; onSelect: () => void; aiReason?: string;
}) {
  return (
    <div onClick={onSelect} className="card-hover cursor-pointer rounded-3xl overflow-hidden bg-white"
      style={{ border: selected ? `2.5px solid ${FOREST}` : `1.5px solid ${BORDER}` }}>
      <div style={{ position: "relative", height: 150 }}>
        <img src={`https://picsum.photos/seed/${plan.id}/400/150`} alt={plan.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(29,61,42,0.88))" }} />
        {selected && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-black" style={{ background: LIME, color: FOREST }}>✓ 選択中</div>
        )}
        <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 20 }}>{plan.emoji}</span>
            <span style={{ background: plan.tagColor, color: "#fff", fontSize: 9, fontWeight: 900, borderRadius: 999, padding: "2px 8px" }}>{plan.theme}</span>
          </div>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 900 }}>{plan.title}</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>{plan.subtitle}</div>
        </div>
      </div>

      {aiReason && (
        <div className="px-4 pt-3">
          <div className="rounded-xl px-3 py-2" style={{ background: "#EEF8C0" }}>
            <span className="text-[10px] font-black" style={{ color: FOREST }}>🤖 AI選定理由：</span>
            <span className="text-[10px]" style={{ color: FOREST }}>{aiReason}</span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {[plan.duration, plan.budget, `推奨 ${plan.recommended_age}`].map(t => (
            <span key={t} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: CREAM, color: FOREST }}>{t}</span>
          ))}
        </div>
        <p className="text-xs leading-relaxed mb-3" style={{ color: MUTED }}>{plan.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {plan.educationalThemes.map(t => (
            <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: FOREST, color: LIME }}>{t}</span>
          ))}
        </div>
        <ul className="space-y-1">
          {plan.activities.map(a => (
            <li key={a} className="flex items-start gap-2 text-xs" style={{ color: MUTED }}>
              <span className="font-bold mt-0.5" style={{ color: LIME }}>✓</span>{a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PackingListCard({ destId }: { destId: string }) {
  const common = packingList["common"] ?? [];
  const specific = packingList[destId] ?? [];
  const dest = destinations.find(d => d.id === destId);
  return (
    <div className="rounded-3xl p-5 bg-white" style={{ border: `1.5px solid ${BORDER}` }}>
      <h3 className="text-base font-black mb-4" style={{ color: "#1A1A1A" }}>🎒 持ち物リスト（AI自動生成）</h3>
      <div className="space-y-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: MUTED }}>📦 基本セット</div>
          <ul className="space-y-2">
            {common.map(item => (
              <li key={item} className="flex items-start gap-2 text-xs" style={{ color: "#4B5563" }}>
                <span className="w-4 h-4 rounded border-2 mt-0.5 flex-shrink-0" style={{ borderColor: FOREST }} />{item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: FOREST }}>🌟 {dest?.name} 専用セット</div>
          <ul className="space-y-2">
            {specific.map(item => (
              <li key={item} className="flex items-start gap-2 text-xs" style={{ color: FOREST }}>
                <span className="w-4 h-4 rounded border-2 mt-0.5 flex-shrink-0" style={{ borderColor: LIME, background: "#EEF8C0" }} />{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function PlanPage() {
  const [phase, setPhase]             = useState<Phase>("basic");
  const [messages, setMessages]       = useState<Message[]>([]);
  const [input, setInput]             = useState("");
  const [basicStep, setBasicStep]     = useState(0);
  const [loading, setLoading]         = useState(false);
  const [detectedDest, setDetectedDest] = useState<Destination | null>(null);
  const [familyDraft, setFamilyDraft] = useState<string[]>([]);
  const [selectedValues, setSelectedValues]           = useState<string[]>([]);
  const [selectedPace, setSelectedPace]               = useState("");
  const [selectedTypes, setSelectedTypes]             = useState<string[]>([]);
  const [selectedFamilyGoals, setSelectedFamilyGoals] = useState<string[]>([]);
  const [selectedPlanId, setSelectedPlanId]           = useState<string | null>(null);
  const [booked, setBooked]           = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setMessages([{ role: "assistant", text: "こんにちは！AIコンシェルジュの「たびちゃん」です🌟\n\nお子さんとの旅を、一生モノの学びに変えましょう！\n\n" + BASIC_QUESTIONS[0] }]);
    }, 400);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const addTyping = (text: string, delay = 1100) => {
    setMessages(prev => [...prev, { role: "assistant", text: "", typing: true }]);
    setTimeout(() => setMessages(prev => [...prev.slice(0, -1), { role: "assistant", text }]), delay);
  };

  const handleSend = (textOverride?: string) => {
    const userText = (textOverride ?? input).trim();
    if (!userText || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setLoading(true);
    const nextStep = basicStep + 1;
    setBasicStep(nextStep);

    if (basicStep === 0) {
      const found = findDestination(userText);
      setDetectedDest(found ?? destinations[0]!);
      const ack = found
        ? `${found.emoji} **${found.name}**ですね！素晴らしい選択です 🌟\n\n${BASIC_QUESTIONS[1]}`
        : `了解です！${destinations[0]!.name}で進めますね。\n\n${BASIC_QUESTIONS[1]}`;
      setTimeout(() => { addTyping(ack, 1000); setLoading(false); }, 300);
      return;
    }

    if (nextStep >= 1 && nextStep <= 4) {
      const q = BASIC_QUESTIONS[nextStep] ?? "";
      setTimeout(() => { addTyping(q, 1000); setLoading(false); }, 300);
    }

    if (nextStep >= 5) {
      setTimeout(() => {
        addTyping("ありがとうございます！基本情報を受け取りました ✅\n\n次のステップでは、**お子さんに育てたい力・価値観**を選んでください 🌱", 1100);
        setLoading(false);
      }, 300);
      setTimeout(() => setPhase("values"), 3600);
    }
  };

  const handleFamilyConfirm = () => {
    if (familyDraft.length === 0) return;
    const text = familyDraft.join("・");
    setFamilyDraft([]);
    handleSend(text);
  };

  const toggleArr = (arr: string[], setArr: (f: (p: string[]) => string[]) => void, v: string) =>
    setArr(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const handleValuesConfirm = () => { if (selectedValues.length > 0) setPhase("style"); };
  const handleStyleConfirm  = () => {
    if (!selectedPace) return;
    setPhase("generating");
    setTimeout(() => setPhase("plans"), 2800);
  };

  const selectedSubPlan = detectedDest?.plans.find(p => p.id === selectedPlanId);
  const activeStep = getActiveStep(phase);

  return (
    <div style={{ minHeight: "100vh", background: CREAM, paddingBottom: 96 }}>

      {/* App bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#FFF", borderBottom: `1px solid ${BORDER}`, padding: "0 16px", height: 56, display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/" style={{ textDecoration: "none", fontSize: 22, color: MUTED, lineHeight: 1 }}>‹</Link>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#1A1A1A" }}>AIコンシェルジュ</div>
          <div style={{ fontSize: 10, color: MUTED }}>旅行前プランニング</div>
        </div>
        <span style={{ background: FOREST, color: LIME, fontSize: 10, fontWeight: 900, borderRadius: 999, padding: "3px 10px" }}>📊 旅行前</span>
      </div>

      <div style={{ padding: "14px 16px 0" }}>

        {/* ── Progress Stepper ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", marginBottom: 16 }}>
          {STEP_LABELS.map((label, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: done ? LIME : active ? FOREST : CREAM2,
                    color: done ? FOREST : active ? "#fff" : MUTED,
                    fontSize: 11, fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: active ? FOREST : MUTED, whiteSpace: "nowrap" }}>{label}</div>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div style={{ width: 18, height: 2, background: i < activeStep ? LIME : BORDER, margin: "0 3px", marginBottom: 14 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── PHASE: BASIC (chat) ── */}
        {phase === "basic" && (
          <div className="bg-white rounded-3xl overflow-hidden" style={{ border: `1.5px solid ${BORDER}` }}>
            <div className="h-72 overflow-y-auto p-4 space-y-3" style={{ background: CREAM }}>
              {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
              <div ref={bottomRef} />
            </div>

            {/* Step 0: destination chips */}
            {basicStep === 0 && (
              <div className="px-4 py-3 border-t flex flex-wrap gap-2" style={{ borderColor: BORDER, background: CREAM2 }}>
                <div className="text-xs font-black w-full mb-1" style={{ color: MUTED }}>🗾 クイック選択</div>
                {destinations.map(d => (
                  <button key={d.id} onClick={() => handleSend(d.name)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-white"
                    style={{ border: `1.5px solid ${BORDER}`, color: FOREST }}>
                    {d.emoji} {d.name}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: family chips */}
            {basicStep === 2 && (
              <div className="px-4 py-3 border-t" style={{ borderColor: BORDER, background: CREAM2 }}>
                <div className="text-xs font-black mb-2" style={{ color: MUTED }}>👨‍👩‍👧‍👦 家族構成を選んでください</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {FAMILY_CHIPS.map(chip => {
                    const on = familyDraft.includes(chip);
                    return (
                      <button key={chip}
                        onClick={() => setFamilyDraft(prev => on ? prev.filter(x => x !== chip) : [...prev, chip])}
                        className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                        style={{ background: on ? FOREST : "#fff", color: on ? "#fff" : FOREST, border: `1.5px solid ${on ? FOREST : BORDER}` }}>
                        {chip}
                      </button>
                    );
                  })}
                </div>
                {familyDraft.length > 0 && (
                  <button onClick={handleFamilyConfirm}
                    className="px-4 py-2 rounded-full font-black text-xs"
                    style={{ background: LIME, color: FOREST }}>
                    確認する（{familyDraft.join("・")}）→
                  </button>
                )}
              </div>
            )}

            {/* Step 4: budget chips */}
            {basicStep === 4 && (
              <div className="px-4 py-3 border-t flex flex-wrap gap-2" style={{ borderColor: BORDER, background: CREAM2 }}>
                <div className="text-xs font-black w-full mb-1" style={{ color: MUTED }}>💰 予算の目安</div>
                {BUDGET_CHIPS.map(b => (
                  <button key={b} onClick={() => handleSend(b)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-white"
                    style={{ border: `1.5px solid ${BORDER}`, color: FOREST }}>
                    {b}
                  </button>
                ))}
              </div>
            )}

            {/* Text input — hide for family step and after all done */}
            {basicStep !== 2 && basicStep < 5 && (
              <div className="p-3 border-t bg-white flex gap-2" style={{ borderColor: BORDER }}>
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder={
                    basicStep === 0 ? "例: 沖縄 / 京都 / 北海道"
                    : basicStep === 1 ? "例: 8月上旬、3泊4日"
                    : basicStep === 3 ? "例: 8歳（小2）と11歳（小5）"
                    : "入力してください"
                  }
                  className="flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none"
                  style={{ background: CREAM, border: `1.5px solid ${BORDER}`, color: "#1A1A1A" }} />
                <button onClick={() => handleSend()} disabled={!input.trim() || loading}
                  className="px-5 py-2.5 rounded-full font-black text-sm disabled:opacity-40"
                  style={{ background: FOREST, color: "#fff" }}>
                  送信
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE: VALUES ── */}
        {phase === "values" && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-base font-black mb-1" style={{ color: "#1A1A1A" }}>💡 育てたい力・価値観を選んでください</div>
              <div className="text-xs" style={{ color: MUTED }}>
                複数選択できます（おすすめ：3〜5個）
                {selectedValues.length > 0 && <span className="font-black" style={{ color: FOREST }}> · {selectedValues.length}個選択中</span>}
              </div>
            </div>

            {VALUE_GROUPS.map(group => (
              <div key={group.label} className="bg-white rounded-2xl p-4" style={{ border: `1.5px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 16 }}>{group.icon}</span>
                  <span className="text-sm font-black" style={{ color: "#1A1A1A" }}>{group.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.values.map(v => {
                    const on = selectedValues.includes(v.text);
                    return (
                      <div key={v.text} style={{ position: "relative" }}>
                        <button
                          onClick={() => toggleArr(selectedValues, setSelectedValues, v.text)}
                          className="text-sm font-bold px-3 py-2 rounded-2xl transition-all"
                          style={{ background: on ? FOREST : group.bg, color: on ? "#fff" : group.color, border: `1.5px solid ${on ? FOREST : "transparent"}` }}>
                          {v.text}
                        </button>
                        {v.rec && (
                          <div style={{ position: "absolute", top: -7, right: -4, background: LIME, color: FOREST, fontSize: 8, fontWeight: 900, borderRadius: 999, padding: "1px 5px", whiteSpace: "nowrap" }}>
                            人気
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <button onClick={handleValuesConfirm} disabled={selectedValues.length === 0}
              className="w-full py-4 rounded-full font-black text-sm disabled:opacity-40"
              style={{ background: selectedValues.length > 0 ? LIME : CREAM2, color: selectedValues.length > 0 ? FOREST : MUTED }}>
              {selectedValues.length === 0
                ? "価値観を1つ以上選んでください"
                : `「${selectedValues.slice(0, 2).join("・")}」などでプランを作る →`}
            </button>
          </div>
        )}

        {/* ── PHASE: STYLE ── */}
        {phase === "style" && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-base font-black mb-1" style={{ color: "#1A1A1A" }}>🌈 どんな旅にしたいですか？</div>
              <div className="text-xs" style={{ color: MUTED }}>旅のスタイルをお聞かせください</div>
            </div>

            {/* Pace — single select */}
            <div className="bg-white rounded-2xl p-4" style={{ border: `1.5px solid ${BORDER}` }}>
              <div className="text-sm font-black mb-3" style={{ color: "#1A1A1A" }}>① 旅のペース <span className="text-xs font-medium text-red-500">必須</span></div>
              <div className="flex flex-col gap-2">
                {PACE_OPTIONS.map(opt => {
                  const on = selectedPace === opt.label;
                  return (
                    <button key={opt.label} onClick={() => setSelectedPace(opt.label)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all"
                      style={{ background: on ? FOREST : CREAM, color: on ? "#fff" : "#1A1A1A", border: `1.5px solid ${on ? FOREST : BORDER}` }}>
                      <span style={{ fontSize: 20 }}>{opt.icon}</span>{opt.label}
                      {on && <span className="ml-auto text-xs" style={{ color: LIME }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Type — multi select */}
            <div className="bg-white rounded-2xl p-4" style={{ border: `1.5px solid ${BORDER}` }}>
              <div className="text-sm font-black mb-3" style={{ color: "#1A1A1A" }}>② 体験タイプ（複数選択可）</div>
              <div className="flex flex-wrap gap-2">
                {TYPE_OPTIONS.map(opt => {
                  const on = selectedTypes.includes(opt.label);
                  return (
                    <button key={opt.label} onClick={() => toggleArr(selectedTypes, setSelectedTypes, opt.label)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all"
                      style={{ background: on ? LIME : CREAM, color: on ? FOREST : "#4B5563", border: `1.5px solid ${on ? LIME : BORDER}` }}>
                      {opt.icon} {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Family goal — multi select */}
            <div className="bg-white rounded-2xl p-4" style={{ border: `1.5px solid ${BORDER}` }}>
              <div className="text-sm font-black mb-3" style={{ color: "#1A1A1A" }}>③ 家族時間の目的（複数選択可）</div>
              <div className="flex flex-col gap-2">
                {FAMILY_GOAL_OPTIONS.map(opt => {
                  const on = selectedFamilyGoals.includes(opt.label);
                  return (
                    <button key={opt.label} onClick={() => toggleArr(selectedFamilyGoals, setSelectedFamilyGoals, opt.label)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all"
                      style={{ background: on ? "#EEF8C0" : CREAM, color: on ? FOREST : "#1A1A1A", border: `1.5px solid ${on ? LIME : BORDER}` }}>
                      <span style={{ fontSize: 20 }}>{opt.icon}</span>{opt.label}
                      {on && <span className="ml-auto text-xs font-black" style={{ color: FOREST }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={handleStyleConfirm} disabled={!selectedPace}
              className="w-full py-4 rounded-full font-black text-sm disabled:opacity-40"
              style={{ background: selectedPace ? LIME : CREAM2, color: selectedPace ? FOREST : MUTED }}>
              {selectedPace ? "このスタイルでプランを生成する →" : "旅のペースを選んでください"}
            </button>
          </div>
        )}

        {/* ── PHASE: GENERATING ── */}
        {phase === "generating" && (
          <div className="bg-white rounded-3xl p-8 text-center" style={{ border: `1.5px solid ${BORDER}` }}>
            <div className="text-5xl mb-5 float-anim">✨</div>
            <h2 className="text-base font-black mb-2" style={{ color: "#1A1A1A" }}>
              あなたの家族に合う旅を<br />見つけています...
            </h2>
            <p className="text-xs mb-5" style={{ color: MUTED }}>家族構成・価値観・旅のスタイルを総合的に分析中</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {selectedValues.map(v => (
                <span key={v} className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: FOREST, color: LIME }}>{v}</span>
              ))}
              {selectedPace && (
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: CREAM2, color: FOREST }}>{selectedPace}</span>
              )}
            </div>
            <div className="flex justify-center gap-2">
              {[0,1,2,3].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full pulse-dot" style={{ background: LIME, animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── PHASE: PLANS ── */}
        {phase === "plans" && detectedDest && !booked && (
          <div className="space-y-4">
            {/* Destination banner */}
            <div style={{ position: "relative", borderRadius: 20, overflow: "hidden" }}>
              <img src={`https://picsum.photos/seed/${detectedDest.id}-hero/400/110`} alt={detectedDest.name}
                style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(29,61,42,0.82)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
                <span style={{ fontSize: 36 }}>{detectedDest.emoji}</span>
                <div>
                  <div style={{ fontSize: 10, color: LIME, fontWeight: 700, marginBottom: 2 }}>AI厳選プラン</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{detectedDest.name}の旅育プラン</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>
                    {selectedValues.slice(0, 3).join("・")} をもとに3案を厳選
                  </div>
                </div>
              </div>
            </div>

            {/* AI overall comment */}
            <div className="rounded-2xl p-4" style={{ background: "#EEF8C0", border: `1.5px solid ${LIME}` }}>
              <div className="text-xs font-black mb-1" style={{ color: FOREST }}>🤖 たびちゃんからのコメント</div>
              <p className="text-xs leading-relaxed" style={{ color: FOREST }}>
                「{selectedValues.slice(0, 2).join("・")}」を育てたいご希望と
                「{selectedPace}」というスタイルをもとに、{detectedDest.name}の特性を活かした3プランを厳選しました。
              </p>
            </div>

            {/* 3 plan cards */}
            <div className="space-y-4">
              {detectedDest.plans.map(p => (
                <SubPlanCard key={p.id} plan={p}
                  selected={selectedPlanId === p.id}
                  onSelect={() => setSelectedPlanId(p.id)}
                  aiReason={getAIReason(selectedValues, p)} />
              ))}
            </div>

            {/* Selected plan detail */}
            {selectedPlanId && selectedSubPlan && (
              <div className="bg-white rounded-3xl p-5 space-y-4" style={{ border: `1.5px solid ${BORDER}` }}>
                <h3 className="font-black text-base" style={{ color: "#1A1A1A" }}>📋 「{selectedSubPlan.title}」ハイライト</h3>
                <ul className="space-y-1.5">
                  {selectedSubPlan.highlights.map(h => (
                    <li key={h} className="flex items-start gap-2 text-sm" style={{ color: "#4B5563" }}>
                      <span className="font-bold" style={{ color: LIME }}>★</span>{h}
                    </li>
                  ))}
                </ul>
                <div className="rounded-2xl aspect-video flex items-center justify-center" style={{ background: FOREST }}>
                  <div className="text-center text-white">
                    <div className="text-3xl mb-1">▶️</div>
                    <div className="text-xs opacity-70">{selectedSubPlan.videoLabel}</div>
                  </div>
                </div>
                <button onClick={() => setBooked(true)}
                  className="w-full py-4 rounded-full text-base font-black"
                  style={{ background: LIME, color: FOREST }}>
                  🎉 このプランを予約確定する →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE: BOOKED ── */}
        {booked && detectedDest && selectedSubPlan && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl overflow-hidden" style={{ border: `2px solid ${LIME}` }}>
              <div style={{ position: "relative", height: 150 }}>
                <img src={`https://picsum.photos/seed/${selectedSubPlan.id}/400/150`} alt={selectedSubPlan.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(29,61,42,0.75)" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 40 }}>🎉</div>
                  <div style={{ color: "#fff", fontSize: 18, fontWeight: 900, marginTop: 4 }}>予約完了！</div>
                </div>
              </div>
              <div className="p-5 text-center">
                <p className="text-sm mb-4" style={{ color: MUTED }}>
                  {detectedDest.name}「{selectedSubPlan.title}」{selectedSubPlan.duration}のプランが確定しました。
                </p>
                <div className="flex justify-center gap-3 mb-5 flex-wrap">
                  {[["行き先", detectedDest.name], ["期間", selectedSubPlan.duration], ["予算", selectedSubPlan.budget]].map(([l, v]) => (
                    <div key={l} className="rounded-2xl p-3 text-center" style={{ background: CREAM, minWidth: 80 }}>
                      <div className="text-xs mb-1" style={{ color: MUTED }}>{l}</div>
                      <div className="font-black text-sm" style={{ color: FOREST }}>{v}</div>
                    </div>
                  ))}
                </div>
                <Link href="/trip" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm"
                  style={{ background: FOREST, color: "#fff" }}>
                  🗺️ 旅行中ガイドへ →
                </Link>
              </div>
            </div>
            <PackingListCard destId={detectedDest.id} />
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
