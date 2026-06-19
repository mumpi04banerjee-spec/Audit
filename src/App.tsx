import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SEOReportView from './components/SEOReportView';
import DashboardView from './components/DashboardView';
import PricingSection from './components/PricingSection';
import { AppView, AuditReport, SavedReport, Theme } from './types';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple local storage keys config
const STORAGE_REPORTS_KEY = 'seo_genius_saved_reports';
const STORAGE_THEME_KEY = 'seo_genius_theme';
const STORAGE_PLAN_KEY = 'seo_genius_active_plan';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [activePlan, setActivePlan] = useState<'free' | 'pro'>('free');
  const [theme, setTheme] = useState<Theme>('light');

  // Load state on startup
  useEffect(() => {
    // 1. Initialise theme
    const storedTheme = localStorage.getItem(STORAGE_THEME_KEY) as Theme || 'light';
    setTheme(storedTheme);
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Initialise plan
    const storedPlan = localStorage.getItem(STORAGE_PLAN_KEY) as 'free' | 'pro' || 'free';
    setActivePlan(storedPlan);

    // 3. Initialise saved files
    const storedReports = localStorage.getItem(STORAGE_REPORTS_KEY);
    if (storedReports) {
      try {
        setSavedReports(JSON.parse(storedReports));
      } catch (e) {
        console.error('Failed to parse saved reports history', e);
      }
    }
  }, []);

  // Sync saved list to local storage
  const saveReportsToStorage = (updatedList: SavedReport[]) => {
    setSavedReports(updatedList);
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(updatedList));
  };

  // Toggle Theme Action
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle Plan Upgrade
  const handleSelectPlan = (planName: 'free' | 'pro') => {
    setActivePlan(planName);
    localStorage.setItem(STORAGE_PLAN_KEY, planName);
    alert(`Successfully upgraded to the ${planName === 'pro' ? 'Pro Genius' : 'Free Starter'} tier!`);
    setCurrentView('home');
  };

  // Execute website crawlers
  const handleAnalyzeWebsite = async (url: string, competitorUrls: string[]) => {
    // Validate daily limits on free plan (3 scans max)
    if (activePlan === 'free') {
      const today = new Date().toDateString();
      const todayScans = savedReports.filter(r => new Date(r.timestamp).toDateString() === today);
      if (todayScans.length >= 3) {
        alert("Daily Limit Reached: You have consumed your 3 Free daily scans. Upgrade to the Pro plan for unlimited website tracking and advanced competitor metrics!");
        setCurrentView('pricing');
        return;
      }
    }

    setIsLoading(true);
    setCurrentView('home');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, competitorUrls })
      });

      const data = await response.json();
      if (data && data.report) {
        const reportResult: AuditReport = data.report;
        
        // Auto-generate a safe visual mock key for local storage tracking
        const recordId = 'audit_' + Math.random().toString(36).substring(2, 11);
        const newRecord: SavedReport = {
          id: recordId,
          url: reportResult.url,
          timestamp: reportResult.timestamp,
          overallScore: reportResult.scores.overall,
          report: reportResult
        };

        const updatedHistory = [newRecord, ...savedReports];
        saveReportsToStorage(updatedHistory);
        
        setSelectedReport(reportResult);
        setCurrentView('report');
      } else {
        alert('Server returned an empty report. Falling back to simple scan parameters.');
      }
    } catch (error) {
      console.error('Audit operation failed:', error);
      alert('Network communication interrupted. Please check your system connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Saved audits operations
  const handleOpenReport = (reportId: string) => {
    const found = savedReports.find(r => r.id === reportId);
    if (found) {
      setSelectedReport(found.report);
      setCurrentView('report');
    }
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report from your browser storage?')) {
      const filtered = savedReports.filter(r => r.id !== reportId);
      saveReportsToStorage(filtered);
      if (selectedReport && !filtered.some(r => r.report.url === selectedReport.url)) {
        setSelectedReport(null);
      }
    }
  };

  // Seed detailed reports for demonstration
  const handleSeedReports = () => {
    const hourMs = 60 * 60 * 1000;
    const dayMs = 24 * hourMs;
    const now = Date.now();

    const sampleSecuredReports: SavedReport[] = [
      {
        id: 'seed-1',
        url: 'https://airbnb.com',
        timestamp: new Date(now - 4 * dayMs).toISOString(),
        overallScore: 89,
        report: {
          url: 'https://airbnb.com',
          timestamp: new Date(now - 4 * dayMs).toISOString(),
          scores: { overall: 89, performance: 84, contentQuality: 92, mobileOptimization: 94, userExperience: 88, technicalSEO: 87 },
          details: {
            metaTitle: { status: 'success', value: 'Vacation Rentals, Cabin Rentals & Unique Homes - Airbnb', message: 'Title fits target requirements (54 chars)', suggestion: 'Incorporate vacation destination terms prominently.' },
            metaDescription: { status: 'success', value: 'Find the perfect place to go. Discover entire homes, apartments, guest segments customized on Airbnb.', message: 'Length fits target requirements (135 chars).', suggestion: 'Define onboarding keywords earlier in paragraphs.' },
            headingStructure: { status: 'success', h1Count: 1, h2Count: 18, h3Count: 22, message: 'Clean hierarchical design.', structure: ['H1: Discover places to stay', 'H2: Popular stay categories', 'H3: Cabins & Lake houses'], suggestion: 'Configure h3 tags consistently.' },
            keywordOptimization: { status: 'success', found: ['rentals', 'cabins', 'homes', 'stay'], missing: ['best vacation bookings', 'luxury retreats sitemap'], densitySummary: 'High distribution of search terms (1.8% density).', suggestion: 'Maintain present keyword weights.' },
            internalLinking: { status: 'success', linkCount: 184, brokenLinks: 0, suggestion: 'Add text anchor descriptions in geographic guides.' },
            contentReadability: { status: 'success', score: 71, readingGrade: '7th Grade', analysis: 'Highly legible and accessible content. Promotes continuous exploration.', suggestion: 'Keep guide blurbs under 3 sentences.' },
            ctaImprovements: ['Incorporate hover highlights on reservation tags.', 'Standardise maps search trigger targets.'],
            mobileResponsiveness: { status: 'success', viewportSet: true, issues: [], suggestions: ['Keep icon tap heights above 46px on phones.'] },
            pageSpeed: { status: 'warning', loadTimeSeconds: 2.1, pageSizeMB: 3.4, requestCount: 98, recommendations: ['Compress map vector layers.', 'Lazyload auxiliary slider files.'] },
            accessibility: { status: 'success', score: 92, issues: [], improvements: ['Ensure alternative text captures seasonal pictures.'] }
          },
          recommendations: {
            criticalIssues: [
              { id: 'airbnb-crit-1', category: 'Page Speed', description: 'Hero imagery size causes layout shift (LCP 2.5s)', impact: 'Races bounce rate overhead by up to 5%', action: 'Apply fetchpriority="high" on head graphic.' }
            ],
            importantImprovements: [
              { id: 'airbnb-imp-1', category: 'Metadata', description: 'Missing localized meta keywords tags.', impact: 'May limit index sorting performance.', action: 'Deploy localized translations schema properties.' }
            ],
            quickWins: [
              { id: 'airbnb-qw-1', category: 'Robot directives', description: 'Robots.txt is missing a fallback sitemap anchor path link.', effort: 'Very Low', reward: 'Medium', action: 'Append Sitemap path header command.' }
            ],
            longTermGrowth: [
              { id: 'airbnb-lt-1', category: 'Authority', description: 'Outrank VRBO comparison pages index.', timeline: '6 Months', strategy: 'Publish localized guides covering off-grid eco retreats.' }
            ]
          },
          competitorAnalysis: {
            competitors: [
              { url: 'vrbo.com', overallScore: 84, strengths: ['Powerful transactional details', 'Generous longtail review profiles'], weaknesses: ['Slower page load times on cells', 'Cluttered user menu views'] },
              { url: 'booking.com', overallScore: 78, strengths: ['Gigantic list directories', 'Heavy backlink trust flow'], weaknesses: ['Intense conversion popover fatigue', 'Low accessibility WCAG index'] }
            ],
            contentGapAnalysis: ['Rivals boast massive comparisons tables linking localized rates. Designing dynamic widgets locks comparison queries.'],
            keywordOpportunities: ['cabin bookings near me (Volume: 12,500/mo)', 'airbnb alternatives cheap (Volume: 5,400/mo)'],
            roadmap: ['Month 1: Enable high-priority LCP compression guides.', 'Month 3: Launch neighborhood comparisons blogs.', 'Month 6: Expand longtail local guides schema tags.']
          }
        }
      },
      {
        id: 'seed-2',
        url: 'https://stripe.com',
        timestamp: new Date(now - 2 * dayMs).toISOString(),
        overallScore: 92,
        report: {
          url: 'https://stripe.com',
          timestamp: new Date(now - 2 * dayMs).toISOString(),
          scores: { overall: 92, performance: 91, contentQuality: 94, mobileOptimization: 92, userExperience: 94, technicalSEO: 91 },
          details: {
            metaTitle: { status: 'success', value: 'Stripe | Financial Infrastructure for the Internet', message: 'Sleek title layout (48 chars).', suggestion: 'Include payment APIs keyword tag.' },
            metaDescription: { status: 'success', value: 'Stripe is a suite of APIs powering online payments. Accept credit cards, manage subscription billing.', message: 'Highly descriptive description tag (124 chars).', suggestion: 'Optimize call to action trigger.' },
            headingStructure: { status: 'success', h1Count: 1, h2Count: 24, h3Count: 45, message: 'Outstanding heading model structure.', structure: ['H1: Financial infrastructure', 'H2: Payment solutions details', 'H3: Multi-currency API'], suggestion: 'Reduce redundant H3 tags inside code blocks.' },
            keywordOptimization: { status: 'success', found: ['payments', 'infrastructure', 'billing', 'apis'], missing: ['ecommerce transaction sdk', 'payment processors setup'], densitySummary: 'Primary words perfectly allocated through page.', suggestion: 'Keep present density weights.' },
            internalLinking: { status: 'success', linkCount: 224, brokenLinks: 0, suggestion: 'Deploy matching docs link anchors.' },
            contentReadability: { status: 'success', score: 65, readingGrade: '9th Grade', analysis: 'Perfect technical balance. Instills high credibility.', suggestion: 'Limit acronym use outside glossaries.' },
            ctaImprovements: ['Align landing buttons to collapse grids on mobile.', 'Ensure code copy triggers feedback ticks.'],
            mobileResponsiveness: { status: 'success', viewportSet: true, issues: [], suggestions: ['Position interactive slider elements carefully.'] },
            pageSpeed: { status: 'success', loadTimeSeconds: 1.4, pageSizeMB: 1.8, requestCount: 48, recommendations: ['Defer auxiliary javascript execution.'] },
            accessibility: { status: 'success', score: 95, issues: [], improvements: ['Contrast is excellent. Apply screenreader alerts on modals.'] }
          },
          recommendations: {
            criticalIssues: [],
            importantImprovements: [
              { id: 'strip-imp-1', category: 'Accessibility', description: 'Dashboard text contrasts are low in custom dark presets.', impact: 'Fails AA standard criteria', action: 'Adopt WCAG compliant contrast colors.' }
            ],
            quickWins: [
              { id: 'strip-qw-1', category: 'Sitemap', description: 'Sitemap links structure includes historical beta domains.', effort: 'Low', reward: 'High', action: 'Clean redirect loops from XML indexing files.' }
            ],
            longTermGrowth: [
              { id: 'strip-lt-1', category: 'Content Hub', description: 'Compete with PayPal developer queries.', timeline: '9 Months', strategy: 'Launch detailed comparison tools and interactive terminal builders.' }
            ]
          }
        }
      },
      {
        id: 'seed-3',
        url: 'https://coffeeroasters.net',
        timestamp: new Date(now - 12 * hourMs).toISOString(),
        overallScore: 64,
        report: {
          url: 'https://coffeeroasters.net',
          timestamp: new Date(now - 12 * hourMs).toISOString(),
          scores: { overall: 64, performance: 52, contentQuality: 74, mobileOptimization: 78, userExperience: 62, technicalSEO: 54 },
          details: {
            metaTitle: { status: 'warning', value: 'Home - Great Coffee', message: 'Extremely generic title. Fails to outline sector brand terms.', suggestion: 'Modify to: "Organic Fresh Coffee Roaster Subscription | CoffeeRoasters"' },
            metaDescription: { status: 'error', value: 'Check out our products page and read our contact bio page lines to order coffee.', message: 'Omitted keywords, low click rate structure format.', suggestion: 'Rewrite explanation defining roast categories.' },
            headingStructure: { status: 'error', h1Count: 3, h2Count: 4, h3Count: 1, message: 'Unbalanced heading model configuration.', structure: ['H1: Roaster Coffee', 'H1: Order fresh', 'H2: Newsletter'], suggestion: 'Reduce top elements to exactly one H1 tag.' },
            keywordOptimization: { status: 'warning', found: ['coffee'], missing: ['organic single origin blends', 'specialty bean subscriptions'], densitySummary: 'Low keyword weight (approx 0.3% density rating).', suggestion: 'Include organic single-origin blends terms.' },
            internalLinking: { status: 'error', linkCount: 12, brokenLinks: 3, suggestion: 'Fix breaking links leading to legacy blog posts.' },
            contentReadability: { status: 'success', score: 78, readingGrade: '6th Grade', analysis: 'Easy read, but paragraphs lack structural spacing.', suggestion: 'Paragraph spacing should use Tailwind py-3.' },
            ctaImprovements: ['Increase contrast on subscription buttons.', 'Add an interactive roast selector widget.'],
            mobileResponsiveness: { status: 'warning', viewportSet: true, issues: ['Horizontal scrolling occurs on small screens'], suggestions: ['Fulfill desktop grid viewport collapses.'] },
            pageSpeed: { status: 'error', loadTimeSeconds: 4.8, pageSizeMB: 4.2, requestCount: 140, recommendations: ['Compress big png images to webp format.', 'Minimize blocking stylesheets.'] },
            accessibility: { status: 'warning', score: 68, issues: ['Alt text tags missing on major catalog images.'], improvements: ['Append precise descriptors.'] }
          },
          recommendations: {
            criticalIssues: [
              { id: 'coffee-crit-1', category: 'Page performance', description: 'Huge imagery assets blocking rendering cycle (LCP 4.8s).', impact: 'Substantial conversion loss risks', action: 'Compress roasting visual files.' },
              { id: 'coffee-crit-2', category: 'Domain Links', description: 'Three homepage link paths lead directly to 404 targets.', impact: 'Severe search indexing crawling limits.', action: 'Change target internal anchor URLs.' }
            ],
            importantImprovements: [
              { id: 'coffee-imp-1', category: 'Metadata', description: 'Omitted meta description evaluation setups.', impact: 'Limits CTR clicking rates.', action: 'Deploy active description summarizing roaster programs.' }
            ],
            quickWins: [
              { id: 'coffee-qw-1', category: 'Header schema', description: 'Website is completely missing schema reviews. Org JSON is absent.', effort: 'Medium', reward: 'High', action: 'Deploy LocalBusiness JSON-LD markup headers.' }
            ],
            longTermGrowth: [
              { id: 'coffee-lt-1', category: 'Content planning', description: 'Build recurring subscription volume.', timeline: '3 Months', strategy: 'Formulate detailed guide pages detailing single-origin brewing tricks.' }
            ]
          }
        }
      }
    ];

    saveReportsToStorage(sampleSecuredReports);
    alert('Successfully seeded 3 sample audits: Airbnb, Stripe, and CoffeeRoasters! You can now explore the interactive visual analytics trend charts and comparison dashboards.');
    setCurrentView('dashboard');
  };

  return (
    <div id="app-root-container" className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-850 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between">
      <div>
        {/* Navigation Header bar */}
        <Header 
          currentView={currentView}
          onSetView={(v) => {
            setCurrentView(v);
            if (v === 'home') {
              setSelectedReport(null);
            }
          }}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          plan={activePlan}
          userEmail="mumpi.04banerjee@gmail.com"
          hasSavedReports={savedReports.length > 0}
        />

        {/* Dynamic workspace router views */}
        <main className="pb-16">
          {currentView === 'home' && (
            <HeroSection 
              onAnalyze={handleAnalyzeWebsite} 
              isLoading={isLoading} 
            />
          )}

          {currentView === 'report' && selectedReport && (
            <SEOReportView 
              report={selectedReport}
              onBack={() => {
                // If it is inside saved list, route to dashboard, else return to desk
                const exists = savedReports.some(r => r.report.url === selectedReport.url);
                setCurrentView(exists ? 'dashboard' : 'home');
              }}
              onSaveToHistory={() => {
                // Find if already saved
                const exists = savedReports.some(r => r.report.url === selectedReport.url);
                if (!exists) {
                  const recordId = 'audit_' + Math.random().toString(36).substring(2, 11);
                  const newRecord: SavedReport = {
                    id: recordId,
                    url: selectedReport.url,
                    timestamp: selectedReport.timestamp,
                    overallScore: selectedReport.scores.overall,
                    report: selectedReport
                  };
                  saveReportsToStorage([newRecord, ...savedReports]);
                }
                alert('Website report saved securely to your local scan profile!');
              }}
              isSaved={savedReports.some(r => r.report.url === selectedReport.url)}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView 
              history={savedReports}
              onOpenReport={handleOpenReport}
              onDeleteReport={handleDeleteReport}
              onNewScan={() => {
                setSelectedReport(null);
                setCurrentView('home');
              }}
              onSeedMockData={handleSeedReports}
            />
          )}

          {currentView === 'pricing' && (
            <PricingSection 
              onSelectPlan={handleSelectPlan}
              currentPlan={activePlan}
            />
          )}
        </main>
      </div>

      {/* Tidy human Footer */}
      <footer className="no-print border-t border-slate-100 dark:border-slate-900 py-8 text-center text-xs text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-950 font-sans">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-700 dark:text-slate-500">© 2026 SEO Genius AI Inc.</p>
            <p className="mt-1 text-[11px]">Commercial-grade AI Website Auditor and Search Performance Platform.</p>
          </div>
          <div className="flex gap-5 font-semibold text-slate-400 dark:text-slate-600">
            <span className="hover:text-emerald-500 cursor-pointer" onClick={() => setCurrentView('home')}>Audit Desk</span>
            <span className="hover:text-emerald-500 cursor-pointer" onClick={() => setCurrentView('dashboard')}>Saved Logs</span>
            <span className="hover:text-emerald-500 cursor-pointer" onClick={() => setCurrentView('pricing')}>Pricing Plans</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
