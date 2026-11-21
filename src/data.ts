import type { SkyPhase } from "@tatsuyamiura2667/akane-lib";

export type Phase = SkyPhase;

export interface Chapter {
  id: string;
  number: string;
  title: string;
  phase: Phase;
  aside: string;
  verse: string;
}

export interface Work {
  id: string;
  title: string;
  status: string;
  category: string;

  summary: string;
  detail: string;
  links?: { label: string; href: string }[];
}

export const PROFILE = {
  name: "Tatsuya",
  tagline: "極限の環境でも動く、誰でも使えるものを、測って、開いて、作る。",
  role: "独立系開発者 / Web アプリ・システムプログラミング・エッジインフラ",
  github: "https://github.com/TatsuyaM2667",
  intro:
    "独立系開発者の Tatsuya です。Web アプリ、システムプログラミング、エッジインフラを作っています。",
} as const;

export const CHAPTERS: Chapter[] = [
  {
    id: "prologue",
    number: "序",
    title: "はじめに",
    phase: "twilight",
    aside: "参道の入口",
    verse: "窓を少し開けると、雨の匂いがした。ここから、参道は始まります。",
  },
  {
    id: "about",
    number: "一",
    title: "経歴",
    phase: "dawn",
    aside: "事実だけを書く",
    verse: "まずは、確かなことだけを置いてみる。推測は、あとで回収します。",
  },
  {
    id: "philosophy",
    number: "二",
    title: "哲学",
    phase: "night",
    aside: "北極星と、ばね",
    verse: "形は守り、中身は建て直す。目標が動いても、速度は残しておく。",
  },
  {
    id: "notebook",
    number: "三",
    title: "手帳",
    phase: "dusk",
    aside: "あなたの一行",
    verse: "誰かの一行が、車窓の便箋に届く。黒塗りは、そのまま黒塗りで良い。",
  },
  {
    id: "works",
    number: "四",
    title: "作品",
    phase: "twilight",
    aside: "十六の記録",
    verse: "動いているもの、実験中のもの、構想だけのものを、同じ棚に並べます。",
  },
  {
    id: "log",
    number: "五",
    title: "ログ",
    phase: "dusk",
    aside: "出来事だけ",
    verse: "日付のない日も、消さずに残しておく。記録は、未来への手紙です。",
  },
  {
    id: "influences",
    number: "六",
    title: "影響",
    phase: "night",
    aside: "名前だけを載せる",
    verse: "受け取った光は、色と余白と、歩く速さになって出ていきます。",
  },
  {
    id: "colophon",
    number: "終",
    title: "このサイト",
    phase: "dawn",
    aside: "遷宮の途中",
    verse: "参道は、いつも途中にあります。読み終えたら、もう一度、入口へ。",
  },
];

export const LYRICS = [
  { time: 0, text: "極限の環境でも動く、" },
  { time: 4, text: "誰でも使えるものを、" },
  { time: 8, text: "測って、開いて、作る。" },
  { time: 12, text: "形を守り、中身を作り替える。" },
  { time: 16, text: "雨の名前は、アメ。" },
  { time: 20, text: "窓の向こうで、夜が明ける。" },
];

export const ABOUT_FACTS = [
  "SAK University（University of Essex の提携校）に在学。将来は本校へ編入し、研究を論文にまとめたいと考えています。",
  "高校時代、宇宙甲子園の CanSat 部門で全国準優勝。Arduino・ESP32・LoRa・WiFi・Bluetooth を学びました。雨には苦労したそうです。",
  "高校 3 年で Windows を消して Arch Linux を導入。いまは Chimera Linux（主）、Arch Linux（安定）、FreeBSD（サブ）を使っています。ブートローダは rEFInd。",
  "Linux 同好会に参加。技術サークル Open Essex に、創設者として関わっています。",
  "日本語が主で、英語は作業用。",
];

export const SKILLS = [
  { category: "言語", names: "Zig、Odin、Rust、TypeScript、C（糊として）" },
  { category: "Web", names: "React、Hono、Bun、Google Apps Script" },
  { category: "基盤", names: "Cloudflare（Pages・Workers・R2）" },
  {
    category: "開発環境",
    names: "Chimera Linux + River、Zed Editor、zsh、ghostty / foot",
  },
  { category: "AI", names: "Ollama + ROCm のローカル環境、無料枠の AI API" },
];

export const WORK_STYLE = [
  "作りながら学ぶ。説明を読むより、手を動かして分かる。",
  "いきなり実機に入れず、QEMU → USB → 実機の順に進める。",
  "計画より、動くコードと実測を重んじる。",
  "一人か少人数で、専業として担当を持つ。",
];

