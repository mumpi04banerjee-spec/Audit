import { useState } from 'react';
import { 
  TrendingUp, Award, Clock, Search, ExternalLink, Calendar, Trash2, ShieldAlert, BadgeInfo,
  CheckCircle, PlusCircle, LayoutDashboard, Globe
} from 'lucide-react';
import { SavedReport } from '../types';
import SVGChart from './SVGChart';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface DashboardViewProps {
  history: SavedReport[];
  onOpenReport: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onNewScan: () => void;
  onSeedMockData?: () => void;
}

export default function DashboardView({ 
  history, 
  onOpenReport, 
  onDeleteReport, 
  onNewScan,
  onSeedMockData
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter history records
  const filteredHistory = history.filter((record) =>
    record.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute key diagnostics indicators
  const totalAudits = history.length;
  const avgScore = totalAudits > 0 
    ? Math.round(history.reduce((acc, r) => acc + r.overallScore, 0) / totalAudits)
    : 0;
  
  const passedAudits = history.filter((r) => r.overallScore >= 85).length;
  const warningAudits = history.filter((r) => r.overallScore >= 70 && r.overallScore < 85).length;
  const criticalAudits = history.filter((r) => r.overallScore < 70).length;

  // Formulate dataPoints for SVG line chart (sorted chronologically)
  const chartPoints = [...history]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((record) => ({
      label: new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: record.overallScore
    }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60 uppercase tracking-widest">
            Workspace Hub
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3">
            SEO Performance Dashboard
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm mt-1">
            Track average website SEO trends, manage previous diagnostics, and execute new scans.
          </p>
        </div>

        <button
          type="button"
          id="btn-dash-start-scan"
          onClick={onNewScan}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/15 active:translate-y-[1px]"
        >
          <PlusCircle className="w-4 h-4" />
          Audit a New Website
        </button>
      </div>

      {totalAudits === 0 ? (
        /* Empty State */
        <div className="text-center rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-805/60 p-12 bg-white/40 dark:bg-slate-900/10 backdrop-blur-sm max-w-lg mx-auto">
          <LayoutDashboard className="w-12 h-12 text-slate-350 dark:text-slate-600 mx-auto" strokeWidth={1} />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-205 mt-4">No audit history found</h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5 leading-relaxed">
            Verify layout structures and mobile page performance. Seed some high-fidelity initial mock scans to explore the interactive visual analytics dashboard modules, or start a new scan now.
          </p>
          <div className="flex gap-4.5 justify-center mt-6 flex-wrap">
            {onSeedMockData && (
              <button
                type="button"
                id="btn-dash-seed"
                onClick={onSeedMockData}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                Seed Sample Reports
              </button>
            )}
            <button
              type="button"
              id="btn-dash-new-scan-empty"
              onClick={onNewScan}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/15 transition-colors"
            >
              Analyze Website
            </button>
          </div>
        </div>
      ) : (
        /* Populated Dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: Charts & History list */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SVG Trends Chart */}
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="text-indigo-500 w-5 h-5" />
                    Overall SEO Score Trend
                  </h2>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">Chronological representation of your audit history diagnostics.</p>
                </div>
              </div>
              <SVGChart data={chartPoints} />
            </div>

            {/* Scans table */}
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Saved Audit Diagnostics Log</h2>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">Search and query details of your previous audit files.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search target url..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-205 placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="text-center py-10 text-slate-404 text-xs">
                  No matching website URL history records found.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistory.map((record) => (
                    <div
                      key={record.id}
                      className="group p-4 bg-slate-51 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-850/80 hover:border-emerald-400/50 dark:hover:border-emerald-500/35 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`p-2.5 rounded-lg border font-mono font-bold text-sm tracking-tight inline-flex items-center justify-center h-11 w-11 ${
                          record.overallScore >= 85 
                            ? 'text-emerald-500 border-emerald-100 bg-emerald-50 dark:bg-emerald-950/30'
                            : record.overallScore >= 70
                            ? 'text-amber-500 border-amber-100 bg-amber-50 dark:bg-amber-950/30'
                            : 'text-rose-500 border-rose-100 bg-rose-50 dark:bg-rose-950/30'
                        }`}>
                          {record.overallScore}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-850 dark:text-slate-200 text-sm truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                            {record.url}
                          </h4>
                          <p className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1.5 mt-1">
                            <Clock className="w-3.5 h-4 text-slate-350" />
                            {new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <button
                          type="button"
                          id={`btn-open-historical-${record.id}`}
                          onClick={() => onOpenReport(record.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:hover:bg-emerald-955 dark:text-emerald-400 font-bold text-xs transition-colors"
                        >
                          View Report
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          title="Delete audit"
                          id={`btn-delete-report-${record.id}`}
                          onClick={() => onDeleteReport(record.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Key Metrics & Status breakdowns */}
          <div className="space-y-8">
            {/* Summary counters */}
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Workspace Analytics</h2>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-xl">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{totalAudits}</div>
                    <div className="text-slate-400 dark:text-slate-500 text-xs">Total Websites Logged</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{avgScore}</div>
                    <div className="text-slate-400 dark:text-slate-500 text-xs">Average Overall SEO Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Categories distribution ratios */}
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans">SEO Health Distribution</h2>
              
              <div className="space-y-4 text-xs font-medium">
                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-405 mb-1.5 items-center">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CheckCircle className="text-emerald-500 w-4.5 h-4.5" /> Passed Rules (Score 85+)
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{passedAudits} / {totalAudits}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(passedAudits / totalAudits) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1.5 items-center">
                    <span className="flex items-center gap-1.5 font-bold">
                      <BadgeInfo className="text-amber-500 w-4.5 h-4.5" /> Optimization Alert (70-84)
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{warningAudits} / {totalAudits}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-550" style={{ width: `${(warningAudits / totalAudits) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1.5 items-center">
                    <span className="flex items-center gap-1.5 font-bold">
                      <ShieldAlert className="text-rose-500 w-4.5 h-4.5" /> Critical Error (Score &lt;70)
                    </span>
                    <span className="font-mono text-slate-705 dark:text-slate-300 font-bold">{criticalAudits} / {totalAudits}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-550" style={{ width: `${(criticalAudits / totalAudits) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
