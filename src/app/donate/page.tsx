'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Coffee, Rocket, Star, ArrowLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    paypal?: any;
  }
}

function PayPalDonateButton({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRendered = useRef(false);

  // Fetch PayPal client ID
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/paypal');
        const data = await res.json();
        if (data.configured && data.client_id) {
          setClientId(data.client_id);
        } else {
          setError('PayPal is not configured. Please contact support.');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load payment configuration');
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  // Load PayPal SDK
  useEffect(() => {
    if (!clientId || sdkLoaded) return;

    if (window.paypal) {
      setSdkLoaded(true);
      setLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => {
      setSdkLoaded(true);
      setLoading(false);
    };
    script.onerror = () => {
      setError('Failed to load PayPal SDK');
      setLoading(false);
    };
    document.body.appendChild(script);
  }, [clientId, sdkLoaded]);

  // Render PayPal buttons
  useEffect(() => {
    if (!sdkLoaded || !window.paypal || !containerRef.current || buttonsRendered.current || amount < 1) {
      return;
    }

    buttonsRendered.current = true;

    window.paypal
      .Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          height: 50,
        },
        createOrder: async () => {
          try {
            const res = await fetch('/api/paypal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount }),
            });

            const data = await res.json();
            if (!res.ok || !data.order_id) {
              throw new Error(data.error || 'Failed to create order');
            }

            return data.order_id;
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to create order';
            setError(errorMsg);
            throw err;
          }
        },
        onApprove: async (data: { orderID: string }) => {
          try {
            const res = await fetch('/api/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_id: data.orderID }),
            });

            const captureData = await res.json();
            if (!res.ok || !captureData.success) {
              throw new Error(captureData.error || 'Failed to capture payment');
            }

            // Redirect to success page
            window.location.href = `/payment/success?capture_id=${captureData.capture_id}&amount=${captureData.amount}`;
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Payment failed';
            setError(errorMsg);
          }
        },
        onCancel: () => {
          window.location.href = '/donate?cancelled=true';
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          setError('PayPal encountered an error. Please try again.');
        },
      })
      .render(containerRef.current);
  }, [sdkLoaded, amount]);

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (loading || !sdkLoaded || amount < 1) {
    return (
      <div className="w-full flex items-center justify-center py-6">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
        <span className="ml-2 text-muted text-sm font-mono">Loading PayPal...</span>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full paypal-button-container" />;
}

const PRESET_AMOUNTS = [
  { value: 5, label: '$5', icon: Coffee, description: 'Buy us a coffee' },
  { value: 10, label: '$10', icon: Heart, description: 'Show some love' },
  { value: 25, label: '$25', icon: Star, description: 'Become a supporter' },
  { value: 50, label: '$50', icon: Rocket, description: 'Help us grow' },
];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(value);
    setIsCustom(true);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    if (isCustom && customAmount) {
      return parseFloat(customAmount);
    }
    return selectedAmount || 0;
  };

  const finalAmount = getFinalAmount();
  const isValidAmount = finalAmount >= 1;

  // PayPal donation URL with the selected amount
  // Prefer PayPal.me username (NEXT_PUBLIC_PAYPAL_ME) or merchant/business id/email
  const paypalMe = process.env.NEXT_PUBLIC_PAYPAL_ME; // e.g. 'YourPayPalMeName'
  const paypalBusiness = process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_ID; // merchant id or email

  let paypalDonateUrl = '#';
  const isPayPalConfigured = Boolean(paypalMe || paypalBusiness);
  if (finalAmount >= 1 && isPayPalConfigured) {
    if (paypalMe) {
      paypalDonateUrl = `https://www.paypal.me/${encodeURIComponent(paypalMe)}/${finalAmount}`;
    } else {
      paypalDonateUrl = `https://www.paypal.com/donate?business=${encodeURIComponent(
        paypalBusiness as string
      )}&amount=${finalAmount}&currency_code=USD`;
    }
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-brand font-mono text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h1 className="font-pixel text-2xl sm:text-3xl text-white mb-4">
            Support<span className="text-brand">_</span>The<span className="text-brand">_</span>Project
          </h1>
          <p className="text-muted font-mono text-sm sm:text-base max-w-xl mx-auto">
            Help us keep OPEN_SRC.ME running and continue discovering amazing open-source alternatives.
            Your support helps cover hosting & database costs.
          </p>
        </div>

        {/* Donation Card */}
        <div className="max-w-lg mx-auto">
          <div className="bg-surface border border-border rounded-xl p-6 sm:p-8">
            <h2 className="font-mono text-lg text-white mb-6 text-center">
              Choose an amount
            </h2>

            {/* Preset Amounts */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PRESET_AMOUNTS.map(({ value, label, icon: Icon, description }) => (
                <button
                  key={value}
                  onClick={() => handlePresetClick(value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left group ${
                    selectedAmount === value && !isCustom
                      ? 'border-brand bg-brand/10'
                      : 'border-border hover:border-brand/50 bg-dark/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        selectedAmount === value && !isCustom
                          ? 'text-brand'
                          : 'text-muted group-hover:text-brand'
                      }`}
                    />
                    <div>
                      <div
                        className={`font-mono text-lg ${
                          selectedAmount === value && !isCustom
                            ? 'text-brand'
                            : 'text-white'
                        }`}
                      >
                        {label}
                      </div>
                      <div className="text-muted text-xs font-mono">{description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-8">
              <label className="block text-muted font-mono text-sm mb-2">
                Or enter a custom amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-mono">
                  $
                </span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomChange}
                  onFocus={() => setIsCustom(true)}
                  placeholder="Enter amount"
                  className={`w-full pl-8 pr-4 py-3 bg-dark border-2 rounded-lg font-mono text-white placeholder:text-muted/50 focus:outline-none transition-colors ${
                    isCustom && customAmount
                      ? 'border-brand'
                      : 'border-border focus:border-brand/50'
                  }`}
                />
              </div>
              {isCustom && customAmount && parseFloat(customAmount) < 1 && (
                <p className="text-red-400 font-mono text-xs mt-2">
                  Minimum donation amount is $1
                </p>
              )}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-4 border-t border-border mb-6">
              <span className="text-muted font-mono">Total</span>
              <span className="text-white font-mono text-2xl">
                ${finalAmount.toFixed(2)} <span className="text-muted text-sm">USD</span>
              </span>
            </div>

            {/* PayPal Button (embedded SDK) */}
            <PayPalDonateButton amount={finalAmount} />

            <p className="text-muted/60 font-mono text-xs text-center mt-4">
              Secure payment powered by PayPal. No account required.
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-muted font-mono text-sm mb-4">
              Your donation helps us:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-muted/80 font-mono text-xs">
              <span className="flex items-center gap-1">
                <span className="text-brand">•</span> Maintain servers
              </span>
              <span className="flex items-center gap-1">
                <span className="text-brand">•</span> Add new features
              </span>
              <span className="flex items-center gap-1">
                <span className="text-brand">•</span> Support developers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