export const PHILOSOPHY = [
  {
    number: "一",
    title: "北極星",
    phase: "night" as Phase,
    body: "目標は「世界の IT の頂点」。その意味は、極限の環境でも高性能に動くこと、生活と学習の役に立つこと、ハードウェア要件に縛られず誰もが使える資産になること。",
    censor:
      "目標は[[世界のITの頂点]]。けれど測っているのは、高さではなく、届く距離です。",
  },
  {
    number: "二",
    title: "学ぶ権利と、恩返し",
    phase: "dawn" as Phase,
    body: "すべての人は、等しく学ぶ権利を持っています。オープンソースと無料の API に助けられた分は、作ったものを開いて返す。",
  },
  {
    number: "三",
    title: "遷宮",
    phase: "twilight" as Phase,
    body: "Unix 哲学の形を守り、中身を Zig・Odin・Wasm で建て直す。見た目を作り替えても、内容は守る。それを「遷宮」と呼んでいます。",
  },
  {
    number: "四",
    title: "一人で、没頭する",
    phase: "night" as Phase,
    body: "一人で黙々と研究に没頭できる環境を目指す。ESP32 の低消費電力 AI サーバーには、約 18 か月の研究ロードマップがあります。",
  },
  {
    number: "五",
    title: "唯一無二",
    phase: "dusk" as Phase,
    body: "人と違うことをしたい。既存のものに執着せず、他にないものを、難易度を問わず作る。Amekernel、NagiScript、ame-hand がその例です。",
  },
  {
    number: "六",
    title: "ばね",
    phase: "twilight" as Phase,
    body: "途中で目標が変わっても、勢いを保ったまま滑らかに曲がる。半陰的オイラー法で速度を残す、ame-shell のばねと同じ進み方。v += (-k(x - target) - c*v) * dt / x += v * dt",
  },
];

