// ========================
// モックデータ
// ========================

// ── 行き先ごとの3サブプラン ──
export type SubPlan = {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  emoji: string;
  tagColor: string; // Tailwind bg class 相当 → inline style で使用
  duration: string;
  budget: string;
  description: string;
  educationalThemes: string[];
  activities: string[];
  highlights: string[];
  recommended_age: string;
  videoLabel: string;
};

export type Destination = {
  id: string;
  name: string;
  prefecture: string;
  emoji: string;
  heroColor: string;
  plans: SubPlan[];
};

export const destinations: Destination[] = [
  {
    id: "okinawa",
    name: "沖縄",
    prefecture: "沖縄県",
    emoji: "🏝️",
    heroColor: "#0C4A6E",
    plans: [
      {
        id: "okinawa-ocean",
        title: "海洋探検コース",
        subtitle: "珊瑚礁とジンベエザメに会いに行く",
        theme: "海洋生態学",
        emoji: "🐠",
        tagColor: "#0EA5E9",
        duration: "3泊4日",
        budget: "30〜38万円",
        description: "美ら海水族館の学習プログラムからシュノーケリングまで、「海の科学」をフルに体験するコース。子どもの「なぜ？」が止まらない海洋探究旅。",
        educationalThemes: ["海洋生態学", "珊瑚礁の仕組み", "環境保全"],
        activities: [
          "美ら海水族館 学習プログラム（ガイド付き）",
          "本島北部でシュノーケリング体験",
          "珊瑚礁観察 グラスボートツアー",
          "塩作り体験ワークショップ（海水の科学）",
        ],
        highlights: ["ジンベエザメ・マンタの餌付け見学", "海洋生物学者のミニ講義", "夜光虫観察ツアー"],
        recommended_age: "5歳〜",
        videoLabel: "沖縄 海洋探検 旅育動画",
      },
      {
        id: "okinawa-history",
        title: "琉球王国コース",
        subtitle: "450年の歴史と文化を全身で体感",
        theme: "歴史・文化",
        emoji: "⛩️",
        tagColor: "#EA580C",
        duration: "2泊3日",
        budget: "22〜28万円",
        description: "首里城・玉陵・斎場御嶽など琉球王国ゆかりの地を巡り、伝統工芸・舞踊体験で「生きた歴史」を学ぶコース。教科書が立体的になる旅。",
        educationalThemes: ["琉球の歴史", "伝統工芸", "異文化理解"],
        activities: [
          "首里城公園 ガイド付き歴史ツアー",
          "琉球ガラス工房 制作体験",
          "エイサー鑑賞 & 体験ワークショップ",
          "紅型（びんがた）染め体験",
        ],
        highlights: ["玉陵（世界遺産）見学", "国際通り 琉球料理づくり教室", "シーサー手作り体験"],
        recommended_age: "7歳〜",
        videoLabel: "沖縄 琉球文化 旅育動画",
      },
      {
        id: "okinawa-nature",
        title: "やんばる自然コース",
        subtitle: "世界自然遺産の森で生き物探し",
        theme: "自然科学・冒険",
        emoji: "🦅",
        tagColor: "#16A34A",
        duration: "3泊4日",
        budget: "28〜35万円",
        description: "2021年に世界自然遺産登録されたやんばるの森をガイドと歩き、固有種の生き物を観察。自然の仕組みを全身で学ぶアドベンチャー旅。",
        educationalThemes: ["亜熱帯の生態系", "固有種・絶滅危惧種", "世界自然遺産"],
        activities: [
          "やんばる国立公園 ナイトウォーキングツアー",
          "ノグチゲラ・ヤンバルクイナ観察ハイク",
          "マングローブ林 カヌー体験",
          "星空観察会（やんばるの夜空）",
        ],
        highlights: ["世界遺産ガイドのレクチャー", "渓流シュノーケリング", "アダンの実を使った工作"],
        recommended_age: "6歳〜",
        videoLabel: "沖縄 やんばる冒険 旅育動画",
      },
    ],
  },
  {
    id: "kyoto",
    name: "京都",
    prefecture: "京都府",
    emoji: "⛩️",
    heroColor: "#7C2D12",
    plans: [
      {
        id: "kyoto-history",
        title: "平安・室町 歴史コース",
        subtitle: "千年の都の「なぜ？」を解き明かす",
        theme: "日本史",
        emoji: "🏯",
        tagColor: "#B91C1C",
        duration: "2泊3日",
        budget: "20〜26万円",
        description: "金閣寺・銀閣寺・清水寺を比較しながら巡り、時代ごとの文化の違いを学ぶ歴史探究コース。現地ガイドの解説で教科書が生きた物語になる。",
        educationalThemes: ["平安〜室町の歴史", "建築様式の変遷", "政治と文化"],
        activities: [
          "金閣寺・銀閣寺 建築比較ツアー（ガイド付き）",
          "清水寺 舞台の木組み構造を学ぶ",
          "伏見稲荷 千本鳥居 奉納の意味を探る",
          "坐禅・写経体験（建仁寺）",
        ],
        highlights: ["御朱印帳づくり体験", "二条城 忍者ガイドツアー", "京料理の出汁の科学教室"],
        recommended_age: "7歳〜",
        videoLabel: "京都 歴史探究 旅育動画",
      },
      {
        id: "kyoto-craft",
        title: "伝統工芸 職人コース",
        subtitle: "本物の職人技に触れ、作る喜びを知る",
        theme: "伝統工芸・ものづくり",
        emoji: "🧵",
        tagColor: "#7C3AED",
        duration: "2泊3日",
        budget: "22〜30万円",
        description: "西陣織・京友禅・清水焼など、京都が誇る伝統工芸を体験するコース。職人さんと直接交流し、「作る楽しさ」と「技の深さ」に感動する旅。",
        educationalThemes: ["伝統工芸の技法", "色彩と美学", "職人文化"],
        activities: [
          "西陣織 機織り体験（本物の機）",
          "京友禅 手描き染色ワークショップ",
          "清水焼 ろくろ体験",
          "京うちわ 絵付け体験",
        ],
        highlights: ["職人の工房見学（通常非公開）", "和菓子づくり体験", "京小物でラッピング体験"],
        recommended_age: "6歳〜",
        videoLabel: "京都 伝統工芸 旅育動画",
      },
      {
        id: "kyoto-zen",
        title: "禅・自然 マインドフルネスコース",
        subtitle: "静けさの中で自分と向き合う体験",
        theme: "哲学・自然・心",
        emoji: "🧘",
        tagColor: "#0891B2",
        duration: "2泊3日",
        budget: "18〜24万円",
        description: "枯山水の庭を眺め、坐禅を組み、寺院の茶道を体験する。「なぜ静かにするの？」という問いから始まる、子どもでも深く考えられるコース。",
        educationalThemes: ["禅と仏教哲学", "日本庭園の美学", "茶道の文化"],
        activities: [
          "天龍寺 枯山水庭園 禅哲学ガイドツアー",
          "坐禅体験（龍安寺）",
          "表千家 茶道ミニ体験",
          "嵐山 竹林の小径 自然観察ウォーク",
        ],
        highlights: ["月光院の特別拝観", "精進料理体験", "苔庭の生態観察（西芳寺）"],
        recommended_age: "8歳〜",
        videoLabel: "京都 禅・自然 旅育動画",
      },
    ],
  },
  {
    id: "hokkaido",
    name: "北海道",
    prefecture: "北海道",
    emoji: "🌾",
    heroColor: "#14532D",
    plans: [
      {
        id: "hokkaido-farm",
        title: "大地の農業体験コース",
        subtitle: "食と農の科学を体で学ぶ",
        theme: "農業・食の科学",
        emoji: "🐄",
        tagColor: "#65A30D",
        duration: "3泊4日",
        budget: "28〜35万円",
        description: "本物の酪農体験・野菜収穫・バター・チーズ作りを通じて、「食べ物はどこから来るのか」を全身で体験するコース。食への感謝が生まれる旅。",
        educationalThemes: ["農業・酪農の仕組み", "食品科学", "地産地消"],
        activities: [
          "本物の酪農体験（乳しぼり・バター作り）",
          "じゃがいも・トウモロコシ収穫体験",
          "チーズ工房 見学 & 製造体験",
          "富良野 ラベンダー農園 植物学習",
        ],
        highlights: ["農家さんとの朝ごはん体験", "コーン迷路＆収穫", "アイスクリーム手作り体験"],
        recommended_age: "4歳〜",
        videoLabel: "北海道 農業体験 旅育動画",
      },
      {
        id: "hokkaido-wildlife",
        title: "知床 野生動物コース",
        subtitle: "世界遺産の大自然で本物の生態系に触れる",
        theme: "生態学・世界自然遺産",
        emoji: "🐻",
        tagColor: "#0F766E",
        duration: "3泊4日",
        budget: "32〜42万円",
        description: "知床半島でヒグマ・エゾシカ・オジロワシを観察し、世界自然遺産の生態系を学ぶコース。「食物連鎖」「生き物のつながり」を肌で感じる旅。",
        educationalThemes: ["生態系・食物連鎖", "世界自然遺産", "野生動物保護"],
        activities: [
          "知床 ヒグマ観察ボートクルーズ",
          "サケの産卵遡上観察ツアー（秋）",
          "エゾシカ・キタキツネ観察ハイク",
          "知床自然センター 生態系レクチャー",
        ],
        highlights: ["世界遺産ガイドの特別解説", "カムイワッカ湯の滝ハイク", "野鳥観察（オジロワシ）"],
        recommended_age: "6歳〜",
        videoLabel: "北海道 知床 旅育動画",
      },
      {
        id: "hokkaido-science",
        title: "星空・サイエンスコース",
        subtitle: "澄んだ夜空で宇宙の不思議を体感",
        theme: "天文学・自然科学",
        emoji: "⭐",
        tagColor: "#4F46E5",
        duration: "3泊4日",
        budget: "30〜38万円",
        description: "光害の少ない北海道の空で天の川を肉眼で観察。天文台でのレクチャーや科学施設を組み合わせた、理系の好奇心に火をつけるコース。",
        educationalThemes: ["天文学・宇宙科学", "地球と気候", "光の科学"],
        activities: [
          "天文台 貸切 星空観察会（望遠鏡体験）",
          "北海道大学 サイエンス見学ツアー",
          "地球温暖化 環境学習プログラム",
          "旭山動物園 動物行動学レクチャー",
        ],
        highlights: ["流星群観察（時期合わせ）", "プラネタリウム特別上映", "天文台学芸員のトーク"],
        recommended_age: "5歳〜",
        videoLabel: "北海道 星空・サイエンス 旅育動画",
      },
    ],
  },
];

