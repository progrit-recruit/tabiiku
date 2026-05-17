"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { destinations, growthQuestions, nextRecommendation } from "@/lib/mockData";

const FOREST = "#1D3D2A";
const LIME   = "#C2E03A";
const CREAM  = "#F5EFE6";
const CREAM2 = "#EDE5D8";
const BORDER = "#E2D9CC";
const MUTED  = "#6B7280";

const DIARY: Record<string, string> = {
  okinawa: `【沖縄旅行記】
■ 旅行期間: 2026年8月3日〜8月6日（3泊4日）
■ 行き先: 沖縄県

【一番印象に残ったこと】
美ら海水族館でジンベエザメを初めて見ました。体長8メートルもあるのに、小さな魚と一緒に泳いでいるのが不思議でした。

【学んだこと】
珊瑚礁は「珊瑚虫」という小さな生き物が何百年もかけて作ったものだと知りました。シュノーケリングで本物の珊瑚を見て、環境を大切にしなければいけないと思いました。

【感想】
沖縄の海はとても透き通っていて、色とりどりの魚がたくさんいました。帰ったら海の生き物についてもっと調べてみたいです。海洋生物学者になりたいと思いました。`,
  kyoto: `【京都旅行記】
■ 旅行期間: 2026年10月11日〜10月13日（2泊3日）
■ 行き先: 京都府

【一番印象に残ったこと】
金閣寺の金箔がまばゆいほど光っていて、本物の「ぜいたく」を感じました。銀閣寺と比べると全然違う雰囲気で驚きました。

【体験したこと】
西陣織の機織り体験では、1センチを織るのに何分もかかりました。職人さんが毎日これをやっているのが信じられないほど大変でした。

【感想】
京都には1100年間の歴史がつまっていることを知りました。教科書で読んだ「平安京」が実際にあった場所だと分かり、歴史の勉強が楽しくなりました。`,
  hokkaido: `【北海道旅行記】
■ 旅行期間: 2026年7月19日〜7月22日（3泊4日）
■ 行き先: 北海道

【一番印象に残ったこと】
天文台で見た星空！東京では見えない天の川が肉眼で見えて、「本当に宇宙なんだ」と実感しました。

【農業体験で学んだこと】
牛のお乳を搾るのを初めてやりました。1頭の牛が毎日20リットルも乳を出すと知って驚きました。

【感想】
北海道の自然の大きさに圧倒されました。知床でヒグマの足跡を見たとき、自然の中で生き物が生きていることを強く感じました。`,
};

// Photo seeds for album: one per destination
const ALBUM_SEEDS: Record<string, { seed: string; caption: string }[]> = {
  okinawa: [
    { seed: "okinawa-aquarium",   caption: "美ら海水族館のジンベエザメ！" },
    { seed: "okinawa-castle",     caption: "首里城。建物がすごく大きかった" },
    { seed: "okinawa-snorkel",    caption: "シュノーケリング。珊瑚礁がきれい" },
    { seed: "okinawa-salt",       caption: "塩作り体験。海水から塩ができる！" },
    { seed: "okinawa-beach-sand", caption: "ハテの浜。砂浜が真っ白だった" },
    { seed: "okinawa-family-pic", caption: "最終日みんなで記念撮影！" },
  ],
  kyoto: [
    { seed: "kyoto-golden",       caption: "金閣寺。金色が本当にまぶしかった" },
    { seed: "kyoto-bamboo",       caption: "嵐山の竹林。とても静かだった" },
    { seed: "kyoto-weaving",      caption: "西陣織体験。すごく難しかった！" },
    { seed: "kyoto-torii",        caption: "伏見稲荷の千本鳥居" },
    { seed: "kyoto-tea",          caption: "茶道体験。お抹茶が美味しかった" },
    { seed: "kyoto-sunset",       caption: "清水寺から見た夕焼け" },
  ],
  hokkaido: [
    { seed: "hokkaido-stars",     caption: "天文台で見た星空。天の川が見えた！" },
    { seed: "hokkaido-cows",      caption: "乳しぼり体験。本当に出た！" },
    { seed: "hokkaido-corn",      caption: "トウモロコシ収穫。甘くて最高" },
    { seed: "hokkaido-bear",      caption: "知床のヒグマ観察ツアー" },
    { seed: "hokkaido-lavender",  caption: "富良野のラベンダー農園" },
    { seed: "hokkaido-family",    caption: "大自然の中で家族みんな笑顔！" },
  ],
};

