import { useState } from 'react';
import { 
  ArrowLeft, Download, Printer, ShieldAlert, BadgeInfo, Zap, TrendingUp, CheckCircle, 
  Search, Eye, HelpCircle, AlertTriangle, AlertCircle, Sparkles, Smartphone, Gauge, 
  Settings, Type as FontIcon, Copy, Link as LinkIcon
} from 'lucide-react';
import { AuditReport } from '../types';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface SEOReportViewProps {
  report: AuditReport;
  onBack: () => void;
  onSaveToHistory?: () => void;
  isSaved?: boolean;
}

export default function SEOReportView({ report, onBack, onSaveToHistory, isSaved = false }: SEOReportViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'diagnostics' | 'recommendations' | 'competitors'>('overview');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const { scores, details, recommendations, competitorAnalysis } = report;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `seo_genius_report_${report.url.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Helper to render score color styles
  const getScoreColorClass = (score: number) => {
    if (score >= 85) return 'text-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
    if (score >= 70) return 'text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/20';
    return 'text-rose-500 border-rose-500 bg-rose-50 dark:bg-rose-950/20';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 85) return 'stroke-emerald-500';
    if (score >= 70) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  const getStatusBadge = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/40">✓ Passed</span>;
      case 'warning':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/40">! Optimize</span>;
      case 'error':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/40">✗ Critical</span>;
    }
  };

  const triggerCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans print:py-0 print:text-black">
      {/* Printable CSS style tags injection */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          header, footer, nav, button, .no-print {
            display: none !important;
          }
          .print-full {
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            transform: none !important;
            background: transparent !important;
          }
        }
      `}</style>

      {/* Breadcrumb / Actions Bar */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <button
          type="button"
          id="btn-report-back"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          {onSaveToHistory && (
            <button
              type="button"
              id="btn-report-save"
              onClick={onSaveToHistory}
              disabled={isSaved}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all border ${
                isSaved
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-400 cursor-default'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-200 active:translate-y-[1px]'
              }`}
            >
              {isSaved ? '✓ Saved to Account' : 'Save Report'}
            </button>
          )}

          <button
            type="button"
            id="btn-report-print"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-200 transition-all active:translate-y-[1px]"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>

          <button
            type="button"
            id="btn-report-export"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/15 transition-all active:translate-y-[1px]"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Main Brand Header Card */}
      <div className="print-full bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                Audit Core Complete
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2 break-all">
              {report.url}
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5">
              Scan Timestamp: {new Date(report.timestamp).toLocaleString()} • Powered by Gemini AI Audit Engine
            </p>
          </div>

          {/* Large Overall Progress Meter */}
          <div className="flex items-center gap-4 bg-slate-55/40 dark:bg-slate-950/20 p-4 rounded-xl border border-dashed border-slate-100 dark:border-slate-800/80">
            <div className="relative flex items-center justify-center h-20 w-20">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="6.5"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className={`${getScoreRingColor(scores.overall)} transition-all duration-1000 ease-out`}
                  strokeWidth="6.5"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${((100 - scores.overall) / 100) * (2 * Math.PI * 34)}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {scores.overall}
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">Overall Audit Health</div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {scores.overall >= 85 ? 'Outstanding' : scores.overall >= 70 ? 'Needs Tuning' : 'Action Required'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="no-print flex border-b border-slate-100 dark:border-slate-800 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          { id: 'overview' as const, label: 'Overview Metrics' },
          { id: 'diagnostics' as const, label: 'Full Diagnostics' },
          { id: 'recommendations' as const, label: 'Action Items Plan' },
          { id: 'competitors' as const, label: 'Competitors & Roadmap' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB SUB-PAGES */}
      
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Performance', score: scores.performance, icon: Gauge, desc: 'Core speed load index & web vitals elements' },
            { label: 'Content Quality', score: scores.contentQuality, icon: FontIcon, desc: 'Grammar index readability structure check' },
            { label: 'Mobile Readiness', score: scores.mobileOptimization, icon: Smartphone, desc: 'Sizing viewports, tap tactile margins' },
            { label: 'UX Aesthetics', score: scores.userExperience, icon: Sparkles, desc: 'Layout balance, conversion action paths' },
            { label: 'Technical SEO', score: scores.technicalSEO, icon: Settings, desc: 'Robot rules, sitemaps index optimization' }
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-slate-400 dark:text-slate-500">
                    <item.icon className="w-5 h-5 stroke-[1.8]" />
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded ${getScoreColorClass(item.score)}`}>
                    Score: {item.score}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.label}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-[11px] leading-relaxed mt-1.5">{item.desc}</p>
              </div>

              {/* Progress Bar representation */}
              <div className="mt-4">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.score >= 85 ? 'bg-emerald-500' : item.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Recap of Priority Issues */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
              <ShieldAlert className="text-rose-500 w-5 h-5" />
              Critical Diagnostic Alert Summary
            </h2>
            <div className="space-y-4">
              {recommendations.criticalIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-rose-50/20 dark:bg-rose-950/5 flex gap-3"
                >
                  <AlertTriangle className="text-rose-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                        {issue.category}
                      </span>
                      <span className="h-1 w-1 bg-slate-350 dark:bg-slate-700 rounded-full"></span>
                      <span className="text-xs font-semibold text-rose-500">Critical Priority</span>
                    </div>
                    <p className="text-slate-750 dark:text-slate-300 text-sm font-bold mt-1.5">{issue.description}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Impact: {issue.impact}</p>
                    <div className="mt-2.5 p-2 bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 border border-emerald-50 dark:border-emerald-950/80 rounded-lg text-xs font-mono">
                      <span className="font-bold uppercase tracking-wider text-[10px] mr-1">Action:</span> {issue.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Win Wins List */}
          <div className="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
                <Zap className="text-amber-500 w-5 h-5" />
                Easy-to-Apply Quick Wins
              </h2>
              <div className="space-y-3.5">
                {recommendations.quickWins.map((win) => (
                  <div key={win.id} className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-emerald-50/10 dark:bg-emerald-950/5">
                    <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="uppercase font-mono">{win.category}</span>
                      <span className="bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-[10px]">Effort: {win.effort}</span>
                    </div>
                    <p className="text-slate-750 dark:text-slate-300 font-semibold text-xs mt-1.5 leading-relaxed">{win.description}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1 italic">Action: {win.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed text-center italic">
                Applying quick wins usually boosts your score by up to 8-12 points on average.
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 2. DIAGNOSTICS TAB */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          {/* Section A: Title, description, Headings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-start gap-2 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Meta Title Tag Review</h3>
                {getStatusBadge(details.metaTitle.status)}
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg text-xs leading-relaxed break-all font-mono">
                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Current Meta Title:</div>
                <div className="mt-1 font-bold text-slate-700 dark:text-slate-300">"{details.metaTitle.value}"</div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-3">{details.metaTitle.message}</p>
              <div className="mt-4 p-3.5 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/40 rounded-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">SEO Recommendation:</span>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">{details.metaTitle.suggestion}</p>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-start gap-2 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Meta Description Evaluation</h3>
                {getStatusBadge(details.metaDescription.status)}
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg text-xs leading-relaxed break-all font-mono">
                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Google Snippet:</div>
                <div className="mt-1 font-normal text-slate-600 dark:text-slate-400 italic">"{details.metaDescription.value}"</div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-3">{details.metaDescription.message}</p>
              <div className="mt-4 p-3.5 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/40 rounded-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">SEO Recommendation:</span>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">{details.metaDescription.suggestion}</p>
              </div>
            </div>
          </div>

          {/* Core Content Analysis & Keywords Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Heading Structure analysis */}
            <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-start gap-2 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Headings Hierarchy Model</h3>
                {getStatusBadge(details.headingStructure.status)}
              </div>
              
              {/* Heading numeric panels */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['H1', 'H2', 'H3'].map((item, id) => {
                  const val = id === 0 ? details.headingStructure.h1Count : id === 1 ? details.headingStructure.h2Count : details.headingStructure.h3Count;
                  return (
                    <div key={item} className="p-2 text-center rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-55/30">
                      <div className="text-[10px] font-mono font-extrabold text-slate-400 dark:text-slate-500 mb-0.5">{item} Count</div>
                      <div className={`text-xl font-black ${id === 0 && val !== 1 ? 'text-amber-500' : 'text-slate-850 dark:text-slate-200'}`}>{val}</div>
                    </div>
                  );
                })}
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">{details.headingStructure.message}</p>
              
              {/* Dynamic scroll structure representation */}
              <div className="mb-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-2">Detected Heading Nodes (Sample outline):</div>
                <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-100 dark:border-slate-850/80 p-3 bg-slate-50/50 dark:bg-slate-950 font-mono text-xs space-y-2">
                  {details.headingStructure.structure.map((h, i) => (
                    <div key={i} className={`p-1 rounded ${h.startsWith('H1:') ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 font-bold pl-2' : h.startsWith('H2:') ? 'text-slate-700 dark:text-slate-300 pl-4 border-l border-slate-200 dark:border-slate-800' : 'text-slate-400 pl-8'}`}>
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/10 dark:bg-emerald-950/10 border border-emerald-50 dark:border-emerald-900/40 rounded-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Heading Recommendation:</span>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">{details.headingStructure.suggestion}</p>
              </div>
            </div>

            {/* Keyword Optimization & Copier card */}
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Keyword Matching Data</h3>
                  {getStatusBadge(details.keywordOptimization.status)}
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">Keywords Found:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {details.keywordOptimization.found.map((kw) => (
                        <span
                          key={kw}
                          onClick={() => triggerCopyKeyword(kw)}
                          className="px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-300 font-mono cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors inline-flex items-center gap-1"
                        >
                          {kw}
                          <Copy className="w-2.5 h-2.5 opacity-50" />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-rose-500 mb-1.5">Missing High-Opportunity Terms:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {details.keywordOptimization.missing.map((kw) => (
                        <span
                          key={kw}
                          onClick={() => triggerCopyKeyword(kw)}
                          className="px-2.5 py-1 rounded bg-rose-500/5 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 font-mono cursor-pointer hover:border-rose-400 transition-colors inline-flex items-center gap-1"
                        >
                          {kw}
                          <Copy className="w-2.5 h-2.5 opacity-50" />
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">{details.keywordOptimization.densitySummary}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                {copiedKeyword ? (
                  <span className="text-emerald-500 font-bold">✓ "{copiedKeyword}" copied to clipboard!</span>
                ) : (
                  <span>Click any key tag to quickly copy it to your editor clipboard.</span>
                )}
              </div>
            </div>
          </div>

          {/* Page speed and performance vitals elements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Speed & Pagesize gauges */}
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-start gap-2 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Page Speed & Performance</h3>
                {getStatusBadge(details.pageSpeed.status)}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg text-center">
                    <div className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase font-mono">Load Time</div>
                    <div className="text-base font-black text-rose-500 dark:text-rose-400 mt-0.5">{details.pageSpeed.loadTimeSeconds}s</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg text-center">
                    <div className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase font-mono">Page Size</div>
                    <div className="text-base font-black text-slate-850 dark:text-slate-200 mt-0.5">{details.pageSpeed.pageSizeMB}MB</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg text-center">
                    <div className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase font-mono">Requests</div>
                    <div className="text-base font-black text-slate-850 dark:text-slate-200 mt-0.5">{details.pageSpeed.requestCount}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-2">Technical Core Speeds Suggestions:</div>
                  <ul className="space-y-2 text-xs">
                    {details.pageSpeed.recommendations.map((rec, id) => (
                      <li key={id} className="flex gap-2 text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-emerald-500">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Content readability metrics */}
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-start gap-2 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Content Readability Formula</h3>
                {getStatusBadge(details.contentReadability.status)}
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex items-center gap-3.5">
                  <div className="inline-flex flex-col items-center justify-center p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 rounded-xl h-14 w-15 text-center">
                    <span className="text-[10px] uppercase text-emerald-600 font-bold tracking-tight">Grade</span>
                    <span className="text-sm font-black text-emerald-600 mt-0.5">{details.contentReadability.readingGrade.split(" ")[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Flesch Grade Score: {details.contentReadability.score}/100</h4>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5">Demographics fit: {details.contentReadability.readingGrade}</p>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mt-1">{details.contentReadability.analysis}</p>
                <p className="p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-850 rounded-lg italic">
                  Tip: {details.contentReadability.suggestion}
                </p>
              </div>
            </div>

            {/* Accessibility features checklist */}
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">WCAG Accessibility Score</h3>
                  {getStatusBadge(details.accessibility.status)}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-slate-500">Compliance score (ADA compliance)</span>
                    <span className="text-slate-900 dark:text-slate-200">{details.accessibility.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-105 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${details.accessibility.score}%` }}></div>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-rose-500 mb-1">Detected Non-Compliance Tags:</div>
                    <ul className="space-y-1.5">
                      {details.accessibility.issues.map((issue, id) => (
                        <li key={id} className="flex gap-2 text-slate-600 dark:text-slate-400">
                          <span className="text-rose-500 font-bold">&#8226;</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-emerald-500 block mb-1">Accessibility Improvements:</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{details.accessibility.improvements[0] || "Alt attributes configured properly."}</p>
              </div>
            </div>
          </div>

          {/* Internal links, mobile viewport review */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-start gap-2 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Internal Link Analysis (Backlinks profile)</h3>
                {getStatusBadge(details.internalLinking.status)}
              </div>

              <div className="flex gap-4 items-center mb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-center flex-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-slate-400 dark:text-slate-500 mb-0.5">Found Links</div>
                  <div className="text-xl font-black text-slate-800 dark:text-slate-200">{details.internalLinking.linkCount}</div>
                </div>
                <div className="p-3 bg-rose-50/25 dark:bg-rose-950/15 border border-rose-100/40 dark:border-rose-950 rounded-xl text-center flex-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-rose-500/80 mb-0.5">Broken Redirects</div>
                  <div className="text-xl font-black text-rose-500">{details.internalLinking.brokenLinks}</div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-1">{details.internalLinking.suggestion}</p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-start gap-2 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Mobile Layout & Touch Vitals</h3>
                {getStatusBadge(details.mobileResponsiveness.status)}
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold">Viewport dynamic tags set correctly. Fits screens standardly.</span>
                </div>

                {details.mobileResponsiveness.issues.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-600 block mb-1">Potential Taps Warnings:</span>
                    <ul className="space-y-1">
                      {details.mobileResponsiveness.issues.map((is, idx) => (
                        <li key={idx} className="flex gap-1.5 text-slate-600 dark:text-slate-400">
                          <span className="text-amber-500 font-bold">&#8226;</span>
                          <span>{is}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-500 block mb-1">Pro Responsive Steps:</span>
                  <ul className="space-y-1">
                    {details.mobileResponsiveness.suggestions.map((su, idx) => (
                      <li key={idx} className="flex gap-1.5 text-slate-500 dark:text-slate-400">
                        <span className="text-emerald-500">&#8226;</span>
                        <span>{su}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 3. RECOMMENDATIONS TAB */}
      {activeTab === 'recommendations' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
              <ShieldAlert className="text-rose-500 w-5.5 h-5.5" />
              Critical Issues Priority List
            </h2>
            <div className="grid gap-4">
              {recommendations.criticalIssues.map((issue) => (
                <div key={issue.id} className="p-5 rounded-xl border border-rose-100 dark:border-rose-950 bg-rose-50/15 dark:bg-rose-950/10 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-450 border border-rose-200 dark:border-rose-900">
                      {issue.category}
                    </span>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-2">{issue.description}</h4>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Negative SEO Impact: {issue.impact}</p>
                  </div>
                  <div className="md:w-96 flex-shrink-0 bg-white dark:bg-slate-950 border border-slate-100 dark:border-rose-950/50 p-3 rounded-lg text-xs font-mono text-emerald-600 dark:text-emerald-450/95">
                    <span className="text-[10px] uppercase tracking-wide font-extrabold block text-slate-400 mb-1">Recommended Resolution:</span>
                    {issue.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
              <AlertTriangle className="text-amber-500 w-5.5 h-5.5" />
              Important General Improvements
            </h2>
            <div className="grid gap-4">
              {recommendations.importantImprovements.map((imp) => (
                <div key={imp.id} className="p-5 rounded-xl border border-amber-100 dark:border-amber-950/40 bg-amber-50/10 dark:bg-amber-950/5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-450 border border-amber-200 dark:border-amber-900">
                      {imp.category}
                    </span>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-2">{imp.description}</h4>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Negative SEO Impact: {imp.impact}</p>
                  </div>
                  <div className="md:w-96 flex-shrink-0 bg-white dark:bg-slate-950 border border-slate-100 dark:border-amber-950/50 p-3 rounded-lg text-xs font-mono text-emerald-600 dark:text-emerald-450">
                    <span className="text-[10px] uppercase tracking-wide font-extrabold block text-slate-400 mb-1">Target Action Step:</span>
                    {imp.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
                <CheckCircle className="text-emerald-500 w-5 h-5" />
                Quick Wins Task Checklist
              </h2>
              <div className="space-y-4">
                {recommendations.quickWins.map((win, idx) => (
                  <div key={win.id} className="p-3.5 border border-slate-100 dark:border-slate-850 bg-slate-50/30 rounded-lg text-xs flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{win.category}</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-100/50 dark:bg-emerald-950/80 text-emerald-600 font-bold border border-emerald-100">Reward: {win.reward}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{win.description}</p>
                      <p className="text-slate-400 dark:text-slate-500 mt-1 italic">Action: {win.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
                <TrendingUp className="text-blue-500 w-5 h-5" />
                Long-Term Authority Strategies
              </h2>
              <div className="space-y-4">
                {recommendations.longTermGrowth.map((lt, idx) => (
                  <div key={lt.id} className="p-3.5 border border-slate-100 dark:border-slate-850 bg-slate-50/30 rounded-lg text-xs flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{lt.category}</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-blue-100/55 dark:bg-blue-950 text-blue-600 font-bold border border-blue-105">Timeline: {lt.timeline}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{lt.description}</p>
                      <p className="text-slate-400 dark:text-slate-500 mt-1 italic">Strategy: {lt.strategy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 4. COMPETITORS TAB */}
      {activeTab === 'competitors' && competitorAnalysis && (
        <div className="space-y-8">
          {/* Competitors Score Compare */}
          <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white mb-4">SEO Market Competition Contrast</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Evaluating your overall seo diagnostics score against matching sector rivals.</p>
            
            <div className="space-y-5">
              {/* Target Site score bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                    {report.url} (You)
                  </span>
                  <span className="text-emerald-500">{scores.overall} - Outstanding</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${scores.overall}%` }}></div>
                </div>
              </div>

              {/* Rival site score bars */}
              {competitorAnalysis.competitors.map((c, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full"></span>
                      {c.url}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{c.overallScore} - {c.overallScore >= 80 ? 'Authoritative' : 'Average Rival'}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-102 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full transition-all duration-1000" style={{ width: `${c.overallScore}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor detailed gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitorAnalysis.competitors.map((c, idx) => (
              <div key={idx} className="p-5 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Competitor Profile</span>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm mb-4">{c.url} Analysis</h3>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1.5">Competitor Strengths:</span>
                    <ul className="space-y-1.5">
                      {c.strengths.map((str, sid) => (
                        <li key={sid} className="flex gap-1.5 text-slate-600 dark:text-slate-405">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-500 block mb-1.5">Competitor Weaknesses:</span>
                    <ul className="space-y-1.5">
                      {c.weaknesses.map((weak, wid) => (
                        <li key={wid} className="flex gap-1.5 text-slate-650 dark:text-slate-400">
                          <span className="text-rose-500 font-bold">&#8226;</span>
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content gaps, keyword Opportunities & Roadmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
                <BadgeInfo className="text-emerald-500 w-5 h-5" />
                SaaS Content Gaps Analysis
              </h2>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                {competitorAnalysis.contentGapAnalysis.map((gap, gid) => (
                  <li key={gid} className="flex gap-2">
                    <span className="text-emerald-500 font-bold">&#8226;</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>

              <h2 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2 mt-6 mb-3">
                <Search className="text-amber-500 w-4 h-4" />
                Untapped Keyword Opportunities
              </h2>
              <ul className="space-y-2 text-xs">
                {competitorAnalysis.keywordOpportunities.map((opp, oidx) => (
                  <li key={oidx} className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 text-slate-705 dark:text-slate-300 font-mono border border-slate-100 dark:border-slate-850 flex justify-between items-center">
                    <span>{opp}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase tracking-wider">Opportunity</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement planning roadmap */}
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <h1 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
                <TrendingUp className="text-emerald-500 w-5 h-5" />
                12-Month SEO Growth Roadmap
              </h1>
              
              <div className="relative border-l border-slate-100 dark:border-slate-800 pl-4 space-y-6 mt-4">
                {competitorAnalysis.roadmap.map((plan, rid) => (
                  <div key={rid} className="relative">
                    {/* Circle timeline dot */}
                    <span className="absolute -left-6 top-1.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                      Step {rid + 1}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">{plan}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