// 行き先名から Destination を引く
export function findDestination(input: string): Destination | undefined {
  const normalized = input.replace(/[県府都道]/g, "").trim();
  return destinations.find(
    d => d.name.includes(normalized) || normalized.includes(d.name) || d.prefecture.includes(normalized)
  );
}

// ── チャットフロー ──
export type ChatStep = {
  trigger: string;
  assistant: string;
};

export const planningChatFlow: ChatStep[] = [
  {
    trigger: "start",
    assistant:
      "こんにちは！AIコンシェルジュの「たびちゃん」です🌟\nお子さんとの旅を、一生モノの学びに変えましょう！\n\nまず、**旅行先（都道府県）**を教えてください。\n例：「沖縄」「京都」「北海道」",
  },
  {
    trigger: "destination",
    assistant:
      "素敵なところですね！\n\n次に、**旅行の時期と日数**はいかがですか？\n例：「8月上旬、3泊4日」",
  },
  {
    trigger: "date",
    assistant:
      "了解です！\n\n**お子さんの年齢**を教えてください。\n例：「7歳の息子がいます」",
  },
  {
    trigger: "age",
    assistant:
      "ありがとうございます！\n\n**お子さんに育ってほしい力**はどれに近いですか？\n\n① 自然・科学への好奇心\n② 歴史・文化への興味\n③ ものづくり・表現力\n④ 冒険・チャレンジ精神",
  },
  {
    trigger: "goal",
    assistant:
      "最後に、**ご予算の目安**（交通費込みの概算）を教えてください。\n例：「25万円くらい」「40万円まで」",
  },
  {
    trigger: "budget",
    assistant:
      "ありがとうございました！\n\n✨ **旅行先に合わせた3つのプランを提案します！**\n天気・空き状況・ご予算・旅育テーマをすべて考慮しました。\n\n少々お待ちください...",
  },
];

