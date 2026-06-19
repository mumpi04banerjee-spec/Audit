import { Sun, Moon, Cpu, LayoutDashboard, Globe, Bookmark, CreditCard, Sparkles } from 'lucide-react';
import { AppView, Theme } from '../types';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface HeaderProps {
  currentView: AppView;
  onSetView: (view: AppView) => void;
  theme: Theme;
  onToggleTheme: () => void;
  plan: 'free' | 'pro';
  userEmail?: string;
  hasSavedReports: boolean;
}

export default function Header({ 
  currentView, 
  onSetView, 
  theme, 
  onToggleTheme, 
  plan,
  userEmail = 'visitor@seogenius.ai',
  hasSavedReports
}: HeaderProps) {
  const getPlanBadge = () => {
    if (plan === 'pro') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold rounded-full bg-amber-500/10 text-amber-650 dark:text-amber-400 border border-amber-500/20 shadow-md shadow-amber-500/5 animate-pulse">
          <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
          Pro Elite Member
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-205 dark:border-slate-700/80">
        Free Starter (3/day)
      </span>
    );
  };

  return (
    <header className="no-print sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Banner */}
        <div 
          onClick={() => onSetView('home')} 
          className="flex items-center gap-2.5 cursor-pointer selection:bg-transparent"
        >
          <div className="h-9 w-9 rounded-xl bg-emerald-500 hover:scale-[1.03] active:scale-95 transition-all text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Cpu className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-base font-black text-slate-900 dark:text-white leading-none">SEO Genius</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500 text-white leading-none tracking-tight">AI</span>
            </div>
            <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 leading-none block mt-0.5">Website Auditor</span>
          </div>
        </div>

        {/* Dynamic Route/View Menu */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
          {[
            { id: 'home' as const, label: 'Audit Desk', icon: Globe },
            { id: 'dashboard' as const, label: 'My Reports', icon: LayoutDashboard, badge: hasSavedReports },
            { id: 'pricing' as const, label: 'Pricing Hub', icon: CreditCard }
          ].map((item) => {
            const isActive = currentView === item.id || (item.id === 'dashboard' && currentView === 'report');
            return (
              <button
                key={item.id}
                type="button"
                id={`btn-nav-${item.id}`}
                onClick={() => onSetView(item.id)}
                className={`relative px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 font-bold ${
                  isActive
                    ? 'bg-slate-50 dark:bg-slate-900 text-emerald-500 dark:text-emerald-400'
                    : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-205'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}

                {/* Optional notifications dot */}
                {item.badge && (
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Global Settings Trigger Actions */}
        <div className="flex items-center gap-3">
          {/* Active plans badge */}
          {getPlanBadge()}

          {/* Theme switcher toggle */}
          <button
            type="button"
            id="btn-theme-toggle"
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 dark:text-slate-505 transition-colors"
            title="Toggle color theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Connected User identity segment */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-100 dark:border-slate-800">
            <div className="h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 text-white text-xs font-black flex items-center justify-center shadow-md">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block leading-tight text-left min-w-0">
              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 max-w-[120px] truncate leading-none">
                {userEmail}
              </div>
              <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase leading-none block mt-0.5">Active Account</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile-only secondary navigation panel */}
      <div className="md:hidden flex items-center justify-around py-1 border-t border-slate-100 dark:border-slate-850/60 bg-white/50 dark:bg-slate-950/50">
        {[
          { id: 'home' as const, label: 'Audit', icon: Globe },
          { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
          { id: 'pricing' as const, label: 'Plans', icon: CreditCard }
        ].map((item) => {
          const isActive = currentView === item.id || (item.id === 'dashboard' && currentView === 'report');
          return (
            <button
              key={item.id}
              onClick={() => onSetView(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-4 text-[10px] font-bold ${
                isActive ? 'text-emerald-500' : 'text-slate-400'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
