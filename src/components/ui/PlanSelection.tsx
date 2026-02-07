'use client';

import { useEffect, useState } from 'react';
import { Check, Crown, Clock, Link, Newspaper, Zap, Sparkles, Code, X, AlertCircle } from 'lucide-react';

export type SubmissionPlan = 'free' | 'sponsor';

interface SponsorStatus {
  canAccept: boolean;
  currentCount: number;
  maxCount: number;
  slotsRemaining: number;
}

interface PlanSelectionProps {
  selectedPlan: SubmissionPlan;
  onPlanSelect: (plan: SubmissionPlan) => void;
}

export function PlanSelection({ selectedPlan, onPlanSelect }: PlanSelectionProps) {
  const [sponsorStatus, setSponsorStatus] = useState<SponsorStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsorStatus = async () => {
      try {
        const response = await fetch('/api/alternatives/sponsor-status');
        if (response.ok) {
          const data = await response.json();
          setSponsorStatus(data);
        }
      } catch (error) {
        console.error('Failed to fetch sponsor status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorStatus();
  }, []);

  const isSponsorFull = sponsorStatus && !sponsorStatus.canAccept;

  const handlePlanSelect = (plan: SubmissionPlan) => {
    // Don't allow selecting sponsor if slots are full
    if (plan === 'sponsor' && isSponsorFull) {
      return;
    }
    onPlanSelect(plan);
  };

  const benefits = [
    { 
      name: 'Listed in search & categories', 
      description: 'Discoverable by users',
      free: true, 
      sponsor: true,
      icon: Check 
    },
    { 
      name: 'Unlimited updates', 
      description: 'Edit your listing anytime',
      free: false, 
      sponsor: true,
      freeName: 'Limited updates',
      freeDescription: '1 free edit per month',
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
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Basic Listing */}
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
              <h3 className="text-lg font-bold text-white font-mono">Basic Listing</h3>
              <p className="text-2xl font-bold text-brand">$0</p>
            </div>
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted mt-0.5 flex-shrink-0" />
            <span className="text-muted">
              <span className="text-white font-medium">~1 month approval time</span> - Manual review by our team
            </span>
          </li>
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            const included = benefit.free;
            const hasFreeDescription = 'freeDescription' in benefit && (benefit as any).freeDescription;
            const freeName = 'freeName' in benefit ? (benefit as any).freeName : benefit.name;
            return (
              <li key={idx} className="flex items-start gap-2 text-sm">
                {included ? (
                  <Check className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                ) : hasFreeDescription ? (
                  <Check className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-muted/40 mt-0.5 flex-shrink-0" />
                )}
                <span className={included || hasFreeDescription ? 'text-muted' : 'text-muted/60 line-through'}>
                  {included ? (
                    <>
                      <span className={`font-medium ${benefit.name === 'Listed in search & categories' ? 'text-white' : ''}`}>{benefit.name}</span> - {benefit.description}
                    </>
                  ) : hasFreeDescription ? (
                    <>
                      <span className="font-medium text-white">{freeName}</span> - {(benefit as any).freeDescription}
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
          Perfect for open source projects looking to gain visibility
        </div>
      </div>

      {/* Sponsored Listing */}
      <div
        onClick={() => handlePlanSelect('sponsor')}
        className={`relative p-6 rounded-xl border-2 transition-all ${
          isSponsorFull
            ? 'border-border/50 bg-surface/50 cursor-not-allowed opacity-60'
            : selectedPlan === 'sponsor'
            ? 'border-emerald-500 bg-emerald-500/5 cursor-pointer'
            : 'border-border hover:border-emerald-500/50 bg-surface cursor-pointer'
        }`}
      >
        {/* Recommended badge or Sold Out badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          {isSponsorFull ? (
            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full">
              SOLD OUT
            </span>
          ) : (
            <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-dark text-xs font-bold rounded-full">
              RECOMMENDED
            </span>
          )}
        </div>

        {selectedPlan === 'sponsor' && !isSponsorFull && (
          <div className="absolute top-4 right-4">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-dark" />
            </div>
          </div>
        )}

        <div className="mb-4 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-10 h-10 border rounded-lg flex items-center justify-center ${
              isSponsorFull 
                ? 'bg-muted/10 border-muted/30' 
                : 'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <Crown className={`w-5 h-5 ${isSponsorFull ? 'text-muted' : 'text-emerald-500'}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">Sponsored Listing</h3>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${isSponsorFull ? 'text-muted' : 'text-emerald-500'}`}>$49</p>
                {!loading && sponsorStatus && (
                  <span className={`text-sm font-medium ${
                    isSponsorFull ? 'text-red-400' : 'text-muted'
                  }`}>
                    ({sponsorStatus.slotsRemaining}/{sponsorStatus.maxCount} Left)
                  </span>
                )}
              </div>
            </div>
          </div>
          
        </div>

        <ul className="space-y-3 mb-6">
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
          Maximum visibility & instant launch for your project
        </div>
      </div>
    </div>
  );
}