// ── 旅行中 AI ガイド Q&A ──
export type GuideQA = {
  question: string;
  answer: string;
  category: string;
};

export const guideQAs: Record<string, GuideQA[]> = {
  okinawa: [
    {
      question: "珊瑚礁ってなんでできるの？",
      answer:
        "珊瑚礁は「珊瑚虫（さんごちゅう）」という小さな生き物が長年かけて作った岩礁だよ🪸\n自分の体の外側に炭酸カルシウムという硬い殻を作り、それが積み重なって珊瑚礁になる。沖縄の珊瑚礁の中には何百年も続くものもあるよ！",
      category: "自然科学",
    },
    {
      question: "首里城はなぜ赤いの？",
      answer:
        "首里城の赤色は中国の影響を受けているんだよ⛩️\n琉球王国は中国と盛んに交易していて、赤は「繁栄・魔除け」の縁起のいい色とされていた。本土のお城とは違う赤が、琉球独自の文化を表しているね！",
      category: "歴史・文化",
    },
    {
      question: "近くにトイレはある？",
      answer:
        "現在地から一番近いトイレはこちら🚻\n・**国際通り ファミリーマート前**（徒歩2分）\n・**むつみ橋交差点 公衆トイレ**（徒歩4分）\n・**てんぶす那覇 1F**（徒歩6分）",
      category: "便利ナビ",
    },
    {
      question: "急に雨が降ってきた！どうする？",
      answer:
        "大丈夫！雨でも楽しめる代替プランを提案するね☔\n\n① **沖縄県立博物館・美術館**（車15分）→ 琉球の歴史を深掘り\n② **沖縄こどもの国**（車10分）→ 屋内エリアあり\n③ **琉球ガラス村**（近く）→ ガラス工芸体験（予約不要）\n\nどれにする？",
      category: "スマートリカバリー",
    },
  ],
  kyoto: [
    {
      question: "金閣寺はなぜ金でできているの？",
      answer:
        "金閣寺を建てた足利義満が「権力と富を示すため」に金箔を貼ったと言われているよ💛\n面白いのは3層構造で、それぞれ貴族風・武家風・禅宗風と違う建築様式が混在していること。日本文化の歴史が1棟に詰まった建物なんだ！",
      category: "歴史・文化",
    },
    {
      question: "西陣織ってなにが特別なの？",
      answer:
        "西陣織は約600年の歴史を持つ京都の伝統工芸だよ🧵\n「先染め」という技法で糸を先に染めてから織る。1枚の帯に使われる糸は最大1万本以上！現代のコンピューターを使っても職人の技が必要なんだ。",
      category: "伝統工芸",
    },
    {
      question: "周辺のコンビニはどこ？",
      answer:
        "現在地から近いコンビニはこちら🏪\n・**セブンイレブン 京都祇園店**（徒歩3分・四条通沿い）\n・**ファミリーマート 東山三条店**（徒歩5分）\n観光エリアはコンビニが少ないのでこまめに補給しておこう！",
      category: "便利ナビ",
    },
  ],
  hokkaido: [
    {
      question: "牛乳はどうやって作るの？",
      answer:
        "牛乳は乳牛からとれる「生乳」を加工したものだよ🐄\n①乳牛が草・飼料を食べる→②1日20〜30リットルの乳を作る→③搾乳→④加熱殺菌・均質化→⑤パック詰め\n北海道は涼しい気候が牛に合っていて、日本の牛乳の約半分は北海道産なんだよ！",
      category: "農業科学",
    },
    {
      question: "星ってなぜ光るの？",
      answer:
        "星は「核融合」という反応で光っているよ⭐\n太陽のような星の中心では水素がヘリウムに変わるときにものすごいエネルギーが生まれ、それが光と熱になって宇宙に飛び出している。北海道は空気が澄んでいて都会より何倍も多くの星が見えるよ🔭",
      category: "天文学",
    },
    {
      question: "近くに駐車場はある？",
      answer:
        "現在地周辺の駐車場情報🚗\n・**道の駅 とうま 無料駐車場**（徒歩1分・150台）\n・**富良野観光協会 提携P**（500m先・有料200円/時）\n夏の観光シーズンは混むので午前中の到着がおすすめ！",
      category: "便利ナビ",
    },
  ],
};