export const WORKS: Work[] = [
  {
    id: "ame-shell",
    title: "ame-shell",
    status: "動いている",
    category: "デスクトップ",
    summary: "River 向けのデスクトップシェル。Zig・Odin・C・Wasm。",
    detail:
      "ドロワー、ダッシュボード、メディアプレーヤー、AI チャット、ランチャー、通知、壁紙、顔認証、ロック、Wasm ウィジェットを備える。動きは半陰的オイラー法のばね。公開値は起動 92〜160ms、待機メモリ 69〜75MB、中核の Wasm 約 2KB（いずれも再測定は未了）。名前はサカナクションの楽曲「アメ」から。",
    links: [
      { label: "GitHub", href: "https://github.com/TatsuyaM2667/ame-shell" },
      { label: "Site", href: "https://ame-shell.pages.dev" },
    ],
  },
  {
    id: "ame-filemanager",
    title: "ame-Filemanager",
    status: "動いている",
    category: "デスクトップ",
    summary: "Odin 製の、ガラスのように透明なファイルマネージャ。",
    detail:
      "Space キーでクイックプレビュー、音楽プレーヤーも備える。README に記載された数値は待機 CPU 0%、メモリ約 19MB。再測定は未了。",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/TatsuyaM2667/ame-Filemanager",
      },
    ],
  },
  {
    id: "ame-cli",
    title: "ame の小さな CLI 群",
    status: "動いている",
    category: "道具",
    summary: "単機能・標準入出力・JSON 行。Zig（libc のみ）と、糊としての C。",
    detail:
      "ame-keyring、ame-handtrack、ame-airpods、ame-weather、ame-config、ame-agent、ame-ai（MCP 対応）、ame-lyrics（LRC 同期歌詞）、ame-face（赤外線カメラ + PAM）、ame-hand（21 関節と自作推論エンジン）。個別の動作確認は未了。",
    links: [
      { label: "ame-ai", href: "https://github.com/TatsuyaM2667/ame-ai" },
    ],
  },
  {
    id: "keiba-vision",
    title: "Keiba Vision",
    status: "動いている",
    category: "Web",
    summary: "競馬の予測サイト。係数は手で決めたもので、検証は未了。",
    detail:
      "直近 4 走の加重、脚質、ペースから予測。モンテカルロ 10 万回（Zig）で確率を出し、オッズから市場確率とケリー基準の賭け額を計算します。的中率は未測定。",
    links: [
      { label: "Site", href: "https://keiba-vision.pages.dev" },
      { label: "Docs", href: "https://keiba-vision-docs.pages.dev" },
      {
        label: "GitHub",
        href: "https://github.com/TatsuyaM2667/keiba-predictor",
      },
    ],
  },
  {
    id: "livekit-tui-client",
    title: "livekit-tui-client",
    status: "動いている",
    category: "通信",
    summary: "WebRTC と TUI のターミナルビデオ通話。",
    detail:
      "Rust で WebRTC、ピクセルエンジンは Odin と Zig。2026-09-04 に日本語の解説記事を Zenn へ投稿しました（記事 URL は確認中）。",
  },
  {
    id: "terminal-pixel-animation",
    title: "terminal-pixel-animation",
    status: "実験中",
    category: "ライブラリ",
    summary: "RGB 画像を Braille / half-block の文字へ変える Rust ライブラリ。",
    detail:
      "Braille エンジンは Odin、half-block は Zig。C FFI で静的リンクし、Wasm 対応を進めています。",
  },
  {
    id: "wonderland",
    title: "WonderLand",
    status: "停止中",
    category: "コンポジタ",
    summary:
      "river-classic のフォークに SceneFX を載せた、Zig + wlroots のコンポジタ。",
    detail:
      "壁紙デーモン wonderland-bg（Rust）とピッカーを開発。壁紙を通したぼかしを実機で確認しました。ame-shell への移行に伴い更新を停止。",
  },
  {
    id: "lfs-ame-linux",
    title: "LFS 完走 / Ame Linux",
    status: "停止中",
    category: "OS",
    summary: "Linux From Scratch を完走し、自作ディストロ Ame Linux へ。",
    detail:
      "LFS 本編を完走し、グラフィカルターゲットを QEMU で起動。2026-09-19 に ZigLinux から Ame Linux へ改名。2026-11-11、共同開発者と学び直しが必要だと判断し一時停止しました。",
  },
  {
    id: "amekernel",
    title: "Amekernel",
    status: "実験中",
    category: "OS",
    summary: "Zig / Odin / Rust で、ゼロから書いているカーネル。",
    detail:
      "約 4 日で v0.3.0 まで到達。未解決の課題は ring3 から shell へ戻る処理。",
  },
  {
    id: "edgeforge",
    title: "ESP32 低負荷 AI サーバー（EdgeForge 構想）",
    status: "実験中",
    category: "エッジ",
    summary: "ESP32 3 枚を Rust で分散させた、Web / AP / DB の 3 層構成。",
    detail:
      "指標は Performance/Watt。2026-06 に約 18 か月の研究ロードマップを作成。目標は OSS 公開と arXiv 投稿。「make high-performance AI accessible to everyone」。実測値は未記録。",
  },
  {
    id: "cheri",
    title: "CHERI 学習",
    status: "学習中",
    category: "研究",
    summary: "CHERI / CheriBSD / Sail の学習。QEMU で観測してから FPGA へ。",
    detail: "まずエミュレータで挙動を観測し、その後に実機へ移す方針。",
  },
  {
    id: "nagiscript",
    title: "NagiScript",
    status: "実験中",
    category: "言語",
    summary: "LLVM をバックエンドにした自作言語。拡張子は .ngs。",
    detail: "コンパイラのバックエンドに LLVM を採用した実験的な言語。",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/TatsuyaM2667/nagiscript_lang",
      },
    ],
  },
  {
    id: "kasumi",
    title: "Kasumi",
    status: "構想",
    category: "ブラウザ",
    summary: "Firefox フォークのブラウザ構想。まだ作っていません。",
    detail:
      "ローカルの記憶、データの所有と可搬性が主題。TypeScript のスクリプト層、Firefox の追従、AI を差し替え可能な薄い層として扱うことを想定。",
  },
  {
    id: "ame-ecosystem",
    title: "ame エコシステム / ame OS 構想",
    status: "構想",
    category: "構想",
    summary: "仕事道具を段階的に自作へ置き換え、最後は作品型 OS へ。",
    detail:
      "端末、エディタ、ブラウザ、ランチャーから順に置き換え、River / Wayland、そしてカーネルへ。四つの目標は生のベンチマーク、レイテンシ、一貫性と芸術性、自分専用。83K6（IdeaPad Slim 3 14ARP10）で観測中。 Gate 1 の GPU ばね物理プロトタイプは未着手。",
  },
  {
    id: "hardware",
    title: "工作（手持ち部品だけで）",
    status: "項目ごと",
    category: "ハードウェア",
    summary:
      "LoRa ラジコン、ESP32 RF ツールキット、音楽プレーヤー、Bluetooth スピーカー。",
    detail:
      "E220-900T22S + XIAO ESP32S3 + L298N のラジコン、TTGO LoRa32 のツールキット、Arduino Uno + DFPlayer Mini の音楽プレーヤーなど。手持ちの部品だけで作るのが条件。個別の状態は確認中。",
  },
  {
    id: "small-works",
    title: "その他の小さな作品",
    status: "項目ごと",
    category: "小作品",
    summary:
      "GAS の音楽プレーヤー、ポケモン図鑑、ゼロ依存チャットボット、dotfiles。",
    detail:
      "Google Apps Script の音楽プレーヤーと LRC Studio、GAS のポケモン図鑑、ルールベース + マルコフ連鎖の Rust チャットボット、Hyprland の dotfiles、幼稚園・保育施設向け Web サービスの事業計画。URL と状態は確認中。",
  },
];

