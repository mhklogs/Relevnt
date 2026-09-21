import React, { useState, useEffect, useRef, ReactNode } from "react";
import { GeneratorInputs, OutreachInputs, SearchStrategy, EmailVariation } from "./types";
import SourcingForm from "./components/OutreachForm";
import EmailForm from "./components/EmailForm";
import RelevntLogo from "./components/Logo";
import {
  Sparkles,
  Copy,
  Check,
  Info,
  Search,
  MapPin,
  Building,
  User,
  Lightbulb,
  Mail,
  BookOpen,
  ArrowRight,
  Edit,
  Save,
  RefreshCw,
  X,
  ShieldCheck,
  ListOrdered,
  Gauge,
  Layers,
  Menu,
  CircleCheck,
  Target,
  ChevronDown,
  Radar,
} from "lucide-react";

interface RevealProps {
  children: ReactNode;
  direction?: "left" | "right";
  key?: any;
}

function Reveal({ children, direction = "left" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [children]);

  return (
    <div
      ref={ref}
      className={direction === "left" ? "slide-in-left" : "slide-in-right"}
    >
      {children}
    </div>
  );
}

function AnimateIn({ children, delay = 0, key }: { children: ReactNode; delay?: number; key?: any }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- landing copy ---------- */

const HOW_STEPS = [
  {
    n: "01",
    title: "Paste content + target topic",
    text: "Drop in the draft, outline or live page you are working on, and name the topic you want to own. Relevnt reads structure, claims and coverage in seconds.",
  },
  {
    n: "02",
    title: "Get a readiness score",
    text: "A 0-100 topical-authority score with a plain-English readout of why you scored there, and exactly which signals are pulling you down.",
  },
  {
    n: "03",
    title: "Close the ranked gaps",
    text: "Every missing subtopic, angle and proof point is ranked by the lift it gives your authority. Fix the top one, republish, repeat.",
  },
];

const OUTCOME_PANELS = [
  {
    icon: Gauge,
    title: "A score, not a guess",
    text: "Every piece of content comes back with a 0-100 readiness score and a readout written for the person who owns the topic — not a vague list of suggestions.",
  },
  {
    icon: ListOrdered,
    title: "Gaps ranked by impact",
    text: "Relevnt orders the work by the lift it gives your topical authority, so you always close the highest-impact gap first instead of the loudest one.",
  },
  {
    icon: Layers,
    title: "Wired to the target topic",
    text: "Scoring runs against what the topic actually expects — expected subtopics, depth, angles and evidence — not a keyword list you had to invent.",
  },
  {
    icon: ShieldCheck,
    title: "Runs on your real content",
    text: "Bring drafts, published pages, briefs or prospect research. Paste the work you actually ship, score it, and keep the output for your next publish.",
  },
];

const PRAISE = [
  {
    q: "We started scoring every post before publishing. The ranked gap list caught blind spots no keyword tool ever surfaced — the series now ranks in its second week.",
    n: "Content Lead",
    c: "B2B SaaS, 40-person team",
  },
  {
    q: "I feed it the topics for the quarter and the scorecard tells me which pieces are ready and which read like filler. The editorial queue has never been this focused.",
    n: "SEO Manager",
    c: "Fintech scale-up",
  },
  {
    q: "An agency juggling ten clients should not spend ten review cycles on 'does this cover the topic'. One scored pass and we are done. It bought back my entire edit review.",
    n: "Founder",
    c: "Content agency",
  },
];

const FAQS = [
  {
    q: "What counts as content I can score?",
    a: "Anything you can paste as text: drafts, outlines, briefing notes, published pages, LinkedIn posts, or prospect research. Point Relevnt at the surface you are working on and the target topic you want to own.",
  },
  {
    q: "Is the relevance score a guarantee of ranking?",
    a: "No. It measures topical-authority readiness — how fully your content covers the signals a topic expects. A high score removes the content reasons a page fails to rank, but ranking is decided by the search context you are competing in.",
  },
  {
    q: "How does Relevnt decide which gap to close first?",
    a: "Gaps are ranked by their estimated lift to readiness: missing subtopic clusters, shallow coverage, absent evidence and weak angle differentiation all get ordered by how much they move your score.",
  },
  {
    q: "Do I need a credit card to try it?",
    a: "No. The trial runs on the real content you paste — a live score and ranked gap list, no credit card and no account setup.",
  },
  {
    q: "Where does my content go?",
    a: "What you paste is sent to the model provider to produce the score and gap list, and is not used to train anything. Treat the scorecard like any confidential working document.",
  },
  {
    q: "Can I use the ranked gap list on my own work?",
    a: "Yes — that is the whole point. Run it on drafts in progress, gate work before publishing, or audit the pages you already have. The output is yours to act on.",
  },
];

function ScoreSurface() {
  const gaps = [
    { n: "01", g: 0.84, label: "Subtopic clusters", meta: "coverage depth" },
    { n: "02", g: 0.62, label: "Evidence density", meta: "cite sources" },
    { n: "03", g: 0.47, label: "Angle uniqueness", meta: "differentiate POV" },
  ];
  const R = 34;
  const C = 2 * Math.PI * R;
  const pct = 0.82;

  return (
    <div className="accent-edge panel p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          score run // live
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-volt">
          <span className="pulse-dot flex h-1.5 w-1.5 rounded-full bg-volt" />
          ranked gaps
        </span>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle cx="40" cy="40" r={R} stroke="rgba(140,160,200,0.16)" strokeWidth="6" fill="none" />
            <circle
              cx="40"
              cy="40"
              r={R}
              stroke="#4DE3FF"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold text-glow-volt text-volt">82</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">/ 100</span>
          </div>
        </div>
        <div>
          <p className="font-head text-lg font-semibold uppercase tracking-wide">
            Topical-authority readiness
          </p>
          <p className="mt-1 max-w-[22rem] text-sm leading-relaxed text-ink-soft">
            Score: 82. Strong on coverage, thin on evidence and angle differentiation.
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            target topic: agentic workflows
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-line/60 pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          gaps ranked — close first
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {gaps.map((gap) => (
            <div key={gap.n} className="flex items-center gap-3">
              <span className="w-6 shrink-0 font-mono text-xs text-volt">{gap.n}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-head font-medium text-ink">{gap.label}</span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">
                    {gap.meta}
                  </span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[rgba(140,160,200,0.14)]">
                  <div
                    className="h-full rounded-full bg-volt shadow-[0_0_10px_rgba(77,227,255,0.7)]"
                    style={{ width: `${gap.g * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"sourcing" | "outreach">("sourcing");
  const [menuOpen, setMenuOpen] = useState(false);

  // PWA configurations
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [showIosTooltip, setShowIosTooltip] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setAiConfigured(data ? Boolean(data.aiConfigured) : null))
      .catch(() => setAiConfigured(null));
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // Check if running in standalone PWA mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isIOS && !isStandalone) {
      setShowIosTooltip(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User responded to the install prompt with: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Step 1: Sourcing States
  const [sourcingInputs, setSourcingInputs] = useState<GeneratorInputs>({
    targetDescription: "",
  });
  const [isGeneratingSourcing, setIsGeneratingSourcing] = useState(false);
  const [searchStrategy, setSearchStrategy] = useState<SearchStrategy | null>(null);
  const [sourcingError, setSourcingError] = useState<string | null>(null);

  // Step 2: Outreach States
  const [outreachInputs, setOutreachInputs] = useState<OutreachInputs>({
    prospectName: "David Vance",
    prospectTitle: "VP of Engineering",
    companyName: "CloudScale Systems",
    companyValueProp: "Provides developer-focused cloud auto-scaling infrastructure.",
    senderName: "Sarah Jenkins",
    senderCompany: "NeonQuery",
    senderValueProp: "We help growth-stage SaaS companies reduce server latency by 42% and database cost by 30% through real-time query caching.",
    rawLinkedInActivity: "Just completed our transition from a self-hosted Postgres cluster to serverless databases. The scaling is fantastic, but our query latency in US-East spiked significantly because our connection pooling configuration didn't handle the edge functions correctly. Back to the drawing board on cache strategies. If anyone has tackled edge caching for fast-moving transactional databases, my DMs are open!",
    outreachGoal: "A hyper-personalized B2B cold email under 100 words following the 4-part framework."
  });
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [emailVariations, setEmailVariations] = useState<EmailVariation[] | null>(null);
  const [outreachError, setOutreachError] = useState<string | null>(null);
  const [highlightedPart, setHighlightedPart] = useState<string | null>(null);

  // Copying helper
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Edit states for generated emails
  const [editingVariations, setEditingVariations] = useState<{ [key: number]: boolean }>({});

  const toggleEdit = (index: number) => {
    setEditingVariations(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubjectChange = (index: number, value: string) => {
    if (!emailVariations) return;
    const updated = [...emailVariations];
    updated[index].subjectLine = value;
    setEmailVariations(updated);
  };

  const handleBodyChange = (index: number, value: string) => {
    if (!emailVariations) return;
    const updated = [...emailVariations];
    updated[index].emailBody = value;
    setEmailVariations(updated);
  };

  const handleGenerateFilters = async () => {
    setIsGeneratingSourcing(true);
    setSourcingError(null);
    setSearchStrategy(null);

    try {
      const response = await fetch("/api/generate-search-filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sourcingInputs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.details
          ? `${errorData.error} (Details: ${errorData.details})`
          : (errorData.error || "Generation request failed");
        throw new Error(msg);
      }

      const data = await response.json();
      if (data && data.booleanSearchString) {
        setSearchStrategy(data);
      } else {
        throw new Error("Invalid output format returned by the translation engine.");
      }
    } catch (err: any) {
      console.error(err);
      setSourcingError(err.message || "An unexpected error occurred during parameter generation.");
    } finally {
      setIsGeneratingSourcing(false);
    }
  };

  const handleGenerateOutreach = async () => {
    setIsGeneratingOutreach(true);
    setOutreachError(null);
    setEmailVariations(null);
    setEditingVariations({});

    try {
      const response = await fetch("/api/generate-outreach-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(outreachInputs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.details
          ? `${errorData.error} (Details: ${errorData.details})`
          : (errorData.error || "Generation request failed");
        throw new Error(msg);
      }

      const data = await response.json();
      if (data && data.variations && Array.isArray(data.variations)) {
        setEmailVariations(data.variations);
      } else {
        throw new Error("Invalid output format returned by the copywriting engine.");
      }
    } catch (err: any) {
      console.error(err);
      setOutreachError(err.message || "An unexpected error occurred during copywriting generation.");
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  const copyToClipboard = async (text: string, id: string, htmlText?: string) => {
    try {
      if (htmlText && window.ClipboardItem) {
        const plainBlob = new Blob([text], { type: "text/plain" });
        const htmlBlob = new Blob([htmlText], { type: "text/html" });
        const data = [new ClipboardItem({
          "text/plain": plainBlob,
          "text/html": htmlBlob
        })];
        await navigator.clipboard.write(data);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopiedField(id);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy rich text!", err);
      // Fallback
      try {
        await navigator.clipboard.writeText(text);
        setCopiedField(id);
        setTimeout(() => setCopiedField(null), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed", fallbackErr);
      }
    }
  };

  const getWordCount = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const getMailtoUrl = (variation: EmailVariation) => {
    const subject = encodeURIComponent(variation.subjectLine);
    const body = encodeURIComponent(variation.emailBody);
    return `mailto:?subject=${subject}&body=${body}`;
  };

  const navLinks = [
    { id: "score-form", label: "The workbench" },
    { id: "how", label: "How it works" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-void font-sans text-ink"
      id="app-root"
    >
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50" id="main-header">
        <div className="border-b border-line/70 bg-[#05060b]/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => goTo("top")}
              className="group flex min-w-0 items-center gap-3 cursor-pointer"
              aria-label="Relevnt home"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-panel shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition group-hover:border-volt/50">
                <RelevntLogo size={26} />
              </span>
              <span className="flex min-w-0 flex-col items-start">
                <span className="font-display text-base font-bold uppercase tracking-[0.14em] text-ink">
                  Relevnt
                </span>
                <span className="max-w-full truncate font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                  content ranking agent
                </span>
              </span>
            </button>

            <nav className="hidden items-center gap-7 md:flex">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => goTo(link.id)}
                  className="font-head text-sm font-semibold text-ink-soft transition hover:text-volt cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              {showInstallBtn && (
                <button
                  onClick={handleInstallClick}
                  className="btn-ghost hidden px-4 py-2 text-xs sm:inline-flex cursor-pointer"
                >
                  Install App
                </button>
              )}
              <button
                onClick={() => goTo("score-form")}
                className="btn-volt hidden px-5 py-2.5 text-sm md:inline-flex cursor-pointer"
              >
                Try it free
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="btn-ghost inline-flex h-11 w-11 p-0 md:hidden cursor-pointer"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="border-t border-line/60 bg-[#07090f]/95 px-4 pb-5 pt-3 backdrop-blur-xl md:hidden">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => goTo(link.id)}
                    className="flex items-center justify-between rounded-lg px-3 py-3 font-head text-sm font-semibold text-ink-soft transition hover:bg-white/5 hover:text-volt cursor-pointer"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-muted" />
                  </button>
                ))}
                {showInstallBtn && (
                  <button
                    onClick={handleInstallClick}
                    className="btn-ghost mt-2 px-4 py-3 text-sm cursor-pointer"
                  >
                    Install App
                  </button>
                )}
              </nav>
              <button
                onClick={() => goTo("score-form")}
                className="btn-volt mt-3 w-full px-4 py-3 text-sm cursor-pointer"
              >
                Try it free — paste your content + target topic
              </button>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden" id="top">
          <div className="absolute inset-0">
            <div className="absolute inset-0 hud-grid" />
            <div className="aurora -top-24 left-[12%] h-80 w-80 bg-volt/15" />
            <div className="aurora top-16 right-[6%] h-72 w-72 bg-[#4EF2BA]/10" />
            <div className="absolute -bottom-20 left-1/2 h-64 w-[130%] -translate-x-1/2 rounded-[100%] bg-volt/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <AnimateIn>
                  <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs">
                    <RelevntLogo size={15} />
                    <span className="font-head font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      Content relevance &amp; ranking agent
                    </span>
                  </span>
                </AnimateIn>

                <AnimateIn delay={80}>
                  <h1 className="mt-7 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                    Know your{" "}
                    <span className="text-glow-volt text-volt">relevance score</span>{" "}
                    before you publish
                  </h1>
                </AnimateIn>

                <AnimateIn delay={160}>
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
                    Relevnt scores any piece of content against the target topic you
                    want to own — topical-authority readiness in seconds, with the
                    gaps ranked in the order to close them.
                  </p>
                </AnimateIn>

                <AnimateIn delay={240}>
                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => goTo("score-form")}
                      className="btn-volt px-7 py-3.5 text-sm cursor-pointer"
                    >
                      Try Relevnt free
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => goTo("how")}
                      className="btn-ghost px-7 py-3.5 text-sm cursor-pointer"
                    >
                      See how it works
                    </button>
                  </div>
                  <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    Try it free — paste your content + target topic
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                    {["1 free trial run", "No credit card", "Runs on your content"].map((chip) => (
                      <span key={chip} className="flex items-center gap-1.5 font-mono text-xs text-muted">
                        <CircleCheck className="h-3.5 w-3.5 text-mint" />
                        {chip}
                      </span>
                    ))}
                  </div>
                </AnimateIn>
              </div>

              <AnimateIn delay={200}>
                <RevealScoreWrap>
                  <ScoreSurface />
                </RevealScoreWrap>
              </AnimateIn>
            </div>

            <AnimateIn delay={320}>
              <div className="mt-14 grid grid-cols-2 gap-6 border-t border-line/60 pt-8 sm:grid-cols-4">
                <div className="text-center">
                  <p className="font-display text-3xl text-glow-white md:text-4xl">0-100</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">relevance score</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-3xl text-glow-white md:text-4xl">ranked</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">gap list</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-3xl text-glow-white md:text-4xl">30s</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">to first score</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-3xl text-glow-white md:text-4xl">0</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">credit cards</p>
                </div>
              </div>
            </AnimateIn>
          </div>

          <div className="flex justify-center pb-6">
            <ChevronDown className="h-6 w-6 animate-bounce text-muted" />
          </div>
        </section>

        {/* ================= WORKBENCH ================= */}
        <section className="relative overflow-hidden" id="score-form">
          <div className="absolute inset-0">
            <div className="aurora -top-16 right-[20%] h-72 w-72 bg-volt/10" />
            <div className="absolute inset-0 hud-grid opacity-60" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
            <AnimateIn>
              <div className="max-w-2xl">
                <p className="eyebrow">the workbench</p>
                <h2 className="mt-2 font-display text-3xl uppercase tracking-tight md:text-4xl">
                  Run a free score on your real work
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-base">
                  Paste the target topic and the content you are working with. Relevnt
                  turns it into a scored, structured readout and ranked action list you
                  can act on immediately.
                </p>
              </div>
            </AnimateIn>

            <AnimateIn delay={120}>
              {/* iOS installation tip */}
              {showIosTooltip && (
                <div
                  className="accent-edge panel mt-8 flex items-center justify-between gap-3 p-4 text-xs text-[#9beaff]"
                  id="ios-pwa-tooltip"
                >
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 shrink-0 text-volt" />
                    <span>
                      <strong className="text-ink">iOS PWA Tip:</strong> Tap the{" "}
                      <strong className="text-ink">Share</strong> icon in Safari, then select{" "}
                      <strong className="text-ink">Add to Home Screen</strong> to install this tool.
                    </span>
                  </div>
                  <button
                    onClick={() => setShowIosTooltip(false)}
                    className="rounded-lg p-1 text-volt transition hover:bg-white/5 cursor-pointer"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {aiConfigured === false && (
                <div
                  className="accent-edge panel mt-8 flex items-center justify-between gap-3 border-l-4 border-l-amber p-4 text-xs text-amber"
                  id="api-key-banner"
                >
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 shrink-0 text-amber" />
                    <span>
                      <strong className="text-ink">AI not configured:</strong> Add a{" "}
                      <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-amber">GEMINI_API_KEY</code>{" "}
                      to your server environment to unlock scoring. The rest of the app works fine.
                    </span>
                  </div>
                  <button
                    onClick={() => setAiConfigured(null)}
                    className="rounded-lg p-1 text-amber transition hover:bg-white/5 cursor-pointer"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </AnimateIn>

            {/* Navigation Tabs */}
            <div className="mt-10 flex flex-wrap gap-2 border-b border-line/60" id="workflow-tabs">
              <button
                onClick={() => setActiveTab("sourcing")}
                className={`flex items-center gap-2 border-b-2 pb-3.5 pt-1 text-sm font-head font-semibold transition cursor-pointer ${
                  activeTab === "sourcing"
                    ? "border-volt text-volt"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <Target className="h-4 w-4" />
                1. Sourcing Strategy
              </button>
              <button
                onClick={() => setActiveTab("outreach")}
                className={`flex items-center gap-2 border-b-2 pb-3.5 pt-1 text-sm font-head font-semibold transition cursor-pointer ${
                  activeTab === "outreach"
                    ? "border-volt text-volt"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <Mail className="h-4 w-4" />
                2. Personalize Outreach
              </button>
            </div>

            {/* Tab Content 1: SOURCING STRATEGY */}
            {activeTab === "sourcing" && (
              <div className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-12 animate-scale-up" id="sourcing-tab-grid">
                <div className="flex flex-col gap-6 lg:col-span-5">
                  <Reveal direction="left">
                    <div className="flex items-center justify-between">
                      <h2 className="font-head text-base font-semibold text-ink flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-volt/15 font-mono text-[10px] text-volt shrink-0 border border-volt/30">1</span>
                        Target Input
                      </h2>
                    </div>
                    <SourcingForm
                      inputs={sourcingInputs}
                      setInputs={setSourcingInputs}
                      onSubmit={handleGenerateFilters}
                      isGenerating={isGeneratingSourcing}
                    />
                  </Reveal>
                </div>

                <div className="flex flex-col gap-6 lg:col-span-7">
                  <div className="flex items-center justify-between">
                    <h2 className="font-head text-base font-semibold text-ink flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-volt/15 font-mono text-[10px] text-volt shrink-0 border border-volt/30">2</span>
                      Ranked Strategy
                    </h2>
                  </div>

                  {isGeneratingSourcing && (
                    <div className="panel flex min-h-[420px] flex-col items-center justify-center gap-5 p-12 text-center">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-volt/10">
                        <Radar className="h-7 w-7 animate-spin text-volt" />
                        <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-volt">
                          <span className="opacity-0">.</span>
                        </span>
                      </div>
                      <div className="max-w-sm">
                        <h3 className="font-head text-sm font-semibold text-ink">Parsing Sourcing Request</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                          Structuring job title clusters, mapping target industry categories, and formulating the Boolean search syntax...
                        </p>
                      </div>
                      <div className="mt-2 h-1 w-48 overflow-hidden rounded-full border border-line bg-[#1c2333]">
                        <div className="h-1 animate-infinite-loading rounded-full bg-volt"></div>
                      </div>
                    </div>
                  )}

                  {!isGeneratingSourcing && sourcingError && (
                    <div className="panel flex flex-col gap-3 border-[#ff5f77]/40 p-6">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 shrink-0 text-[#ff7a8a]" />
                        <span className="font-head text-sm font-semibold text-[#ffc4cc]">
                          Failed to generate search parameters
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#ffa2ae]">
                        {sourcingError}. Please check your connection or try again.
                      </p>
                      <button
                        onClick={handleGenerateFilters}
                        className="btn-ghost self-start px-4 py-2 text-xs cursor-pointer"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!isGeneratingSourcing && !searchStrategy && !sourcingError && (
                    <div className="panel flex min-h-[420px] flex-col items-center justify-center gap-5 p-12 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-white/5 text-muted">
                        <Search className="h-6 w-6" />
                      </span>
                      <div className="max-w-md">
                        <h3 className="font-head text-sm font-semibold text-ink">No Strategy Generated</h3>
                        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                          Enter your target segment on the left, then hit generate to get your ranked, structured strategy.
                        </p>
                      </div>
                    </div>
                  )}

                  {!isGeneratingSourcing && searchStrategy && (
                    <div className="flex flex-col gap-6 animate-scale-up" id="sourcing-results">
                      {/* Step-by-Step Walkthrough */}
                      <Reveal direction="right">
                        <div className="panel flex flex-col gap-4 p-5">
                          <div className="flex items-center gap-2 border-b border-line/60 pb-3">
                            <span className="eyebrow flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-volt" />
                              Step-by-Step Sourcing Workflow
                            </span>
                          </div>
                          <div className="flex flex-col gap-4 text-xs">
                            <div className="flex gap-3">
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-volt/40 bg-volt/10 font-mono text-[10px] font-bold text-volt">
                                1
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-head font-semibold text-ink">Navigate to LinkedIn</span>
                                <p className="leading-relaxed text-ink-soft">
                                  Go to{" "}
                                  <a href="https://www.linkedin.com/search/results/people/" target="_blank" rel="noreferrer" className="text-volt hover:underline mx-1">LinkedIn Standard</a>
                                  or{" "}
                                  <a href="https://www.linkedin.com/sales/search/people" target="_blank" rel="noreferrer" className="text-volt hover:underline mx-1">Sales Navigator</a>.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-volt/40 bg-volt/10 font-mono text-[10px] font-bold text-volt">
                                2
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-head font-semibold text-ink">Apply Boolean Search String</span>
                                <p className="leading-relaxed text-ink-soft">
                                  Copy the generated Boolean Search String (shown below) and paste it into the primary search bar or the Keywords filter.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-volt/40 bg-volt/10 font-mono text-[10px] font-bold text-volt">
                                3
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-head font-semibold text-ink">Configure Sidebar Filters</span>
                                <p className="leading-relaxed text-ink-soft">Set up the sidebar criteria:</p>
                                <ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-ink-soft">
                                  <li>Location: <span className="font-medium text-ink">{searchStrategy.locationFilters}</span></li>
                                  <li>Industry: <span className="font-medium text-ink">{searchStrategy.industryFilters}</span></li>
                                  <li>Size: <span className="font-medium text-ink">{searchStrategy.companySize}</span></li>
                                </ul>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-volt/40 bg-volt/10 font-mono text-[10px] font-bold text-volt">
                                4
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-head font-semibold text-ink">Personalize Email (Next Step)</span>
                                <p className="leading-relaxed text-ink-soft">
                                  Once you find a matching profile (e.g. {searchStrategy.targetPersona}), copy their recent LinkedIn Activity post, then click below to personalize outreach!
                                </p>
                                <button
                                  onClick={() => setActiveTab("outreach")}
                                  className="btn-ghost mt-2 self-start px-3 py-1.5 text-xs cursor-pointer"
                                >
                                  Go to Personalize Email
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Reveal>

                      {/* Main Boolean String Card */}
                      <Reveal direction="right">
                        <div className="accent-edge panel overflow-hidden overflow-x-auto">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 bg-panel-2/60 px-5 py-4">
                            <span className="eyebrow">Boolean Search String</span>
                            <button
                              onClick={() => copyToClipboard(searchStrategy.booleanSearchString, "booleanSearchString")}
                              className="btn-ghost px-3 py-1.5 text-xs cursor-pointer"
                            >
                              {copiedField === "booleanSearchString" ? <Check className="h-3.5 w-3.5 text-mint" /> : <Copy className="h-3.5 w-3.5" />}
                              {copiedField === "booleanSearchString" ? "Copied" : "Copy String"}
                            </button>
                          </div>
                          <div className="bg-[#07090f] p-5">
                            <p className="select-all break-words font-mono text-sm leading-relaxed text-[#9beaff]">
                              {searchStrategy.booleanSearchString}
                            </p>
                          </div>
                        </div>
                      </Reveal>

                      {/* Filters Grid */}
                      <Reveal direction="right">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="panel p-4">
                            <span className="eyebrow flex items-center gap-1.5 border-b border-line/60 pb-2">
                              <User className="h-3.5 w-3.5 text-mint" /> Target Persona
                            </span>
                            <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-ink">{searchStrategy.targetPersona}</p>
                          </div>
                          <div className="panel p-4">
                            <span className="eyebrow flex items-center gap-1.5 border-b border-line/60 pb-2">
                              <Building className="h-3.5 w-3.5 text-volt" /> Industry Filters
                            </span>
                            <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-ink">{searchStrategy.industryFilters}</p>
                          </div>
                          <div className="panel p-4">
                            <span className="eyebrow flex items-center gap-1.5 border-b border-line/60 pb-2">
                              <MapPin className="h-3.5 w-3.5 text-[#8F7BFF]" /> Location Filters
                            </span>
                            <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-ink">{searchStrategy.locationFilters}</p>
                          </div>
                          <div className="panel p-4">
                            <span className="eyebrow flex items-center gap-1.5 border-b border-line/60 pb-2">
                              <Building className="h-3.5 w-3.5 text-amber" /> Company Size
                            </span>
                            <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-ink">{searchStrategy.companySize}</p>
                          </div>
                        </div>
                      </Reveal>

                      <Reveal direction="right">
                        <div className="panel flex flex-col gap-3 border-volt/25 p-5 sm:flex-row sm:items-start">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-volt/30 bg-volt/10 text-volt">
                            <Lightbulb className="h-4 w-4" />
                          </span>
                          <div>
                            <h4 className="eyebrow">Tactical Pro Tip</h4>
                            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{searchStrategy.proTip}</p>
                          </div>
                        </div>
                      </Reveal>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab Content 2: PERSONALIZE OUTREACH */}
            {activeTab === "outreach" && (
              <div className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-12 animate-scale-up" id="outreach-tab-grid">
                <div className="flex flex-col gap-6 lg:col-span-5">
                  <Reveal direction="left">
                    <div className="flex items-center justify-between">
                      <h2 className="font-head text-base font-semibold text-ink flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-volt/15 font-mono text-[10px] text-volt shrink-0 border border-volt/30">1</span>
                        Target Profile &amp; Sender Details
                      </h2>
                    </div>
                    <EmailForm
                      inputs={outreachInputs}
                      setInputs={setOutreachInputs}
                      onSubmit={handleGenerateOutreach}
                      isGenerating={isGeneratingOutreach}
                    />
                  </Reveal>
                </div>

                <div className="flex flex-col gap-6 lg:col-span-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-head text-base font-semibold text-ink flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-volt/15 font-mono text-[10px] text-volt shrink-0 border border-volt/30">2</span>
                      Personalized Cold Outbounds
                    </h2>

                    {emailVariations && (
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono text-xs text-muted">Highlight:</span>
                        <div className="flex flex-wrap gap-1 rounded-lg border border-line bg-panel p-0.5">
                          {[
                            { id: "hook", label: "Hook", active: "bg-mint/15 text-mint border-mint/40", muted: "text-muted" },
                            { id: "bridge", label: "Bridge", active: "bg-volt/15 text-volt border-volt/40", muted: "text-muted" },
                            { id: "proof", label: "Proof", active: "bg-[#8F7BFF]/20 text-[#b6a8ff] border-[#8F7BFF]/50", muted: "text-muted" },
                            { id: "cta", label: "CTA", active: "bg-amber/15 text-amber border-amber/40", muted: "text-muted" },
                          ].map((btn) => (
                            <button
                              key={btn.id}
                              onClick={() => setHighlightedPart(highlightedPart === btn.id ? null : btn.id)}
                              className={`rounded-md border px-2 py-1 text-[10px] font-medium transition cursor-pointer ${
                                highlightedPart === btn.id ? `${btn.active} shadow-xs` : `${btn.muted} border-transparent hover:text-ink`
                              }`}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {isGeneratingOutreach && (
                    <div className="panel flex min-h-[420px] flex-col items-center justify-center gap-5 p-12 text-center">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-volt/10">
                        <Radar className="h-7 w-7 animate-spin text-volt" />
                        <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-volt">
                          <span className="opacity-0">.</span>
                        </span>
                      </div>
                      <div className="max-w-sm">
                        <h3 className="font-head text-sm font-semibold text-ink">Writing 1-to-1 Outreach Copy</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                          Analyzing {outreachInputs.prospectName}'s recent post keywords to write a hyper-personalized trigger hook under 100 words...
                        </p>
                      </div>
                      <div className="mt-2 h-1 w-48 overflow-hidden rounded-full border border-line bg-[#1c2333]">
                        <div className="h-1 animate-infinite-loading rounded-full bg-volt"></div>
                      </div>
                    </div>
                  )}

                  {!isGeneratingOutreach && outreachError && (
                    <div className="panel flex flex-col gap-3 border-[#ff5f77]/40 p-6">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 shrink-0 text-[#ff7a8a]" />
                        <span className="font-head text-sm font-semibold text-[#ffc4cc]">Failed to generate emails</span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#ffa2ae]">
                        {outreachError}. Ensure all fields are correctly filled or try again.
                      </p>
                      <button
                        onClick={handleGenerateOutreach}
                        className="btn-ghost self-start px-4 py-2 text-xs cursor-pointer"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!isGeneratingOutreach && !emailVariations && !outreachError && (
                    <div className="panel flex min-h-[420px] flex-col items-center justify-center gap-5 p-12 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-white/5 text-muted">
                        <Mail className="h-6 w-6" />
                      </span>
                      <div className="max-w-md">
                        <h3 className="font-head text-sm font-semibold text-ink">No Outreach Emails Drafted Yet</h3>
                        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                          Fill out the prospect's profile and paste their LinkedIn activity on the left, then hit generate.
                        </p>
                      </div>
                    </div>
                  )}

                  {!isGeneratingOutreach && emailVariations && (
                    <div className="flex flex-col gap-6 animate-scale-up" id="outreach-results">
                      {emailVariations.map((variation, index) => {
                        const totalWords = getWordCount(variation.emailBody);
                        const isWordCountCompliant = totalWords <= 100;

                        // Check if content has been manually edited compared to the AI blueprint
                        const originalCombined = `${variation.frameworkBreakdown.triggerHook} ${variation.frameworkBreakdown.empathyBridge} ${variation.frameworkBreakdown.valueProof} ${variation.frameworkBreakdown.lowFrictionCta}`.replace(/\s+/g, ' ').trim();
                        const currentBody = variation.emailBody.replace(/\s+/g, ' ').trim();
                        const hasBeenModified = originalCombined !== currentBody;

                        return (
                          <Reveal key={index} direction="right">
                            <div className="panel flex flex-col overflow-hidden">
                              {/* Card Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 bg-panel-2/60 px-5 py-4">
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="eyebrow">Variation 0{index + 1}</span>

                                  <button
                                    onClick={() => toggleEdit(index)}
                                    className="btn-ghost px-2 py-1 text-[10px] cursor-pointer"
                                  >
                                    {editingVariations[index] ? (
                                      <>
                                        <Save className="h-3 w-3 text-volt" />
                                        Save
                                      </>
                                    ) : (
                                      <>
                                        <Edit className="h-3 w-3 text-volt" />
                                        Edit Copy
                                      </>
                                    )}
                                  </button>

                                  <button
                                    onClick={handleGenerateOutreach}
                                    className="btn-ghost px-2 py-1 text-[10px] cursor-pointer"
                                    title="Regenerate all variations"
                                  >
                                    <RefreshCw className="h-3 w-3 text-volt" />
                                    Regenerate
                                  </button>
                                </div>

                                <div
                                  className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
                                    isWordCountCompliant
                                      ? "border-mint/40 bg-mint/10 text-mint"
                                      : "border-[#ff5f77]/50 bg-[#ff5f77]/10 text-[#ff8fa0]"
                                  }`}
                                >
                                  <span className="font-bold">{totalWords}</span> / 100 words
                                </div>
                              </div>

                              {/* Subject */}
                              <div className="flex items-center gap-3 border-b border-line/60 bg-[#07090f] px-5 py-3.5">
                                <span className="font-mono text-xs text-muted">Subject:</span>
                                {editingVariations[index] ? (
                                  <input
                                    type="text"
                                    value={variation.subjectLine}
                                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                                    className="input-field w-full max-w-none text-sm italic"
                                  />
                                ) : (
                                  <span className="text-sm font-medium italic text-ink">"{variation.subjectLine}"</span>
                                )}
                                {!editingVariations[index] && (
                                  <button
                                    onClick={() => copyToClipboard(variation.subjectLine, `subject-${index}`)}
                                    className="ml-auto rounded-md p-1 text-muted transition hover:bg-white/5 hover:text-ink cursor-pointer"
                                  >
                                    {copiedField === `subject-${index}` ? <Check className="h-3.5 w-3.5 text-mint" /> : <Copy className="h-3.5 w-3.5" />}
                                  </button>
                                )}
                              </div>

                              {/* Body */}
                              <div className="p-6">
                                {editingVariations[index] ? (
                                  <textarea
                                    value={variation.emailBody}
                                    onChange={(e) => handleBodyChange(index, e.target.value)}
                                    className="input-field min-h-[160px] resize-y text-sm leading-relaxed"
                                  />
                                ) : hasBeenModified ? (
                                  <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-[#e7e5e4]">
                                    {variation.emailBody}
                                  </p>
                                ) : highlightedPart ? (
                                  <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-[#e7e5e4]">
                                    <span className={highlightedPart === "hook" ? "rounded border border-mint/40 bg-mint/10 px-1 py-0.5 font-medium text-mint" : ""}>
                                      {variation.frameworkBreakdown.triggerHook}
                                    </span>{" "}
                                    <span className={highlightedPart === "bridge" ? "rounded border border-volt/40 bg-volt/10 px-1 py-0.5 font-medium text-volt" : ""}>
                                      {variation.frameworkBreakdown.empathyBridge}
                                    </span>{" "}
                                    <span className={highlightedPart === "proof" ? "rounded border border-[#8F7BFF]/50 bg-[#8F7BFF]/15 px-1 py-0.5 font-medium text-[#b6a8ff]" : ""}>
                                      {variation.frameworkBreakdown.valueProof}
                                    </span>{" "}
                                    <span className={highlightedPart === "cta" ? "rounded border border-amber/40 bg-amber/10 px-1 py-0.5 font-medium text-amber" : ""}>
                                      {variation.frameworkBreakdown.lowFrictionCta}
                                    </span>
                                  </p>
                                ) : (
                                  <div
                                    className="email-html-content font-sans text-sm leading-relaxed text-[#e7e5e4]"
                                    dangerouslySetInnerHTML={{ __html: variation.emailBodyHtml || variation.emailBody.replace(/\n/g, '<br/>') }}
                                  />
                                )}
                              </div>

                              {/* Empathy blueprint */}
                              <div className="flex flex-col gap-3 border-t border-line/60 bg-panel-2/40 p-5">
                                <span className="eyebrow flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" /> Copy Blueprint
                                </span>
                                <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
                                  <div className="rounded-lg border border-line bg-[#07090f] p-3">
                                    <span className="font-head font-bold text-mint block mb-1">1. Trigger Hook</span>
                                    <p className="text-[11px] leading-relaxed text-[#cdd6ee]">{variation.frameworkBreakdown.triggerHook}</p>
                                  </div>
                                  <div className="rounded-lg border border-line bg-[#07090f] p-3">
                                    <span className="font-head font-bold text-volt block mb-1">2. Empathy Bridge</span>
                                    <p className="text-[11px] leading-relaxed text-[#cdd6ee]">{variation.frameworkBreakdown.empathyBridge}</p>
                                  </div>
                                  <div className="rounded-lg border border-line bg-[#07090f] p-3">
                                    <span className="font-head font-bold text-[#b6a8ff] block mb-1">3. Value Proof</span>
                                    <p className="text-[11px] leading-relaxed text-[#cdd6ee]">{variation.frameworkBreakdown.valueProof}</p>
                                  </div>
                                  <div className="rounded-lg border border-line bg-[#07090f] p-3">
                                    <span className="font-head font-bold text-amber block mb-1">4. Low-Friction CTA</span>
                                    <p className="text-[11px] leading-relaxed text-[#cdd6ee]">{variation.frameworkBreakdown.lowFrictionCta}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/60 px-5 py-3.5">
                                <span className="font-mono text-[11px] text-muted">
                                  Target: {outreachInputs.prospectName} ({outreachInputs.companyName})
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  <a
                                    href={getMailtoUrl(variation)}
                                    className="btn-ghost px-3.5 py-1.5 text-xs cursor-pointer no-underline"
                                  >
                                    <Mail className="h-3.5 w-3.5" /> Draft in Client
                                  </a>
                                  <button
                                    onClick={() => copyToClipboard(`Subject: ${variation.subjectLine}\n\n${variation.emailBody}`, `full-${index}`, `<strong>Subject:</strong> ${variation.subjectLine}<br/><br/>${variation.emailBodyHtml || variation.emailBody.replace(/\n/g, '<br/>')}`)}
                                    className="btn-volt px-3.5 py-1.5 text-xs cursor-pointer"
                                  >
                                    {copiedField === `full-${index}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                    {copiedField === `full-${index}` ? "Copied" : "Copy Full Email"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Reveal>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="relative border-y border-line/60 bg-abyss py-20" id="how">
          <div className="mx-auto max-w-6xl px-5 md:px-6">
            <AnimateIn>
              <p className="text-center eyebrow">three steps</p>
              <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-3xl uppercase tracking-tight md:text-5xl">
                From draft to scored, ranked and ready
              </h2>
            </AnimateIn>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {HOW_STEPS.map((s, i) => (
                <AnimateIn key={s.n} delay={i * 100}>
                  <div className="panel hover-glow p-7">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-4xl text-muted">{s.n}</span>
                      {i < 2 && <ArrowRight className="hidden h-5 w-5 text-muted md:block" />}
                    </div>
                    <h3 className="mt-4 font-head text-lg font-semibold uppercase tracking-wide">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ================= OUTCOMES ================= */}
        <section className="mx-auto max-w-6xl px-5 py-20 md:px-6">
          <AnimateIn>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
              <div>
                <div className="flex items-center gap-3">
                  <span className="logo-tile flex h-14 w-14 items-center justify-center">
                    <RelevntLogo size={34} />
                  </span>
                  <div>
                    <p className="eyebrow">why relevnt</p>
                    <h2 className="mt-1 font-display text-2xl uppercase tracking-tight md:text-3xl">
                      Built for work that ships
                    </h2>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-ink-soft md:text-base">
                  Relevnt is built the way a content team actually works: score
                  everything, rank the work, ship with a reason. The output is a
                  verdict and a plan, not another opinion.
                </p>
                <button
                  onClick={() => goTo("score-form")}
                  className="mt-6 inline-flex items-center gap-2 font-head text-sm font-semibold text-volt transition hover:text-white cursor-pointer"
                >
                  Run a free score <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {OUTCOME_PANELS.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <AnimateIn key={f.title} delay={i * 90}>
                      <div className="accent-edge panel flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
                        <span className="logo-tile flex h-12 w-12 shrink-0 items-center justify-center">
                          <Icon className="h-5 w-5 text-volt" />
                        </span>
                        <div>
                          <h3 className="font-head text-lg font-semibold">{f.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.text}</p>
                        </div>
                      </div>
                    </AnimateIn>
                  );
                })}
              </div>
            </div>
          </AnimateIn>
        </section>

        {/* ================= PRAISE ================= */}
        <section className="relative border-y border-line/60 bg-abyss py-20">
          <div className="absolute inset-0">
            <div className="aurora -top-20 left-[10%] h-72 w-72 bg-volt/10" />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 md:px-6">
            <AnimateIn>
              <p className="text-center eyebrow">content team reports</p>
              <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-3xl uppercase tracking-tight md:text-4xl">
                What teams do with the score
              </h2>
            </AnimateIn>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PRAISE.map((t, i) => (
                <AnimateIn key={t.n} delay={i * 90}>
                  <figure className="panel flex h-full flex-col p-7">
                    <blockquote className="flex-1 text-sm leading-relaxed text-ink-soft">
                      "{t.q}"
                    </blockquote>
                    <figcaption className="mt-6 border-t border-line/60 pt-4">
                      <p className="font-head text-sm font-semibold">{t.n}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted">{t.c}</p>
                    </figcaption>
                  </figure>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="mx-auto max-w-3xl px-5 py-20 md:px-6" id="faq">
          <AnimateIn>
            <p className="text-center eyebrow">straight answers</p>
            <h2 className="mt-2 text-center font-display text-3xl uppercase tracking-tight md:text-4xl">
              Before you ask
            </h2>
          </AnimateIn>

          <div className="mt-10 space-y-3">
            {FAQS.map((f, i) => (
              <AnimateIn key={f.q} delay={i * 60}>
                <details className="panel group overflow-hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-head font-semibold">
                    {f.q}
                    <span className="text-xl leading-none text-volt transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              </AnimateIn>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="relative overflow-hidden pb-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 hud-grid" />
            <div className="aurora -bottom-24 right-[15%] h-80 w-80 bg-volt/15" />
            <div className="aurora -top-16 left-[10%] h-64 w-64 bg-[#4EF2BA]/10" />
          </div>
          <AnimateIn>
            <div className="accent-edge panel mx-auto max-w-4xl p-8 text-center md:p-12">
              <span className="mx-auto flex h-14 w-14 items-center justify-center">
                <RelevntLogo size={40} />
              </span>
              <p className="mt-4 eyebrow">go operational</p>
              <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl uppercase tracking-tight md:text-5xl">
                Your next publish should earn its rank
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">
                Score it free against the topic you are gunning for. No card, no
                setup — paste your content and target topic, get a ranked gap list.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => goTo("score-form")}
                  className="btn-volt px-8 py-3.5 text-sm cursor-pointer"
                >
                  Try it free
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => goTo("how")}
                  className="btn-ghost px-8 py-3.5 text-sm cursor-pointer"
                >
                  How it works
                </button>
              </div>
            </div>
          </AnimateIn>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-line/60 bg-abyss py-10" id="main-footer">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-start lg:px-8">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2.5">
              <RelevntLogo size={22} />
              <span className="font-display text-sm font-bold uppercase tracking-[0.16em]">Relevnt</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Content relevance &amp; ranking agent
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => goTo(link.id)}
                  className="font-head text-xs font-semibold text-ink-soft transition hover:text-volt cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="https://github.com/mhklogs/Relevnt"
                target="_blank"
                rel="noreferrer"
                className="font-head text-xs font-semibold text-volt transition hover:text-white"
              >
                View Source
              </a>
            </nav>
            <p className="font-mono text-[11px] text-muted">
              © 2026 Relevnt. Built for the work that ships.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RevealScoreWrap({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="animate-scale-up">
      {children}
    </div>
  );
}