import { Check, Flame } from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface PricingSectionProps {
  onSelectPlan?: (planName: 'free' | 'pro') => void;
  currentPlan?: 'free' | 'pro';
}

export default function PricingSection({ onSelectPlan, currentPlan = 'free' }: PricingSectionProps) {
  const plans = [
    {
      name: 'Free Starter',
      key: 'free' as const,
      price: '$0',
      period: 'forever',
      description: 'Perfect for introducing your platform and running swift home checks.',
      features: [
        '3 website audits per day',
        'Basic SEO score breakdown',
        'Mobile optimization alerts',
        'Page speed estimation',
        'Local audit history tracking',
      ],
      notIncluded: [
        'Advanced competitor analysis',
        'Gemini-powered custom content gaps',
        'Interactive 12-month SEO roadmap',
        'PDF report printing & download exports',
        'Priority live API routing support',
      ],
      ctaText: 'Current Plan',
      popular: false,
    },
    {
      name: 'Pro Genius',
      key: 'pro' as const,
      price: '$49',
      period: 'month',
      description: 'Designed for active webmasters, agencies, and full-scale SaaS builders.',
      features: [
        'Unlimited audits & analysis scans',
        'Deep Gemini-powered custom SEO reports',
        'Comprehensive competitor analysis',
        'Keyword & content gap insights',
        'Interactive 12-month SEO roadmap',
        'PDF / Print report dynamic exports',
        'Continuous score trend tracking',
        'Priority live API routing support',
      ],
      notIncluded: [],
      ctaText: 'Upgrade to Pro',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-16 px-4 max-w-6xl mx-auto font-sans">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60 uppercase tracking-wider">
          Pricing Plans
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
          Flexible Plans for Growing Websites
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-base">
          Analyze website quality and outrank local competitors instantly. Invest in AI-powered optimization.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((p) => {
          const isPro = p.key === 'pro';
          const isCurrent = currentPlan === p.key;

          return (
            <div
              key={p.name}
              id={`pricing-card-${p.key}`}
              className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-between ${
                p.popular
                  ? 'border-emerald-500 bg-white dark:bg-slate-900/80 shadow-emerald-100/40 dark:shadow-none shadow-xl scale-[1.02] md:scale-105 z-10'
                  : 'border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 text-xs font-bold rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-md shadow-emerald-500/25">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  Most Popular
                </span>
              )}

              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{p.name}</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{p.description}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
                    {p.price}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-sm">
                    /{p.period}
                  </span>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-6"></div>

                {/* Features List */}
                <ul className="space-y-3.5 text-sm">
                  {p.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500 mt-0.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}

                  {p.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-slate-400/70 dark:text-slate-600 line-through">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-300 dark:text-slate-800 mt-0.5 font-bold text-xs select-none">
                        ×
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  id={`btn-select-pricing-${p.key}`}
                  onClick={() => onSelectPlan && onSelectPlan(p.key)}
                  disabled={isCurrent && p.key === 'free'}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isCurrent
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default'
                      : isPro
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 active:translate-y-[1px]'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white active:translate-y-[1px]'
                  }`}
                >
                  {isCurrent ? (isPro ? 'Saved Member' : 'Active Plan') : p.ctaText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