export const STATUS_ORDER = [
  "動いている",
  "実験中",
  "学習中",
  "構想",
  "停止中",
  "項目ごと",
];

export const LOG = [
  {
    date: "2026-11-12",
    text: "このサイトを作り始めました。内容は Markdown に、見た目は theme に分けました。最初の遷宮ログを書きました。",
  },
  {
    date: "2026-11-11",
    text: "Ame Linux を一時停止しました。共同開発者と、お互いに学び直しが必要だと決めたためです。",
  },
  {
    date: "2026-10-28",
    text: "FreeBSD のこと。サブの環境です。ame-shell は FreeBSD の River の上でも動いています。設定の細部に課題が残っています。",
  },
  {
    date: "2026-10-26",
    text: "Chimera Linux に移りました。いまの主な環境です。River の上で ame-shell を使っています。",
  },
  { date: "2026-09-19", text: "ZigLinux の名前を、Ame Linux に改めました。" },
  {
    date: "2026-09-04",
    text: "livekit-tui-client について、Zenn に日本語の解説記事を書きました。",
  },
  {
    date: "2026-06",
    text: "ESP32 低負荷 AI サーバー（EdgeForge 構想）の、約 18 か月の研究ロードマップを作りました。指標は Performance/Watt です。",
  },
  {
    date: "2024 年ごろ",
    text: "高校 3 年のとき、Windows を消して Arch Linux を入れました。日付は確認中です。",
  },
  {
    date: "日付を確認中",
    text: "LFS 本編を完走し QEMU でグラフィカルターゲットを起動。Amekernel を約 4 日で v0.3.0 に。高校時代、CanSat で全国準優勝。",
  },
];

export const INFLUENCES = [
  "新海誠の作品",
  "神社と、日本の歴史",
  "Orangestar",
  "ヨルシカ",
  "Guiano",
  "文藝天国",
  "Aqu3ra",
  "tayori",
  "ボカロ文化",
  "Mrs. GREEN APPLE",
  "米津玄師",
  "サカナクション「アメ」",
];

export const INFLUENCE_ELEMENTS = [
  {
    element: "透明感",
    use: "ガラスのような半透明の面。文字の背面は読みやすさの基準を満たす濃さ。",
  },
  {
    element: "静けさ",
    use: "余白と、ゆっくりした動き。動きは止めることもできます。",
  },
  { element: "切なさ", use: "空の色が、昼から夕方へゆっくり変わるトップ。" },
  {
    element: "変わるものと変わらないもの",
    use: "遷宮。見た目は作り替え、内容は守ります。",
  },
];

export const MOTIF_GLOSSARY = [
  { id: "paper", label: "紙・手紙・活字" },
  { id: "blueNight", label: "青・夜・月" },
  { id: "rainGlass", label: "雨・ガラス・波紋" },
  { id: "flowerPetal", label: "花・花びら" },
  { id: "linePrint", label: "線・網点・滲み" },
  { id: "filmProcess", label: "グレイン・ビネット" },
];

export const COLOPHON = [
  "元の参道サイトは、Bun + TypeScript、依存パッケージ 0 個で作られています。外部通信、CDN、トラッキング、Cookie はありません。",
  "元のサイトの運動は、Zig で書いた 344 バイトの Wasm のばね。JavaScript と Wasm はトップの水滴だけです。",
  "このページは、その内容を akane-lib の部品で組み直した「遷宮」です。空・栞・便箋・カセット・車窓・手帳で、同じ記録を読み直しています。",
  "API は Hono。Cloudflare Pages Functions と同じコードを、ローカルでは Vite のミドルウェアで動かしています。",
  "確かめられない数字は、載せません。各作品の状態と未検証の点は、そのまま書いています。",
];