type Answers = Record<string, string>;

function GrowthBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium" style={{ color: "#1A1A1A" }}>{label}</span>
        <span className="font-black" style={{ color: FOREST }}>{score}pt</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: CREAM2 }}>
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

const tabs = [
  { id: "diary",  label: "📓 日記" },
  { id: "album",  label: "📸 アルバム" },
  { id: "growth", label: "📈 成長診断" },
] as const;
type Tab = typeof tabs[number]["id"];

export default function AfterPage() {
  const [planId, setPlanId] = useState("okinawa");
  const [activeTab, setActiveTab] = useState<Tab>("diary");
  const [answers, setAnswers] = useState<Answers>({});
  const [growthDone, setGrowthDone] = useState(false);
  const [diaryGen, setDiaryGen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const plan = destinations.find(p => p.id === planId)!;
  const diary = DIARY[planId] ?? "";
  const albumPhotos = ALBUM_SEEDS[planId] ?? [];

  const allAnswered = growthQuestions.every(q => answers[q.id]);
  const nextRec = nextRecommendation[answers["g4"] ?? ""] ?? "次回の旅育プランを準備中...";

  const growthScores = [
    { label: "好奇心",  score: answers["g2"] === "たくさんあった（5回以上）" ? 100 : 70,  color: LIME },
    { label: "積極性",  score: answers["g3"] === "積極性が上がった" ? 100 : 72,             color: "#60A5FA" },
    { label: "探究心",  score: answers["g3"] === "本や図鑑を読み始めた" ? 100 : 65,         color: "#A78BFA" },
    { label: "感謝力",  score: answers["g3"] === "感謝の言葉が増えた" ? 100 : 60,           color: "#34D399" },
    { label: "表現力",  score: answers["g3"] === "友達に話したがっている" ? 95 : 70,        color: "#F97316" },
  ];

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
          <div style={{ fontSize: 15, fontWeight: 900, color: "#1A1A1A" }}>思い出を資産に変える</div>
          <div style={{ fontSize: 10, color: MUTED }}>旅行後の記録・成長診断</div>
        </div>
        <span style={{ background: FOREST, color: LIME, fontSize: 10, fontWeight: 900, borderRadius: 999, padding: "3px 10px" }}>
          📝 旅行後
        </span>
      </div>

      {/* Hero photo */}
      <div style={{ position: "relative", height: 130 }}>
        <img
          src={`https://picsum.photos/seed/${planId}-after-hero/430/130`}
          alt={plan.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(29,61,42,0.75)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 20px", gap: 14 }}>
          <span style={{ fontSize: 36 }}>{plan.emoji}</span>
          <div>
            <div style={{ color: LIME, fontSize: 10, fontWeight: 700, marginBottom: 2 }}>旅育レポート</div>
            <div style={{ color: "#fff", fontSize: 18, fontWeight: 900 }}>{plan.name}の旅</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>

        {/* Destination selector */}
        <div className="flex gap-2 mb-4">
          {destinations.map(p => (
            <button key={p.id} onClick={() => { setPlanId(p.id); setDiaryGen(false); setGrowthDone(false); setAnswers({}); }}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl text-sm font-bold transition-all"
              style={planId === p.id
                ? { background: FOREST, color: "#fff" }
                : { background: "#fff", color: MUTED, border: `1.5px solid ${BORDER}` }
              }
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl mb-4" style={{ background: CREAM2 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={activeTab === tab.id
                ? { background: "#FFFFFF", color: FOREST, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }
                : { background: "transparent", color: MUTED }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─ 日記 ─ */}
        {activeTab === "diary" && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-black mb-1" style={{ color: "#1A1A1A" }}>{plan.emoji} {plan.name} 旅行日記</h2>
                  <p className="text-xs" style={{ color: MUTED }}>学校提出・自由研究対応</p>
                </div>
                <span className="text-xs font-black px-2 py-1 rounded-full" style={{ background: FOREST, color: LIME }}>
                  学校提出OK
                </span>
              </div>

              {!diaryGen ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4 float-anim">📝</div>
                  <p className="font-medium mb-1 text-sm" style={{ color: "#1A1A1A" }}>旅の体験をもとに日記を自動生成</p>
                  <p className="text-xs mb-6" style={{ color: MUTED }}>実際のアプリでは旅行中の記録から生成されます</p>
                  <button
                    onClick={() => { setGenerating(true); setTimeout(() => { setGenerating(false); setDiaryGen(true); }, 2000); }}
                    disabled={generating}
                    className="px-7 py-3 rounded-full font-black disabled:opacity-50"
                    style={{ background: LIME, color: FOREST }}
                  >
                    {generating ? "⏳ AI生成中..." : "✨ AIで日記を自動生成する"}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="rounded-2xl p-4 mb-4" style={{ background: CREAM, border: `1.5px solid ${BORDER}` }}>
                    <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "#1A1A1A" }}>{diary}</pre>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[["📄 PDFで保存", FOREST, "#fff"], ["🖨️ 印刷する", LIME, FOREST], ["✏️ 編集する", "#fff", FOREST]].map(([label, bg, color]) => (
                      <button key={label} className="px-4 py-2 rounded-full text-sm font-bold"
                        style={{ background: bg, color, border: bg === "#fff" ? `1.5px solid ${BORDER}` : undefined }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
              <h3 className="font-black mb-2 text-sm" style={{ color: "#1A1A1A" }}>🔬 自由研究に発展させる</h3>
              <div className="space-y-2">
                {[
                  ["🪸", "珊瑚礁の生態系レポート",      "小学生〜中学生"],
                  ["⛩️", "琉球文化と日本史の比較",       "小学生〜"],
                  ["🌊", "海洋プラスチック問題",          "中学生〜"],
                  ["📊", "気候変動と珊瑚の白化",         "中学生〜高校生"],
                ].map(([icon, title, level]) => (
                  <div key={title} className="flex items-center gap-3 rounded-2xl p-3 cursor-pointer hover:opacity-80"
                    style={{ background: CREAM, border: `1.5px solid ${BORDER}` }}>
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ color: "#1A1A1A" }}>{title}</div>
                      <div className="text-xs" style={{ color: MUTED }}>{level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─ アルバム ─ */}
        {activeTab === "album" && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-black mb-0.5" style={{ color: "#1A1A1A" }}>{plan.emoji} エモーショナル・アルバム</h2>
                  <p className="text-xs" style={{ color: MUTED }}>{plan.name}の思い出を永久保存</p>
                </div>
                <div className="text-right">
                  <div className="font-black text-xl" style={{ color: FOREST }}>6</div>
                  <div className="text-xs" style={{ color: MUTED }}>枚</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {albumPhotos.map((photo, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-all"
                    style={{ position: "relative", aspectRatio: "1" }}
                  >
                    <img
                      src={`https://picsum.photos/seed/${photo.seed}/200/200`}
                      alt={photo.caption}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6))" }} />
                    <div style={{ position: "absolute", bottom: 4, left: 4, right: 4 }}>
                      <p style={{ color: "#fff", fontSize: 8, lineHeight: 1.3, fontWeight: 600 }}>{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: "🎬", label: "Vlog動画", sub: "60秒" },
                  { icon: "📱", label: "SNSスライド", sub: "インスタ対応" },
                  { icon: "📖", label: "フォトブック", sub: "A5 / 24P" },
                ].map(opt => (
                  <button key={opt.label}
                    className="rounded-2xl p-3 text-center hover:opacity-80 transition-all"
                    style={{ background: FOREST, color: "#fff" }}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <div className="text-xs font-black">{opt.label}</div>
                    <div className="text-[10px] opacity-70">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
              <h3 className="font-black mb-4 text-sm" style={{ color: "#1A1A1A" }}>🎞️ 思い出タイムライン</h3>
              <div className="space-y-3">
                {[
                  { day: "1日目", events: ["空港到着・ホテルチェックイン", "那覇国際通り散策", "沖縄料理で夕食"], emoji: "🛫" },
                  { day: "2日目", events: ["美ら海水族館・学習プログラム", "シュノーケリング体験", "塩作りワークショップ"], emoji: "🐠" },
                  { day: "3日目", events: ["首里城見学・スタンプラリー", "琉球ガラス工房体験", "ビーチサイドBBQ"], emoji: "⛩️" },
                  { day: "4日目", events: ["朝食バイキング", "お土産購入", "帰路"], emoji: "🏠" },
                ].map(d => (
                  <div key={d.day} className="flex gap-3 rounded-2xl p-3" style={{ background: CREAM, border: `1.5px solid ${BORDER}` }}>
                    <div className="text-center flex-shrink-0">
                      <div className="text-xl">{d.emoji}</div>
                      <div className="text-xs font-black mt-1" style={{ color: FOREST }}>{d.day}</div>
                    </div>
                    <ul className="space-y-1">
                      {d.events.map(e => (
                        <li key={e} className="text-xs flex items-start gap-1.5" style={{ color: MUTED }}>
                          <span style={{ color: LIME }} className="font-bold mt-0.5">•</span>{e}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─ 成長診断 ─ */}
        {activeTab === "growth" && (
          <div className="space-y-4">
            {!growthDone ? (
              <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
                <h2 className="text-base font-black mb-1" style={{ color: "#1A1A1A" }}>📈 子どもの成長診断</h2>
                <p className="text-xs mb-5" style={{ color: MUTED }}>旅行後の変化を記録して、お子さんの興味・強みを可視化します</p>
                <div className="space-y-5">
                  {growthQuestions.map(q => (
                    <div key={q.id} className="border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: BORDER }}>
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: FOREST, color: LIME }}>
                          {q.category}
                        </span>
                        <p className="text-sm font-bold" style={{ color: "#1A1A1A" }}>{q.question}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map(opt => (
                          <button key={opt} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className="text-left px-3 py-2.5 rounded-2xl text-xs font-medium transition-all"
                            style={answers[q.id] === opt
                              ? { background: FOREST, color: "#fff" }
                              : { background: CREAM, color: "#1A1A1A", border: `1.5px solid ${BORDER}` }
                            }
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setGrowthDone(true)} disabled={!allAnswered}
                  className="mt-5 w-full py-4 rounded-full font-black disabled:opacity-40"
                  style={{ background: LIME, color: FOREST }}
                >
                  ✨ 診断結果を見る
                </button>
                {!allAnswered && (
                  <p className="text-center text-xs mt-2" style={{ color: MUTED }}>
                    すべての質問に回答してください（{Object.keys(answers).length}/{growthQuestions.length}）
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl overflow-hidden" style={{ border: `2px solid ${LIME}` }}>
                  <div style={{ position: "relative", height: 100 }}>
                    <img
                      src={`https://picsum.photos/seed/${planId}-growth/400/100`}
                      alt="成長診断"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(29,61,42,0.8)" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                      <span style={{ fontSize: 28, marginBottom: 4 }}>🌟</span>
                      <span style={{ color: "#fff", fontSize: 16, fontWeight: 900 }}>成長診断レポート</span>
                      <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>{plan.name}旅行後の変化分析</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
                  <h3 className="font-black mb-4 text-sm" style={{ color: "#1A1A1A" }}>📊 能力成長グラフ</h3>
                  <div className="space-y-3">
                    {growthScores.map(s => <GrowthBar key={s.label} {...s} />)}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
                  <h3 className="font-black mb-3 text-sm" style={{ color: "#1A1A1A" }}>🔍 発見された興味・才能</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: answers["g1"] ?? "自然・科学", icon: "🌿", desc: "最も興味を持った分野" },
                      { label: answers["g4"] ?? "体験全般",   icon: "🎯", desc: "次回挑戦したい体験" },
                    ].map(item => (
                      <div key={item.label} className="rounded-2xl p-4" style={{ background: CREAM, border: `1.5px solid ${BORDER}` }}>
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="font-black text-sm mb-0.5" style={{ color: FOREST }}>{item.label}</div>
                        <div className="text-xs" style={{ color: MUTED }}>{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
                  <h3 className="font-black mb-2 text-sm" style={{ color: "#1A1A1A" }}>✈️ 次回の旅育おすすめ</h3>
                  <p className="text-sm mb-4" style={{ color: MUTED }}>{nextRec}</p>
                  <Link href="/plan" className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-black text-sm"
                    style={{ background: LIME, color: FOREST }}>
                    ✨ 次の旅育プランを作る →
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-5" style={{ border: `1.5px solid ${BORDER}` }}>
                  <h3 className="font-black mb-3 text-sm" style={{ color: "#1A1A1A" }}>📤 レポートを保存・共有</h3>
                  <div className="flex gap-2 flex-wrap">
                    {[["📄 PDF保存", FOREST, "#fff"], ["📊 成長記録", LIME, FOREST], ["🔗 SNSでシェア", "#fff", FOREST]].map(([label, bg, color]) => (
                      <button key={label} className="px-4 py-2 rounded-full text-xs font-bold"
                        style={{ background: bg, color, border: bg === "#fff" ? `1.5px solid ${BORDER}` : undefined }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