// ── クイズ ──
export type Quiz = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  emoji: string;
};

export const quizzes: Record<string, Quiz[]> = {
  okinawa: [
    {
      question: "沖縄の伝統的な守り神「シーサー」の語源は？",
      options: ["海の神", "獅子（しし）", "風の精", "太陽神"],
      correct: 1,
      explanation: "シーサーは「獅子（しし）」が語源。中国の獅子像が沖縄に伝わり、魔除けの守り神として定着したよ！",
      emoji: "🦁",
    },
    {
      question: "珊瑚が白くなる「白化現象」の原因は？",
      options: ["紫外線を浴びすぎた", "共生する藻が出ていった", "汚染物質が付着した", "年をとったから"],
      correct: 1,
      explanation: "珊瑚の色は「褐虫藻」という共生する藻の色。水温が上がると藻が出ていき、珊瑚が白くなる。これが白化現象！",
      emoji: "🪸",
    },
    {
      question: "琉球王国が独立国として栄えた期間は約何年？",
      options: ["100年", "300年", "450年", "600年"],
      correct: 2,
      explanation: "1429年〜1879年の約450年間。中国・日本・東南アジアと交易する海洋王国として繁栄したよ！",
      emoji: "⛩️",
    },
  ],
  kyoto: [
    {
      question: "京都が実質的に首都でなくなったのはいつ？",
      options: ["江戸時代初期", "明治維新（約150年前）", "昭和初期", "最近"],
      correct: 1,
      explanation: "1869年（明治2年）に天皇が東京へ。それまで約1100年間、京都が政治・文化の中心だったよ！",
      emoji: "🏯",
    },
    {
      question: "坐禅の正しい目的は？",
      options: ["眠ること", "筋トレ", "心を静め自分と向き合う", "祈ること"],
      correct: 2,
      explanation: "坐禅は「ただ座る」禅の修行。雑念を手放し今この瞬間に集中する練習。現代のマインドフルネスに近い考え方！",
      emoji: "🧘",
    },
  ],
  hokkaido: [
    {
      question: "北海道が全国一位の生産量を誇る農作物は？",
      options: ["米", "小麦", "じゃがいも", "トウモロコシ"],
      correct: 1,
      explanation: "北海道は全国の小麦生産量の約65%を担う日本最大の産地！ラーメンやパンの小麦粉の多くが北海道産だよ🌾",
      emoji: "🌾",
    },
    {
      question: "知床が世界自然遺産に登録された理由は？",
      options: ["景色がきれい", "海と陸の生態系が一体", "温泉が多い", "珍しい植物がある"],
      correct: 1,
      explanation: "鮭が海から川に遡上し、クマが食べ、栄養が森に還る──海洋と陸上の生態系が一体となった希少な例として評価されたよ！",
      emoji: "🐻",
    },
  ],
};

