import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  AkaneThemeProvider,
  BookmarkRibbon,
  GhostFlowerRefraction,
  HalftoneDots,
  KomorebiLight,
  LetterCard,
  LyricLines,
  MoonHalo,
  NotebookMemo,
  OilPaintTexture,
  PaperTexture,
  RainRippleButton,
  RelicScene,
  SakuraThiefOverlay,
  SourceChip,
  TrainWindowFrame,
  TwilightSky,
  TypewriterCensorText,
  TypographicStamp,
  WhisperText,
  WhiteLilySeal,
  useAkaneTheme,
  type FountainInk,
  type RefractionIntensity,
} from "@tatsuyamiura2667/akane-lib";
import {
  ABOUT_FACTS,
  CHAPTERS,
  COLOPHON,
  INFLUENCES,
  INFLUENCE_ELEMENTS,
  LOG,
  LYRICS,
  MOTIF_GLOSSARY,
  PHILOSOPHY,
  PROFILE,
  SKILLS,
  STATUS_ORDER,
  WORK_STYLE,
  WORKS,
  type Chapter,
  type Phase,
} from "./data";
import { useScrollReveal } from "./useScrollReveal";

const ThreePaperBook = lazy(() => import("./ThreePaperBook"));

type SakuraDensity = "off" | "light" | "normal" | "gust";

interface Profile {
  name: string;
  tagline: string;
  role: string;
  github: string;
}

interface WorksFeed {
  total: number;
  counts: Record<string, number>;
  works: {
    id: string;
    title: string;
    status: string;
    category: string;
    summary: string;
  }[];
}

interface MemoReceipt {
  id: string;
  text: string;
  ink: FountainInk;
  receivedAt: string;
  note: string;
}

const PHASE_LABEL: Record<Phase, string> = {
  dawn: "夜明け",
  morning: "朝の光",
  day: "昼",
  dusk: "夕凪 / 雨",
  golden: "茜さす",
  twilight: "宵の茜",
  night: "第一夜",
  midnight: "深夜",
};

const SCROLL_PHASES: Phase[] = [
  "dusk",
  "golden",
  "twilight",
  "night",
  "midnight",
  "dawn",
  "morning",
  "day",
];

const PHASE_RIBBONS: { phase: Phase; chapter: string; title: string; progress: number }[] = [
  { phase: "dusk", chapter: "一", title: "夕凪", progress: 0 },
  { phase: "twilight", chapter: "二", title: "茜さす", progress: 0.3 },
  { phase: "night", chapter: "三", title: "第一夜", progress: 0.44 },
  { phase: "dawn", chapter: "四", title: "夜明け", progress: 0.68 },
  { phase: "day", chapter: "終", title: "昼", progress: 1 },
];

const SAKURA_LABEL: Record<SakuraDensity, string> = {
  off: "花びら: なし",
  light: "花びら: 少し",
  normal: "花びら: いつも",
  gust: "花びら: 突風",
};

const REFRACTION_LABEL: Record<RefractionIntensity, string> = {
  calm: "水面: 静か",
  ripple: "水面: 波紋",
  mirage: "水面: 蜃気楼",
};

function smoothScroll(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(id)
    ?.scrollIntoView({
      behavior: reduced ? "instant" : "smooth",
      block: "start",
    });
}

function scrollToProgress(progress: number) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  window.scrollTo({ top: maxScroll * progress, behavior: reduced ? "instant" : "smooth" });
}

function SakuraLayers({
  density,
  children,
}: {
  density: SakuraDensity;
  children: ReactNode;
}) {
  const active = density !== "off";
  const petalCount = density === "off" ? 0 : density === "light" ? 8 : density === "normal" ? 20 : 48;

  return (
    <SakuraThiefOverlay
      active={active}
      density="gust"
      petalCount={petalCount}
      oilPaint={false}
      className="sakura-layer"
    >
      {children}
    </SakuraThiefOverlay>
  );
}

function ChapterHeading({ chapter, id }: { chapter: Chapter; id: string }) {
  return (
    <header className="chapter-heading">
      <span className="chapter-heading__number" aria-hidden="true">
        {chapter.number}
      </span>
      <div>
        <h2 id={id}>{chapter.title}</h2>
        <p className="chapter-heading__aside">{chapter.aside}</p>
        <p className="chapter-heading__verse">{chapter.verse}</p>
      </div>
      <span className="chapter-heading__rule" aria-hidden="true" />
    </header>
  );
}

