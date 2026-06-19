import { useState, useEffect, FormEvent } from 'react';
import { 
  Globe, Search, Sparkles, Smartphone, CheckCircle, BarChart3, ArrowRight, ShieldCheck, 
  Cpu, Zap, RefreshCw, KeyRound, AlertCircle, Trash
} from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface HeroSectionProps {
  onAnalyze: (url: string, competitors: string[]) => void;
  isLoading: boolean;
}

export default function HeroSection({ onAnalyze, isLoading }: HeroSectionProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [showCompetitorInput, setShowCompetitorInput] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Loading text sequencing state
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    'Initializing secure audits, preparing crawler endpoints...',
    'Analyzing target DOM hierarchies, checking H1, H2 tags distributions...',
    'Probing meta viewport, checking tactile mobile touch target dimensions...',
    'Calculating Flesch readability index, scanning alt descriptions tags...',
    'Querying Gemini AI server engine to map customized 12-month growth milestones...'
  ];

  useEffect(() => {
    let timer: any;
    if (isLoading) {
      setLoadingStep(0);
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  // Handle submit trigger
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!targetUrl.trim()) {
      setErrorText('Please enter a website URL first.');
      return;
    }

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
    if (!urlPattern.test(targetUrl.trim())) {
      setErrorText('Please enter a valid website URL format (e.g., website.com).');
      return;
    }

    onAnalyze(targetUrl.trim(), competitors.filter(c => c.trim() !== ''));
  };

  const handleAddCompetitor = () => {
    if (!newCompetitor.trim()) return;
    const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
    if (!urlPattern.test(newCompetitor.trim())) {
      alert('Please enter a valid competitor URL format.');
      return;
    }

    if (competitors.includes(newCompetitor.trim())) {
      alert('This competitor is already entered.');
      return;
    }

    setCompetitors([...competitors, newCompetitor.trim()]);
    setNewCompetitor('');
  };

  const handleRemoveCompetitor = (idx: number) => {
    setCompetitors(competitors.filter((_, i) => i !== idx));
  };

  const features = [
    {
      title: 'Structural SEO Analysis',
      desc: 'Verify title configurations, tag structures, sitemap links and indexing setups.',
      icon: Search,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
    },
    {
      title: 'Content Optimizer',
      desc: 'Formulate density recommendations and check vocabulary copy readability parameters.',
      icon: Sparkles,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      title: 'Performance Diagnostics',
      desc: 'Measure page weight, load speeds, critical render blocking styles indices.',
      icon: Zap,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
    },
    {
      title: 'Mobile Readiness Audit',
      desc: 'Review touch ratios, viewport parameters, and screen density configurations.',
      icon: Smartphone,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40'
    },
    {
      title: 'Accessibility Reviews',
      desc: 'Unveil screen contrast errors, alt attributes omissions to fit ADA requirements.',
      icon: ShieldCheck,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
    },
    {
      title: 'Gemini Action Keys',
      desc: 'Generate customized priority roadmap milestones suited exactly to your sector.',
      icon: Cpu,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40'
    }
  ];

  return (
    <div className="font-sans px-4">
      {isLoading ? (
        /* 1. SECURE LOADER VIEW */
        <div className="max-w-xl mx-auto py-24 text-center">
          <div className="relative inline-flex items-center justify-center mb-8 h-20 w-20">
            <span className="absolute animate-ping h-14 w-14 rounded-full bg-emerald-400 opacity-25"></span>
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
          </div>

          <div className="space-y-4">
            <span className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 font-mono tracking-wider">
              Step {loadingStep + 1} of {loadingMessages.length} • Running Audit
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mt-4">
              Analyzing Web Assets...
            </h2>
            
            {/* Animated Loading Text */}
            <div className="min-h-[48px] px-6">
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md mx-auto transition-all duration-300">
                {loadingMessages[loadingStep]}
              </p>
            </div>

            {/* Continuous Progress Bar Indicator */}
            <div className="w-64 mx-auto h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 rounded-full"
                style={{ width: `${(loadingStep + 1) * 20}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. MAIN INPUT FORM SECTION */
        <div className="py-16 md:py-24 max-w-5xl mx-auto">
          {/* Header titles */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-55/60 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-350 tracking-wider uppercase">
                Enterprise AI SEO Crawler
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
              Get an Instant AI-Powered <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">SEO Audit</span> of Any Website
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Analyze structure, accessibility index, reading quality, mobile layouts parameters, speed elements, and custom competitive gaps using Gemini AI rules.
            </p>
          </div>

          {/* Form container */}
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none mb-16">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target URL field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Target Website URL
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Globe className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    id="input-hero-url"
                    value={targetUrl}
                    onChange={(e) => {
                      setTargetUrl(e.target.value);
                      if (errorText) setErrorText('');
                    }}
                    placeholder="Enter website URL (e.g. airbnb.com)..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 font-medium placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
                {errorText && (
                  <div className="mt-2.5 text-xs text-rose-500 flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" /> {errorText}
                  </div>
                )}
              </div>

              {/* Expandable Competitor Comparator section */}
              <div>
                <button
                  type="button"
                  id="btn-toggle-competitors"
                  onClick={() => setShowCompetitorInput(!showCompetitorInput)}
                  className="text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-1.5 focus:outline-none py-1"
                >
                  {showCompetitorInput ? '[-] Hide Competitors compare' : '[+] Combine with Competitor Analysis (Pro)'}
                </button>

                {showCompetitorInput && (
                  <div className="mt-4 p-4 rounded-xl border border-dashed border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 space-y-3.5">
                    <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Add Industry Competitors
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter competitor (e.g. vrbo.com)..."
                        value={newCompetitor}
                        onChange={(e) => setNewCompetitor(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCompetitor();
                          }
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        id="btn-add-competitor"
                        onClick={handleAddCompetitor}
                        className="px-4 py-2.5 rounded-lg bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-705 text-xs font-bold transition-all hover:bg-slate-800 whitespace-nowrap"
                      >
                        Add List
                      </button>
                    </div>

                    {/* Competitor tags tags */}
                    {competitors.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {competitors.map((c, i) => (
                          <span
                            key={c}
                            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-950 shadow-sm border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-350 flex items-center gap-2"
                          >
                            <span>{c}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCompetitor(i)}
                              className="text-slate-400 hover:text-rose-500 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">No custom competitors added yet. Default sector matches will be used automatically in results comparison grids.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="btn-submit-audit"
                className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:shadow-emerald-500/30 active:translate-y-[1px]"
              >
                Start Comprehensive AI Audit
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

          {/* Core Feature blocks section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item) => (
              <div
                key={item.title}
                className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none hover:border-slate-150 duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <item.icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