// ── スタンプラリー ──
export type StampSpot = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  collected: boolean;
};

export const stampSpots: Record<string, StampSpot[]> = {
  okinawa: [
    { id: "s1", name: "美ら海水族館", emoji: "🐋", description: "ジンベエザメに会った！", collected: false },
    { id: "s2", name: "首里城", emoji: "🏯", description: "琉球王国の歴史を学んだ！", collected: false },
    { id: "s3", name: "珊瑚礁シュノーケル", emoji: "🪸", description: "本物の珊瑚を見た！", collected: false },
    { id: "s4", name: "塩作り体験", emoji: "🧂", description: "海水から塩を作った！", collected: false },
    { id: "s5", name: "琉球ガラス", emoji: "🫙", description: "自分だけの作品！", collected: false },
  ],
  kyoto: [
    { id: "k1", name: "金閣寺", emoji: "✨", description: "黄金の寺を見学！", collected: false },
    { id: "k2", name: "西陣織体験", emoji: "🧵", description: "機織りに挑戦！", collected: false },
    { id: "k3", name: "坐禅体験", emoji: "🧘", description: "心を静める体験！", collected: false },
    { id: "k4", name: "伏見稲荷", emoji: "⛩️", description: "千本鳥居を歩いた！", collected: false },
    { id: "k5", name: "京料理教室", emoji: "🍱", description: "出汁の科学を学んだ！", collected: false },
  ],
  hokkaido: [
    { id: "h1", name: "乳しぼり体験", emoji: "🐄", description: "牛から直接ミルクを搾った！", collected: false },
    { id: "h2", name: "星空観察", emoji: "⭐", description: "天の川を見た！", collected: false },
    { id: "h3", name: "知床ガイドツアー", emoji: "🐻", description: "野生のヒグマを観察！", collected: false },
    { id: "h4", name: "収穫体験", emoji: "🌽", description: "じゃがいもを掘った！", collected: false },
    { id: "h5", name: "アイヌ文化センター", emoji: "🪘", description: "アイヌの歌と踊りを体験！", collected: false },
  ],
};