function Site() {
  const theme = useAkaneTheme();
  const phase = theme?.phase ?? "dusk";
  const setPhase = theme?.setPhase;
  useScrollReveal();

  useEffect(() => {
    let frame = 0;
    const apply = () => {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = window.scrollY / maxScroll;
      const step = 1 / SCROLL_PHASES.length;
      const index = Math.min(
        SCROLL_PHASES.length - 1,
        Math.floor(progress / step),
      );
      setPhase?.(SCROLL_PHASES[index]);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [setPhase]);

  const [profile, setProfile] = useState<Profile>({ ...PROFILE });
  const [worksFeed, setWorksFeed] = useState<WorksFeed | null>(null);
  const [apiNote, setApiNote] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [memoText, setMemoText] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<MemoReceipt | null>(null);
  const [memoKey, setMemoKey] = useState(0);
  const [sakura, setSakura] = useState<SakuraDensity>("gust");
  const [activeChapter, setActiveChapter] = useState("prologue");
  const [refraction, setRefraction] = useState<RefractionIntensity>("ripple");
  const [verticalCard, setVerticalCard] = useState(false);
  const [showAllWorks, setShowAllWorks] = useState(false);
  const [expandedWork, setExpandedWork] = useState<string | null>(null);

  useEffect(() => {
    const area = document.querySelector<HTMLTextAreaElement>(
      ".akane-notebook__textarea",
    );
    area?.setAttribute("aria-label", "窓の向こうに触れ、一行を書き留める");

    const lines = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".akane-lyrics--interactive .akane-lyrics__line",
      ),
    );
    lines.forEach((line) => {
      line.tabIndex = 0;
      line.setAttribute("role", "button");
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target as HTMLElement;
      if (target.matches(".akane-lyrics--interactive .akane-lyrics__line")) {
        event.preventDefault();
        target.click();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [memoText, verticalCard]);

  const jump = useCallback((id: string) => smoothScroll(id), []);

  const handleSave = useCallback(
    async (entry: { text: string; ink: FountainInk; date?: string }) => {
      try {
        const response = await fetch("/api/memo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: entry.text, ink: entry.ink }),
        });
        if (!response.ok) throw new Error("memo rejected");
        const data = (await response.json()) as MemoReceipt;
        setReceipt(data);
        setMemoText(data.text);
        setApiNote(data.note);
      } catch {
        setReceipt(null);
        setMemoText(entry.text);
        setApiNote("Hono API に届かなかったため、この場にだけ表示しています。");
      }
      setMemoKey((value) => value + 1);
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    fetch("/api/profile")
      .then((response) =>
        response.ok ? (response.json() as Promise<Profile>) : Promise.reject(),
      )
      .then((data) => {
        if (mounted) setProfile(data);
      })
      .catch(() => undefined);

    fetch("/api/works")
      .then((response) =>
        response.ok
          ? (response.json() as Promise<WorksFeed>)
          : Promise.reject(),
      )
      .then((data) => {
        if (mounted) setWorksFeed(data);
      })
      .catch(() => {
        if (mounted)
          setApiNote(
            "Hono API に届かない環境では、本文の作品一覧を表示しています。",
          );
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActiveChapter(current.target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.2, 0.6] },
    );

    CHAPTERS.forEach((chapter) => {
      const element = document.getElementById(chapter.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const cycleSakura = () => {
    const order: SakuraDensity[] = ["off", "light", "normal", "gust"];
    setSakura((current) => order[(order.indexOf(current) + 1) % order.length]);
  };

  const cycleRefraction = () => {
    const order: RefractionIntensity[] = ["calm", "ripple", "mirage"];
    setRefraction(
      (current) => order[(order.indexOf(current) + 1) % order.length],
    );
  };

  const resetMemo = () => {
    setMemoText(null);
    setReceipt(null);
  };

  const visibleWorks = showAllWorks ? WORKS : WORKS.slice(0, 6);

  return (
    <TwilightSky className="portfolio-sky" oilPaint={false}>
      <OilPaintTexture variant="sky" intensity="subtle" className="sky-oil" />
      <Suspense fallback={null}>
        <ThreePaperBook phase={phase} />
      </Suspense>
      <SakuraLayers density={sakura}>
        <a className="skip-link" href="#main">
          本文へ移動
        </a>

        <header className="masthead">
          <a className="masthead__brand" href="#prologue">
            <span className="masthead__mark" aria-hidden="true">
              茜
            </span>
            <span>Tatsuya — 茜の参道</span>
          </a>
          <nav className="chapter-nav" aria-label="章の案内">
            {CHAPTERS.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className={
                  activeChapter === chapter.id ? "is-current" : undefined
                }
                aria-current={
                  activeChapter === chapter.id ? "location" : undefined
                }
              >
                <span aria-hidden="true">{chapter.number}</span> {chapter.title}
              </a>
            ))}
          </nav>
          <p className="masthead__phase">いまの空 — {PHASE_LABEL[phase]}</p>
        </header>

        <nav className="ribbon-rail" aria-label="空の時間を選ぶ">
          {PHASE_RIBBONS.map((ribbon) => (
            <span
              key={ribbon.phase}
              className={
                phase === ribbon.phase
                  ? "ribbon-rail__item is-active"
                  : "ribbon-rail__item"
              }
              aria-current={phase === ribbon.phase ? "step" : undefined}
            >
              <BookmarkRibbon
                chapter={ribbon.chapter}
                title={ribbon.title}
                onClick={() => scrollToProgress(ribbon.progress)}
              />
            </span>
          ))}
          <span className="ribbon-rail__reset">
            <RainRippleButton onClick={() => scrollToProgress(0)}>
              冒頭へ戻す
            </RainRippleButton>
          </span>
        </nav>

        <main id="main" className="page-shell">
          <section
            id="prologue"
            className="chapter chapter--hero"
            aria-labelledby="hero-title"
          >
            <div className="hero-grid">
              <div className="panel hero-main">
                <p className="eyebrow">序 — 参道の入口</p>
                <h1 id="hero-title">{profile.tagline}</h1>
                <p className="hero-role">{profile.role}</p>
                <div className="hero-actions">
                  <RainRippleButton onClick={() => jump("about")}>
                    参道を歩く
                  </RainRippleButton>
                  <RainRippleButton onClick={() => theme?.nextPhase()}>
                    空を進める
                  </RainRippleButton>
                </div>
                <div className="hero-whisper">
                  <WhisperText
                    text="目標は世界のITの頂点。けれど測っているのは、届く距離です。"
                    variant="telepath"
                    animation="wave"
                    speedMs={42}
                  />
                </div>
              </div>
              <aside
                className="panel hero-aside"
                aria-label="このページの手引き"
              >
                <MoonHalo size={72} glow={0.35} />
                <p className="hero-quote">形を守り、中身を作り替える</p>
                <p className="hero-aside__text">
                  五つの栞で空の時間が変わります。雨、茜、第一夜、夜明け、昼。
                </p>
                <WhiteLilySeal
                  caption="白い百合を一輪"
                  onClick={() => jump("colophon")}
                />
              </aside>
            </div>
          </section>

          <section id="about" className="chapter" aria-labelledby="about-title">
            <ChapterHeading id="about-title" chapter={CHAPTERS[1]} />
            <div className="two-column">
              <TrainWindowFrame moving>
                <GhostFlowerRefraction intensity="calm" afterimage caustics>
                  <LetterCard
                    date="経歴 — 事実だけ"
                    signature="Tatsuya"
                    oilPaint
                  >
                    <p>事実だけを書きます。</p>
                    <ul className="fact-list">
                      {ABOUT_FACTS.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                  </LetterCard>
                </GhostFlowerRefraction>
              </TrainWindowFrame>
              <div className="panel note-stack">
                <h3>使っている技術</h3>
                <dl className="skill-list">
                  {SKILLS.map((skill) => (
                    <div key={skill.category}>
                      <dt>{skill.category}</dt>
                      <dd>{skill.names}</dd>
                    </div>
                  ))}
                </dl>
                <p className="skill-after">
                  Rust は自分には合わず、いまは Zig と Odin が中心です。
                </p>
                <h3>学び方と、動き方</h3>
                <ul className="style-list">
                  {WORK_STYLE.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section
            id="philosophy"
            className="chapter"
            aria-labelledby="philosophy-title"
          >
            <ChapterHeading id="philosophy-title" chapter={CHAPTERS[2]} />
            <RelicScene variant="memories" count={14} className="reading-relic">
              <div className="reading-stage">
                <KomorebiLight spots={6} direction="left" />
                <div className="control-row reading-controls">
                  <RainRippleButton
                    onClick={() => setVerticalCard((value) => !value)}
                  >
                    {verticalCard ? "便箋: 横書き" : "便箋: 縦書き"}
                  </RainRippleButton>
                  <RainRippleButton onClick={cycleSakura}>
                    {SAKURA_LABEL[sakura]}
                  </RainRippleButton>
                </div>
                <TrainWindowFrame moving>
                  <GhostFlowerRefraction
                    key={refraction}
                    intensity={refraction}
                    afterimage
                    caustics
                  >
                    <LetterCard
                      date="第一夜 — 朗読"
                      signature={
                        memoText ? "あなたの一行" : "ずっと待っていました"
                      }
                      vertical={verticalCard}
                      oilPaint
                    >
                      {memoText ? (
                        <TypewriterCensorText
                          key={`memo-in-letter-${memoKey}`}
                          text={memoText}
                          speedMs={42}
                        />
                      ) : (
                        <LyricLines
                          lines={LYRICS}
                          currentTime={elapsed}
                          vertical={verticalCard}
                          onLineSelect={(time) => setElapsed(time)}
                        />
                      )}
                      <div className="seal-row">
                        <WhiteLilySeal
                          caption={memoText ? "歌詞へ戻る" : "白い百合を一輪"}
                          onClick={resetMemo}
                        />
                      </div>
                    </LetterCard>
                  </GhostFlowerRefraction>
                </TrainWindowFrame>
              </div>
            </RelicScene>

            <div className="philosophy-grid">
              {PHILOSOPHY.map((item, index) => (
                <GhostFlowerRefraction
                  key={item.title}
                  intensity={index % 3 === 0 ? "ripple" : "calm"}
                  afterimage={false}
                  caustics
                >
                  <LetterCard
                    date={`${item.number} — ${item.title}`}
                    signature={PHASE_LABEL[item.phase]}
                  >
                    {item.censor ? (
                      <TypewriterCensorText text={item.censor} speedMs={42} />
                    ) : (
                      <p>{item.body}</p>
                    )}
                  </LetterCard>
                </GhostFlowerRefraction>
              ))}
            </div>
          </section>

          <section
            id="notebook"
            className="chapter"
            aria-labelledby="notebook-title"
          >
            <ChapterHeading id="notebook-title" chapter={CHAPTERS[3]} />
            <div className="notebook-grid">
              <div className="memo-block panel paper-panel">
                <PaperTexture tone="washi" />
                <div>
                  <h3>朝の手帳 — あなたの一行</h3>
                  <p className="caption">
                    書き留めた一行は、Hono
                    の手帳を通って車窓の便箋に届きます。[[ ]]
                    で黒塗りもできます。
                  </p>
                </div>
                <NotebookMemo
                  date="朝の手帳"
                  defaultInk="crimson"
                  placeholder="窓の向こうに触れ、それを手帳に書き留める……（[[言葉]] で黒塗り指定も可）"
                  onSave={handleSave}
                />
                {apiNote && (
                  <p className="api-note" role="status" aria-live="polite">
                    {apiNote}
                    {receipt &&
                      ` 預かり ${receipt.id.slice(0, 8)} / ${new Date(receipt.receivedAt).toLocaleTimeString("ja-JP")}`}
                  </p>
                )}
                <div className="control-row">
                  <RainRippleButton onClick={() => jump("philosophy")}>
                    車窓の便箋へ
                  </RainRippleButton>
                  <RainRippleButton onClick={resetMemo}>
                    白紙に戻す
                  </RainRippleButton>
                </div>
              </div>
              <aside className="panel memo-aside">
                <WhisperText
                  className="memo-whisper"
                  text="書くことは、残すこと。"
                  variant="envy"
                  animation="wave"
                  speedMs={38}
                />
                <p className="caption">
                  インクは三色。ブルーブラック、茜、セピア。明かしたくない場所だけ、黒く塗ります。
                </p>
                <p className="caption">
                  預かった一行は、この場にだけ置かれます。保存はされません。
                </p>
              </aside>
            </div>
          </section>

          <section id="works" className="chapter" aria-labelledby="works-title">
            <ChapterHeading id="works-title" chapter={CHAPTERS[4]} />
            <div className="panel works-toolbar textured-panel">
              <HalftoneDots angle={0} density={5} tone="ink" />
              <p>
                {worksFeed
                  ? `Hono API から ${worksFeed.total} 件の作品が届きました。`
                  : `${WORKS.length} 件の作品を、本文から表示しています。`}
              </p>
              <div className="status-counts">
                {STATUS_ORDER.map((status) => (
                  <span key={status}>
                    {status}{" "}
                    {worksFeed?.counts[status] ??
                      WORKS.filter((work) => work.status === status).length}
                  </span>
                ))}
              </div>
              <div className="control-row">
                <RainRippleButton onClick={cycleRefraction}>
                  {REFRACTION_LABEL[refraction]}
                </RainRippleButton>
                <RainRippleButton
                  onClick={() => setShowAllWorks((value) => !value)}
                >
                  {showAllWorks ? "一覧を閉じる" : "すべての作品を開く"}
                </RainRippleButton>
              </div>
            </div>

            <div className="works-grid">
              {visibleWorks.map((work, index) => (
                <article key={work.id} className="work-card">
                  <GhostFlowerRefraction
                    intensity={index % 3 === 0 ? refraction : "calm"}
                    afterimage={false}
                    caustics
                  >
                    <LetterCard
                      date={`${work.status} / ${work.category}`}
                      signature={work.title}
                    >
                      <h3>{work.title}</h3>
                      <p>{work.summary}</p>
                      {expandedWork === work.id && (
                        <p className="work-detail">{work.detail}</p>
                      )}
                      <div className="work-actions">
                        <RainRippleButton
                          onClick={() =>
                            setExpandedWork(
                              expandedWork === work.id ? null : work.id,
                            )
                          }
                        >
                          {expandedWork === work.id ? "閉じる" : "続きを読む"}
                        </RainRippleButton>
                        {work.links?.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {link.label} ↗
                          </a>
                        ))}
                      </div>
                    </LetterCard>
                  </GhostFlowerRefraction>
                </article>
              ))}
            </div>
          </section>

          <section id="log" className="chapter" aria-labelledby="log-title">
            <ChapterHeading id="log-title" chapter={CHAPTERS[5]} />
            <LetterCard
              date="日記 — 新しいものが上"
              signature="出来事だけを書いた記録"
            >
              <ol className="log-list">
                {LOG.map((entry) => (
                  <li key={entry.date}>
                    <time
                      dateTime={
                        /^\d{4}-\d{2}(-\d{2})?$/.test(entry.date)
                          ? entry.date
                          : undefined
                      }
                    >
                      {entry.date}
                    </time>
                    <span>{entry.text}</span>
                  </li>
                ))}
              </ol>
            </LetterCard>
          </section>

          <section
            id="influences"
            className="chapter"
            aria-labelledby="influences-title"
          >
            <ChapterHeading id="influences-title" chapter={CHAPTERS[6]} />
            <div className="two-column">
              <LetterCard
                date="名前だけを載せる"
                signature="画像や歌詞は、載せません"
              >
                <ul className="name-list">
                  {INFLUENCES.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </LetterCard>
              <div className="panel note-stack">
                <h3>共通する 4 つの要素</h3>
                <dl className="skill-list">
                  {INFLUENCE_ELEMENTS.map((item) => (
                    <div key={item.element}>
                      <dt>{item.element}</dt>
                      <dd>{item.use}</dd>
                    </div>
                  ))}
                </dl>
                <p className="skill-after">
                  写しているのは、色の考え方、光の扱い、余白、文字の組み方、動きのテンポ、語りの形式です。
                </p>
                <h3>参照している六つの系統</h3>
                <ul className="motif-list">
                  {MOTIF_GLOSSARY.map((motif) => (
                    <li key={motif.id}>{motif.label}</li>
                  ))}
                </ul>
                <SourceChip label="抽象モチーフとして整理" tier="secondary" />
              </div>
            </div>
          </section>

          <section
            id="colophon"
            className="chapter chapter--end"
            aria-labelledby="colophon-title"
          >
            <ChapterHeading id="colophon-title" chapter={CHAPTERS[7]} />
            <RelicScene variant="telepath" count={12} className="end-relic">
              <LetterCard
                date="このサイトについて"
                signature="Tatsuya"
                oilPaint
              >
                <ul className="fact-list">
                  {COLOPHON.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
                <p>連絡手段はいまは GitHub へのリンクだけです。</p>
              </LetterCard>
            </RelicScene>
            <div className="source-row">
              <SourceChip
                label="akane-lib v0.4.9"
                tier="primary"
                href="https://github.com/TatsuyaM2667/akane-lib"
              />
              <SourceChip
                label="この実装"
                tier="secondary"
                href="https://github.com/TatsuyaM2667/Tatsuya-TechPortfolio"
              />
              <SourceChip label="歌詞・映像は複製せず抽象化" tier="secondary" />
            </div>
            <div className="end-seal">
              <TypographicStamp label="終" tone="sepia" />
              <WhiteLilySeal
                caption="参道のはじまりへ"
                onClick={() => jump("prologue")}
              />
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <span>Tatsuya — 茜の参道</span>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub: TatsuyaM2667 ↗
          </a>
          <span>Hono API · Cloudflare Pages</span>
        </footer>
      </SakuraLayers>
    </TwilightSky>
  );
}

export default function App() {
  return (
    <AkaneThemeProvider defaultPhase="dusk">
      <Site />
    </AkaneThemeProvider>
  );
}
