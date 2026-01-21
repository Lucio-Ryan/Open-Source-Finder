'use client';

import { Check, Crown, Clock, Link, Newspaper, Zap, Sparkles, Code, X } from 'lucide-react';

export type SubmissionPlan = 'free' | 'sponsor';

interface PlanSelectionProps {
  selectedPlan: SubmissionPlan;
  onPlanSelect: (plan: SubmissionPlan) => void;
}

export function PlanSelection({ selectedPlan, onPlanSelect }: PlanSelectionProps) {
  const benefits = [
    { 
      name: 'Listed in search & categories', 
      description: 'Discoverable by users',
      free: true, 
      sponsor: true,
      icon: Check 
    },
    { 
      name: 'Featured on homepage', 
      description: 'Top Alternatives section for 7 days',
      free: false, 
      sponsor: true,
      icon: Sparkles 
    },
    { 
      name: 'Newsletter feature', 
      description: 'Shared with our weekly subscribers',
      free: false, 
      sponsor: true,
      icon: Newspaper 
    },
    { 
      name: 'Verified sponsor badge', 
      description: 'Green checkmark on your listing',
      free: false, 
      sponsor: true,
      icon: Check 
    },
    { 
      name: 'SEO boost with dofollow links', 
      description: 'Full SEO credit',
      free: false, 
      sponsor: true,
      icon: Check 
    },
    { 
      name: 'Premium card design', 
      description: 'Full-width with screenshots',
      free: false, 
      sponsor: true,
      icon: Check 
    },
    { 
      name: 'Unlimited updates', 
      description: 'Edit your listing anytime',
      free: false, 
      sponsor: true,
      icon: Check 
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Free Plan */}
      <div
        onClick={() => onPlanSelect('free')}
        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
          selectedPlan === 'free'
            ? 'border-brand bg-brand/5'
            : 'border-border hover:border-border-light bg-surface'
        }`}
      >
        {selectedPlan === 'free' && (
          <div className="absolute top-4 right-4">
            <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-dark" />
            </div>
          </div>
        )}

        <div className="mb-4 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-muted" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">Free Plan</h3>
              <p className="text-2xl font-bold text-brand">$0</p>
            </div>
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-2 text-sm">
            <Link className="w-4 h-4 text-muted mt-0.5 flex-shrink-0" />
            <span className="text-muted">
              <span className="text-white font-medium">Backlink required</span> - Add our embed code to your README
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted mt-0.5 flex-shrink-0" />
            <span className="text-muted">
              <span className="text-white font-medium">~1 week approval time</span> - Manual review by our team
            </span>
          </li>
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            const included = benefit.free;
            return (
              <li key={idx} className="flex items-start gap-2 text-sm">
                {included ? (
                  <Check className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-muted/40 mt-0.5 flex-shrink-0" />
                )}
                <span className={included ? 'text-muted' : 'text-muted/60 line-through'}>
                  {included ? (
                    <>
                      <span className="font-medium">{benefit.name}</span> - {benefit.description}
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{benefit.name}</span> - {benefit.description}
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="text-xs text-muted bg-dark/50 rounded-lg p-3 font-mono">
          💡 Perfect for open source projects looking to gain visibility
        </div>
      </div>

      {/* Sponsor Plan */}
      <div
        onClick={() => onPlanSelect('sponsor')}
        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
          selectedPlan === 'sponsor'
            ? 'border-emerald-500 bg-emerald-500/5'
            : 'border-border hover:border-emerald-500/50 bg-surface'
        }`}
      >
        {/* Recommended badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-dark text-xs font-bold rounded-full">
            RECOMMENDED
          </span>
        </div>

        {selectedPlan === 'sponsor' && (
          <div className="absolute top-4 right-4">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-dark" />
            </div>
          </div>
        )}

        <div className="mb-4 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">Sponsor Plan</h3>
              <p className="text-2xl font-bold text-emerald-500">$19</p>
            </div>
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted">
              <span className="text-white font-medium">No backlink required</span> - Get listed without adding our badge
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted">
              <span className="text-white font-medium">Instant approval</span> - No waiting, go live immediately
            </span>
          </li>
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Icon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted">
                  <span className="text-white font-medium">{benefit.name}</span>
                  {benefit.description && ` - ${benefit.description}`}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="text-xs text-emerald-500/80 bg-emerald-500/10 rounded-lg p-3 font-mono border border-emerald-500/20">
          🚀 Maximum visibility & instant launch for your project
        </div>
      </div>
    </div>
  );
}