// ── 成長診断 ──
export type GrowthQuestion = {
  id: string;
  question: string;
  options: string[];
  category: string;
};

export const growthQuestions: GrowthQuestion[] = [
  {
    id: "g1",
    question: "旅行から帰って、子どもが一番よく話していたことは？",
    options: ["生き物・自然について", "歴史や文化について", "食べ物・料理について", "体験・遊びについて"],
    category: "興味分野",
  },
  {
    id: "g2",
    question: "旅行中、子どもが自分から「なぜ？」と聞いた場面は？",
    options: ["たくさんあった（5回以上）", "何度かあった（2〜4回）", "1回あった", "あまりなかった"],
    category: "好奇心指数",
  },
  {
    id: "g3",
    question: "旅行後、子どもに変化を感じた点は？",
    options: ["積極性が上がった", "感謝の言葉が増えた", "本や図鑑を読み始めた", "友達に話したがっている"],
    category: "成長変化",
  },
  {
    id: "g4",
    question: "子どもが「また行きたい」と言っていた体験は？",
    options: ["自然・アウトドア体験", "歴史・文化施設", "ものづくり・工芸体験", "動物・生き物との触れ合い"],
    category: "次回推薦",
  },
];

export const nextRecommendation: Record<string, string> = {
  "自然・アウトドア体験": "屋久島の森林トレッキング × 縄文杉 旅育プランがおすすめ！",
  "歴史・文化施設": "奈良・飛鳥の古代史ディープダイブ旅育プランがおすすめ！",
  "ものづくり・工芸体験": "瀬戸内海アート島（直島）× ものづくり旅育プランがおすすめ！",
  "動物・生き物との触れ合い": "西表島 希少生物観察 旅育プランがおすすめ！",
};

// ── 持ち物リスト ──
export const packingList: Record<string, string[]> = {
  common: [
    "保険証・医療費補助カード",
    "子ども用常備薬（酔い止め・解熱剤）",
    "日焼け止め（SPF50以上）",
    "帽子・レインウェア",
    "モバイルバッテリー（20000mAh以上推奨）",
    "子ども用スニーカー（歩きやすいもの）",
    "おやつ・水筒",
    "カメラ（子どもに持たせると旅育効果UP）",
  ],
  okinawa: ["水着・ラッシュガード", "シュノーケルセット（レンタルも可）", "マリンシューズ", "虫除けスプレー", "防水スマホケース"],
  kyoto:   ["歩きやすいサンダルorスニーカー", "薄手のカーディガン（寺院内は涼しい）", "折りたたみ傘", "御朱印帳", "旅育メモ帳"],
  hokkaido:["長袖・フリース（夜は冷える）", "長靴またはトレッキングシューズ", "虫除けスプレー（強力タイプ）", "双眼鏡（野生動物観察用）", "星空観察用 赤色ライト"],
};
