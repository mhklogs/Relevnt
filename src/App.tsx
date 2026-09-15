import React, { useState, useEffect, useRef, ReactNode } from "react";
import { GeneratorInputs, OutreachInputs, SearchStrategy, EmailVariation } from "./types";
import SourcingForm from "./components/OutreachForm";
import EmailForm from "./components/EmailForm";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Info, 
  Award, 
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
  X
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

export default function App() {
  const [activeTab, setActiveTab] = useState<"sourcing" | "outreach">("sourcing");

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
  const [editingVariations, setEditingVariations] = useState<{[key: number]: boolean}>({});

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

  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#fafaf9] font-sans selection:bg-red-950" id="app-root">
      {/* Header Banner */}
      <header className="border-b border-[#292524] bg-[#0c0a09] sticky top-0 z-10 shadow-xs" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#fafaf9] p-2 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                <path d="M2 16 Q 9 4, 16 16 T 30 16" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
                <path d="M6 20 Q 11 11, 16 20 T 26 20" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-wider text-[#fafaf9]" style={{ fontFamily: "'RusticRoadway', sans-serif" }}>Relevnt</span>
                <span className="px-2 py-0.5 bg-[#1c1917] text-[10px] font-semibold text-[#a8a29e] rounded-full border border-[#292524]">
                  B2B OUTBOUND SUITE
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                Install App
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-container">
        
        {/* iOS installation tip */}
        {showIosTooltip && (
          <div className="mb-6 bg-[#0c4a6e]/20 border border-[#0284c7]/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-[#0ea5e9] shrink-0" id="ios-pwa-tooltip">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-[#38bdf8]" />
              <span>
                <strong>iOS PWA Tip:</strong> Tap the <strong>Share</strong> icon in Safari, then select <strong>Add to Home Screen</strong> to install this tool.
              </span>
            </div>
            <button
              onClick={() => setShowIosTooltip(false)}
              className="text-[#0ea5e9] hover:text-[#38bdf8] p-1 cursor-pointer rounded-lg hover:bg-sky-950/40 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {aiConfigured === false && (
          <div className="mb-6 bg-amber-950/30 border border-amber-600/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-amber-200 shrink-0" id="api-key-banner">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>AI not configured:</strong> Add a <code className="bg-amber-900/40 px-1 py-0.5 rounded">GEMINI_API_KEY</code> to your server environment to unlock AI generation. The rest of the app works fine.
              </span>
            </div>
            <button
              onClick={() => setAiConfigured(null)}
              className="text-amber-300 hover:text-amber-100 p-1 cursor-pointer rounded-lg hover:bg-amber-900/40 transition-all"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#292524] mb-8 gap-4" id="workflow-tabs">
          <button
            onClick={() => setActiveTab("sourcing")}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
              activeTab === "sourcing"
                ? "border-red-500 text-red-400"
                : "border-transparent text-[#a8a29e] hover:text-[#fafaf9]"
            }`}
          >
            <Search className="w-4 h-4" />
            1. Sourcing Strategy
          </button>
          <button
            onClick={() => setActiveTab("outreach")}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
              activeTab === "outreach"
                ? "border-red-500 text-red-400"
                : "border-transparent text-[#a8a29e] hover:text-[#fafaf9]"
            }`}
          >
            <Mail className="w-4 h-4" />
            2. Personalize Outreach
          </button>
        </div>

        {/* Tab Content 1: SOURCING STRATEGY */}
        {activeTab === "sourcing" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-scale-up" id="sourcing-tab-grid">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Reveal direction="left">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#fafaf9] flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fafaf9] text-[10px] text-[#1c1917] shrink-0">1</span>
                    Target Segment Input
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

            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#fafaf9] flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fafaf9] text-[10px] text-[#1c1917] shrink-0">2</span>
                  Target Sourcing Strategy
                </h2>
              </div>

              {isGeneratingSourcing && (
                <div className="bg-[#0c0a09] border border-[#292524] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 shadow-xs min-h-[500px]">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-950/30">
                    <Sparkles className="w-7 h-7 text-red-500 animate-pulse" />
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-25 animate-ping"></span>
                  </div>
                  <div className="max-w-sm">
                    <h3 className="text-sm font-semibold text-[#fafaf9] mt-2">Parsing Sourcing Request</h3>
                    <p className="text-xs text-[#a8a29e] mt-1.5 leading-relaxed">
                      Structuring job title clusters, mapping target industry categories, and formulating the Boolean search syntax...
                    </p>
                  </div>
                  <div className="w-48 bg-[#1c1917] rounded-full h-1 mt-2 overflow-hidden border border-[#292524]">
                    <div className="bg-[#fafaf9] h-1 rounded-full animate-infinite-loading"></div>
                  </div>
                </div>
              )}

              {!isGeneratingSourcing && sourcingError && (
                <div className="bg-red-950/20 border border-red-900 text-red-200 rounded-2xl p-6 flex flex-col gap-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="font-semibold text-sm">Failed to generate search parameters</span>
                  </div>
                  <p className="text-xs text-red-300 leading-relaxed">
                    {sourcingError}. Please check your connection or try again.
                  </p>
                  <button
                    onClick={handleGenerateFilters}
                    className="self-start px-4 py-2 bg-red-900 text-white font-medium text-xs rounded-lg hover:bg-red-800 transition-colors cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isGeneratingSourcing && !searchStrategy && !sourcingError && (
                <div className="bg-[#0c0a09] border border-[#292524] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-5 shadow-xs min-h-[500px]">
                  <div className="h-12 w-12 bg-[#1c1917] border border-[#292524] rounded-xl flex items-center justify-center text-[#a8a29e]">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-sm font-semibold text-[#fafaf9]">No Sourcing Parameters Generated</h3>
                    <p className="text-xs text-[#a8a29e] mt-1 leading-relaxed">
                      Enter your ideal customer segment details on the left, then click the generate button to build your search strategy.
                    </p>
                  </div>
                </div>
              )}

              {!isGeneratingSourcing && searchStrategy && (
                <div className="flex flex-col gap-6 animate-scale-up" id="sourcing-results">
                  {/* Step-by-Step Walkthrough */}
                  <Reveal direction="right">
                    <div className="bg-[#0c0a09] border border-[#292524] rounded-2xl p-5 shadow-xs flex flex-col gap-4">
                      <div className="flex items-center gap-2 border-b border-[#1c1917] pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#fafaf9] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-red-500" />
                          Step-by-Step Sourcing Workflow
                        </span>
                      </div>
                      <div className="flex flex-col gap-4 text-xs">
                        <div className="flex gap-3">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1c1917] text-[10px] font-bold text-red-500 border border-[#292524]">
                            1
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-[#fafaf9]">Navigate to LinkedIn</span>
                            <p className="text-[#a8a29e] leading-relaxed">
                              Go to 
                              <a href="https://www.linkedin.com/search/results/people/" target="_blank" rel="noreferrer" className="text-red-400 hover:underline mx-1">LinkedIn Standard</a>
                              or
                              <a href="https://www.linkedin.com/sales/search/people" target="_blank" rel="noreferrer" className="text-red-400 hover:underline mx-1">Sales Navigator</a>.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1c1917] text-[10px] font-bold text-red-500 border border-[#292524]">
                            2
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-[#fafaf9]">Apply Boolean Search String</span>
                            <p className="text-[#a8a29e] leading-relaxed">
                              Copy the generated Boolean Search String (shown below) and paste it into the primary search bar or the Keywords filter.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1c1917] text-[10px] font-bold text-red-500 border border-[#292524]">
                            3
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-[#fafaf9]">Configure Sidebar Filters</span>
                            <p className="text-[#a8a29e] leading-relaxed">
                              Set up the sidebar criteria:
                            </p>
                            <ul className="list-disc pl-4 mt-1 text-[#a8a29e] flex flex-col gap-1">
                              <li>Location: <span className="text-[#fafaf9] font-medium">{searchStrategy.locationFilters}</span></li>
                              <li>Industry: <span className="text-[#fafaf9] font-medium">{searchStrategy.industryFilters}</span></li>
                              <li>Size: <span className="text-[#fafaf9] font-medium">{searchStrategy.companySize}</span></li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1c1917] text-[10px] font-bold text-red-500 border border-[#292524]">
                            4
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-[#fafaf9]">Personalize Email (Next Step)</span>
                            <p className="text-[#a8a29e] leading-relaxed">
                              Once you find a matching profile (e.g. {searchStrategy.targetPersona}), copy their recent LinkedIn Activity post, then click below to personalize outreach!
                            </p>
                            <button
                              onClick={() => setActiveTab("outreach")}
                              className="mt-2 self-start py-1.5 px-3 bg-[#fafaf9] text-[#1c1917] hover:bg-[#e7e5e4] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors hover:scale-[1.03] active:scale-[0.97]"
                            >
                              Go to Personalize Email
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  {/* Main Boolean String Card */}
                  <Reveal direction="right">
                    <div className="bg-[#0c0a09] border border-red-900/40 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-red-800 transition-all">
                      <div className="px-5 py-4 bg-[#1c1917] border-b border-[#292524] flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#fafaf9] bg-red-950 border border-red-800 px-2 py-0.5 rounded-md">
                          Boolean Search String
                        </span>
                        <button
                          onClick={() => copyToClipboard(searchStrategy.booleanSearchString, "booleanSearchString")}
                          className="px-3 py-1.5 text-xs bg-[#fafaf9] hover:bg-[#e7e5e4] text-[#1c1917] font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer hover:scale-[1.03] active:scale-[0.97]"
                        >
                          {copiedField === "booleanSearchString" ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedField === "booleanSearchString" ? "Copied" : "Copy String"}
                        </button>
                      </div>
                      <div className="p-5 bg-black/60 relative">
                        <p className="text-sm font-mono text-emerald-400 break-words leading-relaxed select-all">
                          {searchStrategy.booleanSearchString}
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  {/* Filters Grid */}
                  <Reveal direction="right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#0c0a09] border border-[#292524] rounded-xl p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#a8a29e] flex items-center gap-1.5 border-b border-[#1c1917] pb-2">
                          <User className="w-3.5 h-3.5 text-emerald-500" /> Target Persona
                        </span>
                        <p className="text-xs text-[#fafaf9] leading-relaxed whitespace-pre-line mt-2">{searchStrategy.targetPersona}</p>
                      </div>
                      <div className="bg-[#0c0a09] border border-[#292524] rounded-xl p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#a8a29e] flex items-center gap-1.5 border-b border-[#1c1917] pb-2">
                          <Building className="w-3.5 h-3.5 text-blue-500" /> Industry Filters
                        </span>
                        <p className="text-xs text-[#fafaf9] leading-relaxed whitespace-pre-line mt-2">{searchStrategy.industryFilters}</p>
                      </div>
                      <div className="bg-[#0c0a09] border border-[#292524] rounded-xl p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#a8a29e] flex items-center gap-1.5 border-b border-[#1c1917] pb-2">
                          <MapPin className="w-3.5 h-3.5 text-purple-500" /> Location Filters
                        </span>
                        <p className="text-xs text-[#fafaf9] leading-relaxed whitespace-pre-line mt-2">{searchStrategy.locationFilters}</p>
                      </div>
                      <div className="bg-[#0c0a09] border border-[#292524] rounded-xl p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#a8a29e] flex items-center gap-1.5 border-b border-[#1c1917] pb-2">
                          <Building className="w-3.5 h-3.5 text-amber-500" /> Company Size
                        </span>
                        <p className="text-xs text-[#fafaf9] leading-relaxed whitespace-pre-line mt-2">{searchStrategy.companySize}</p>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal direction="right">
                    <div className="bg-red-950/20 border border-red-900/60 rounded-xl p-5 flex gap-3 items-start">
                      <div className="p-2 bg-red-950 border border-red-900 rounded-lg text-red-500 shrink-0">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Tactical Pro Tip</h4>
                        <p className="text-xs text-red-200 mt-1 leading-relaxed">{searchStrategy.proTip}</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-scale-up" id="outreach-tab-grid">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Reveal direction="left">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#fafaf9] flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fafaf9] text-[10px] text-[#1c1917] shrink-0">1</span>
                    Target Profile & Sender Details
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

            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#fafaf9] flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fafaf9] text-[10px] text-[#1c1917] shrink-0">2</span>
                  Personalized Cold Outbounds
                </h2>

                {emailVariations && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#a8a29e]">Highlight:</span>
                    <div className="flex bg-[#1c1917] rounded-lg p-0.5 border border-[#292524]">
                      {[
                        { id: "hook", label: "Hook", color: "bg-emerald-950/40 text-emerald-200" },
                        { id: "bridge", label: "Bridge", color: "bg-blue-900/40 text-blue-200" },
                        { id: "proof", label: "Proof", color: "bg-purple-900/40 text-purple-200" },
                        { id: "cta", label: "CTA", color: "bg-red-900/40 text-red-200" },
                      ].map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => setHighlightedPart(highlightedPart === btn.id ? null : btn.id)}
                          className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                            highlightedPart === btn.id
                              ? `${btn.color} shadow-xs font-semibold`
                              : "text-[#a8a29e] hover:text-[#fafaf9]"
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
                <div className="bg-[#0c0a09] border border-[#292524] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 shadow-xs min-h-[500px]">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-950/30">
                    <Sparkles className="w-7 h-7 text-red-500 animate-pulse" />
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-25 animate-ping"></span>
                  </div>
                  <div className="max-w-sm">
                    <h3 className="text-sm font-semibold text-[#fafaf9] mt-2">Writing 1-to-1 Outreach Copy</h3>
                    <p className="text-xs text-[#a8a29e] mt-1.5 leading-relaxed">
                      Analyzing {outreachInputs.prospectName}'s recent post keywords to write a hyper-personalized trigger hook under 100 words...
                    </p>
                  </div>
                  <div className="w-48 bg-[#1c1917] rounded-full h-1 mt-2 overflow-hidden border border-[#292524]">
                    <div className="bg-[#fafaf9] h-1 rounded-full animate-infinite-loading"></div>
                  </div>
                </div>
              )}

              {!isGeneratingOutreach && outreachError && (
                <div className="bg-red-950/20 border border-red-900 text-red-200 rounded-2xl p-6 flex flex-col gap-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="font-semibold text-sm">Failed to generate emails</span>
                  </div>
                  <p className="text-xs text-red-300 leading-relaxed">
                    {outreachError}. Ensure all fields are correctly filled or try again.
                  </p>
                  <button
                    onClick={handleGenerateOutreach}
                    className="self-start px-4 py-2 bg-red-900 text-white font-medium text-xs rounded-lg hover:bg-red-800 transition-colors cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isGeneratingOutreach && !emailVariations && !outreachError && (
                <div className="bg-[#0c0a09] border border-[#292524] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-5 shadow-xs min-h-[500px]">
                  <div className="h-12 w-12 bg-[#1c1917] border border-[#292524] rounded-xl flex items-center justify-center text-[#a8a29e]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-sm font-semibold text-[#fafaf9]">No Outreach Emails Drafted Yet</h3>
                    <p className="text-xs text-[#a8a29e] mt-1 leading-relaxed">
                      Fill out the prospect's profile information and paste their LinkedIn activity on the left, then click the generate button.
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
                        <div
                          className="bg-[#0c0a09] border border-[#292524] rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-[#44403c] transition-all"
                        >
                          {/* Card Header */}
                          <div className="px-5 py-4 bg-[#1c1917] border-b border-[#292524] flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#fafaf9] bg-[#292524] px-2 py-0.5 rounded-md">
                                Variation 0{index + 1}
                              </span>
                              
                              <button
                                onClick={() => toggleEdit(index)}
                                className="px-2 py-1 text-[10px] bg-[#1c1917] hover:bg-[#292524] border border-[#292524] rounded-md font-semibold text-[#fafaf9] flex items-center gap-1.5 cursor-pointer transition-colors hover:scale-[1.05] active:scale-[0.95]"
                              >
                                {editingVariations[index] ? (
                                  <>
                                    <Save className="w-3 h-3 text-red-500" />
                                    Save
                                  </>
                                ) : (
                                  <>
                                    <Edit className="w-3 h-3 text-red-500" />
                                    Edit Copy
                                  </>
                                )}
                              </button>

                              <button
                                onClick={handleGenerateOutreach}
                                className="px-2 py-1 text-[10px] bg-[#1c1917] hover:bg-[#292524] border border-[#292524] rounded-md font-semibold text-[#fafaf9] flex items-center gap-1.5 cursor-pointer transition-colors hover:scale-[1.05] active:scale-[0.95]"
                                title="Regenerate all variations"
                              >
                                <RefreshCw className="w-3 h-3 text-red-500" />
                                Regenerate
                              </button>
                            </div>
                            
                            <div
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                isWordCountCompliant
                                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-800"
                                  : "bg-red-950/40 text-red-300 border-red-900"
                              }`}
                            >
                              <span className="font-bold">{totalWords}</span> / 100 words
                            </div>
                          </div>

                          {/* Subject */}
                          <div className="px-5 py-3.5 border-b border-[#1c1917] flex items-center gap-3 bg-[#0c0a09]">
                            <span className="text-xs font-semibold text-[#a8a29e]">Subject:</span>
                            {editingVariations[index] ? (
                              <input
                                type="text"
                                value={variation.subjectLine}
                                onChange={(e) => handleSubjectChange(index, e.target.value)}
                                className="bg-[#1c1917] border border-[#292524] rounded px-2 py-1 text-sm text-[#fafaf9] italic w-full focus:outline-none focus:border-[#44403c]"
                              />
                            ) : (
                              <span className="text-sm font-medium text-[#fafaf9] italic">"{variation.subjectLine}"</span>
                            )}
                            {!editingVariations[index] && (
                              <button
                                onClick={() => copyToClipboard(variation.subjectLine, `subject-${index}`)}
                                className="ml-auto p-1 text-[#a8a29e] hover:text-[#fafaf9] rounded-md hover:bg-[#1c1917] hover:scale-[1.1] active:scale-[0.9] transition-all cursor-pointer"
                              >
                                {copiedField === `subject-${index}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>

                          {/* Body */}
                          <div className="p-6 bg-[#0c0a09]">
                            {editingVariations[index] ? (
                              <textarea
                                value={variation.emailBody}
                                onChange={(e) => handleBodyChange(index, e.target.value)}
                                className="w-full min-h-[160px] bg-[#1c1917] border border-[#292524] text-[#fafaf9] rounded-lg p-3 focus:outline-none focus:border-[#44403c] font-sans text-sm leading-relaxed resize-y"
                              />
                            ) : hasBeenModified ? (
                              <p className="text-sm text-[#e7e5e4] leading-relaxed whitespace-pre-line font-sans">
                                {variation.emailBody}
                              </p>
                            ) : highlightedPart ? (
                              <p className="text-sm text-[#e7e5e4] leading-relaxed whitespace-pre-line font-sans">
                                <span className={highlightedPart === "hook" ? "bg-emerald-950 text-emerald-200 font-medium border border-emerald-800 px-1 py-0.5 rounded" : ""}>
                                  {variation.frameworkBreakdown.triggerHook}
                                </span>{" "}
                                <span className={highlightedPart === "bridge" ? "bg-blue-950 text-blue-200 font-medium border border-blue-800 px-1 py-0.5 rounded" : ""}>
                                  {variation.frameworkBreakdown.empathyBridge}
                                </span>{" "}
                                <span className={highlightedPart === "proof" ? "bg-purple-950 text-purple-200 font-medium border border-purple-800 px-1 py-0.5 rounded" : ""}>
                                  {variation.frameworkBreakdown.valueProof}
                                </span>{" "}
                                <span className={highlightedPart === "cta" ? "bg-red-950 text-red-200 font-medium border border-red-800 px-1 py-0.5 rounded" : ""}>
                                  {variation.frameworkBreakdown.lowFrictionCta}
                                </span>
                              </p>
                            ) : (
                              <div
                                className="text-sm text-[#e7e5e4] leading-relaxed font-sans email-html-content"
                                dangerouslySetInnerHTML={{ __html: variation.emailBodyHtml || variation.emailBody.replace(/\n/g, '<br/>') }}
                              />
                            )}
                          </div>

                          {/* Empathy blueprint */}
                          <div className="border-t border-[#1c1917] bg-[#1c1917] p-5 flex flex-col gap-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a8a29e] flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-[#fafaf9]" /> Copy Blueprint
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className="p-3 rounded-lg bg-[#0c0a09] border border-[#292524]">
                                <span className="font-bold text-[#fafaf9] block mb-1">1. Trigger Hook</span>
                                <p className="text-[11px] text-[#e7e5e4]">{variation.frameworkBreakdown.triggerHook}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-[#0c0a09] border border-[#292524]">
                                <span className="font-bold text-[#fafaf9] block mb-1">2. Empathy Bridge</span>
                                <p className="text-[11px] text-[#e7e5e4]">{variation.frameworkBreakdown.empathyBridge}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-[#0c0a09] border border-[#292524]">
                                <span className="font-bold text-[#fafaf9] block mb-1">3. Value Proof</span>
                                <p className="text-[11px] text-[#e7e5e4]">{variation.frameworkBreakdown.valueProof}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-[#0c0a09] border border-[#292524]">
                                <span className="font-bold text-[#fafaf9] block mb-1">4. Low-Friction CTA</span>
                                <p className="text-[11px] text-[#e7e5e4]">{variation.frameworkBreakdown.lowFrictionCta}</p>
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="px-5 py-3.5 bg-[#0c0a09] border-t border-[#292524] flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[11px] text-[#a8a29e]">
                              Target: {outreachInputs.prospectName} ({outreachInputs.companyName})
                            </span>
                            <div className="flex gap-2">
                              <a
                                href={getMailtoUrl(variation)}
                                className="px-3.5 py-1.5 text-xs bg-[#1c1917] hover:bg-[#292524] text-[#fafaf9] border border-[#292524] font-semibold rounded-lg flex items-center gap-1.5 transition-colors hover:scale-[1.03] active:scale-[0.97]"
                              >
                                <Mail className="w-3.5 h-3.5" /> Draft in Client
                              </a>
                              <button
                                onClick={() => copyToClipboard(`Subject: ${variation.subjectLine}\n\n${variation.emailBody}`, `full-${index}`, `<strong>Subject:</strong> ${variation.subjectLine}<br/><br/>${variation.emailBodyHtml || variation.emailBody.replace(/\n/g, '<br/>')}`)}
                                className="px-3.5 py-1.5 text-xs bg-[#fafaf9] hover:bg-[#e7e5e4] text-[#1c1917] font-semibold rounded-lg flex items-center gap-1.5 transition-colors hover:scale-[1.03] active:scale-[0.97]"
                              >
                                {copiedField === `full-${index}` ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5" />}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-[#292524] bg-[#0c0a09] mt-16 py-8" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#a8a29e]">
              © 2026 Relevnt. Crafted for elite Outbound Sales professionals.
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#a8a29e]">
            <span>1. Sourcing Parameters</span>
            <span>•</span>
            <span>2. Hyper-Personalized Emails</span>
            <span>•</span>
            <a
              href="https://github.com/mhklogs/Relevnt"
              target="_blank"
              rel="noreferrer"
              className="text-red-400 hover:text-red-300 hover:underline transition-colors"
            >
              View Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
