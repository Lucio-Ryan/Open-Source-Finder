'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalButtonProps {
  paymentType: 'sponsor_submission' | 'boost_alternative' | 'ad_banner' | 'ad_card' | 'ad_popup';
  amount: string;
  submissionId?: string;
  advertisementId?: string;
  alternativeId?: string;
  projectName?: string;
  couponCode?: string;
  onSuccess: (captureData: {
    captureId: string;
    amount: string;
    payerEmail: string;
    expiresAt?: string;
  }) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  buttonText?: string;
  buttonClassName?: string;
}

export function PayPalButton({
  paymentType,
  amount,
  submissionId,
  advertisementId,
  alternativeId,
  projectName,
  couponCode,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
  buttonText,
  buttonClassName,
}: PayPalButtonProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
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

    // Check if SDK is already loaded
    if (window.paypal) {
      setSdkLoaded(true);
      setLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&enable-funding=card`;
    script.async = true;
    script.setAttribute('data-csp-nonce', '');
    script.onload = () => {
      setSdkLoaded(true);
      setLoading(false);
    };
    script.onerror = () => {
      setError('Failed to load PayPal SDK');
      setLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      // Don't remove the script on cleanup as it might be used by other components
    };
  }, [clientId, sdkLoaded]);

  // Re-render PayPal buttons when amount or couponCode changes
  useEffect(() => {
    if (buttonsRendered.current && paypalContainerRef.current) {
      // Clear existing buttons so they re-render with updated values
      paypalContainerRef.current.innerHTML = '';
      buttonsRendered.current = false;
    }
  }, [amount, couponCode]);

  // Render PayPal buttons
  useEffect(() => {
    if (!sdkLoaded || !window.paypal || !paypalContainerRef.current || buttonsRendered.current || disabled) {
      return;
    }

    buttonsRendered.current = true;

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
        height: 45,
      },
      
      createOrder: async () => {
        try {
          const res = await fetch('/api/paypal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payment_type: paymentType,
              submission_id: submissionId,
              advertisement_id: advertisementId,
              alternative_id: alternativeId,
              project_name: projectName,
              coupon_code: couponCode,
            }),
          });

          const data = await res.json();
          
          if (!res.ok || !data.order_id) {
            throw new Error(data.error || 'Failed to create order');
          }

          return data.order_id;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Failed to create order';
          setError(errorMsg);
          onError?.(errorMsg);
          throw err;
        }
      },

      onApprove: async (data: { orderID: string }) => {
        try {
          setLoading(true);
          setError(null);

          const res = await fetch('/api/paypal/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: data.orderID }),
          });

          const captureData = await res.json();

          if (!res.ok || !captureData.success) {
            throw new Error(captureData.error || 'Failed to capture payment');
          }

          onSuccess({
            captureId: captureData.capture_id,
            amount: captureData.amount,
            payerEmail: captureData.payer_email,
            expiresAt: captureData.expires_at,
          });
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Payment failed';
          setError(errorMsg);
          onError?.(errorMsg);
        } finally {
          setLoading(false);
        }
      },

      onCancel: () => {
        onCancel?.();
      },

      onError: (err: any) => {
        console.error('PayPal error:', err);
        const errorMsg = 'PayPal encountered an error. Please try again.';
        setError(errorMsg);
        onError?.(errorMsg);
      },
    }).render(paypalContainerRef.current);

  }, [sdkLoaded, disabled, paymentType, amount, submissionId, advertisementId, alternativeId, projectName, couponCode, onSuccess, onError, onCancel]);

  // Reset buttons when disabled changes
  useEffect(() => {
    if (disabled) {
      buttonsRendered.current = false;
    }
  }, [disabled]);

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            buttonsRendered.current = false;
            // Re-trigger SDK load
            if (window.paypal && paypalContainerRef.current) {
              setSdkLoaded(false);
              setTimeout(() => setSdkLoaded(true), 100);
            }
          }}
          className="w-full px-4 py-3 bg-surface border border-border text-white rounded-lg hover:border-brand/50 transition-colors font-mono text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading && !sdkLoaded) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
        <span className="ml-2 text-muted text-sm font-mono">Loading PayPal...</span>
      </div>
    );
  }

  if (disabled) {
    return (
      <button
        disabled
        className={buttonClassName || "w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border text-muted rounded-lg cursor-not-allowed font-mono"}
      >
        <CreditCard className="w-5 h-5" />
        {buttonText || `Pay $${amount}`}
      </button>
    );
  }

  return (
    <div className="w-full">
      <style jsx global>{`
        /* Dark mode styling for PayPal card fields */
        .paypal-button-container {
          --paypal-button-border-radius: 8px;
        }
        
        /* Target PayPal's card form container */
        .paypal-button-container .paypal-card-container,
        .paypal-button-container [data-funding-source="card"] {
          background-color: #1a1a2e !important;
          border-color: #2d2d44 !important;
        }
        
        /* Style the card fields when they load */
        .paypal-button-container iframe.card-fields-iframe {
          background-color: #1a1a2e !important;
        }
        
        /* Dark mode for card number, expiry, cvv fields */
        .paypal-button-container .card-field {
          background-color: #0d0d14 !important;
          border: 1px solid #2d2d44 !important;
          border-radius: 6px !important;
          color: #ffffff !important;
        }
        
        .paypal-button-container .card-field:focus {
          border-color: #00d9ff !important;
          box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.2) !important;
        }
        
        /* Dark styling for any hosted field text */
        .paypal-button-container .paypal-checkout-sandbox,
        .paypal-button-container .paypal-overlay {
          background-color: #0d0d14 !important;
        }
      `}</style>
      <div ref={paypalContainerRef} className="paypal-button-container" />
      {loading && (
        <div className="flex items-center justify-center py-2 mt-2">
          <Loader2 className="w-4 h-4 animate-spin text-brand" />
          <span className="ml-2 text-muted text-xs">Processing...</span>
        </div>
      )}
    </div>
  );
}

// Alternative simple button that redirects to PayPal
export function PayPalRedirectButton({
  paymentType,
  amount,
  submissionId,
  advertisementId,
  projectName,
  onError,
  disabled = false,
  buttonText,
  buttonClassName,
}: Omit<PayPalButtonProps, 'onSuccess' | 'onCancel'> & { onError?: (error: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_type: paymentType,
          submission_id: submissionId,
          advertisement_id: advertisementId,
          project_name: projectName,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.approval_url) {
        throw new Error(data.error || 'Failed to create payment');
      }

      // Redirect to PayPal
      window.location.href = data.approval_url;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initiate payment';
      setError(errorMsg);
      onError?.(errorMsg);
      setLoading(false);
    }
  };

  const defaultClassName = paymentType === 'sponsor_submission'
    ? "w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-dark font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    : "w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand text-dark font-bold rounded-lg hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-full">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mb-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className={buttonClassName || defaultClassName}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Connecting to PayPal...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.629h6.405c2.134 0 3.835.582 5.056 1.729 1.2 1.128 1.766 2.716 1.683 4.723-.079 1.905-.728 3.543-1.93 4.87-1.252 1.382-3.03 2.158-5.288 2.307H9.18a.77.77 0 0 0-.758.63l-1.346 3.986z" />
              <path d="M19.942 8.664c-.08 1.906-.729 3.544-1.93 4.87-1.253 1.383-3.03 2.159-5.289 2.308H10.8a.77.77 0 0 0-.758.63l-.992 2.937-.46 1.362a.641.641 0 0 0 .633.74h3.614a.77.77 0 0 0 .758-.63l.742-2.199a.77.77 0 0 1 .758-.63h1.924c2.258-.148 4.036-.924 5.288-2.306 1.202-1.327 1.851-2.965 1.93-4.87.084-2.008-.483-3.596-1.682-4.724-.227-.213-.47-.406-.73-.582.142.664.19 1.358.117 2.094z" opacity=".35" />
            </svg>
            {buttonText || `Pay $${amount} with PayPal`}
          </>
        )}
      </button>
      <p className="text-xs text-muted mt-2 text-center">
        Secure payment powered by PayPal. No account required.
      </p>
    </div>
  );
}
