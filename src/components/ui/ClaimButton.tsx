'use client';

import { useState } from 'react';
import { Shield, X } from 'lucide-react';
import { ClaimProject } from './ClaimProject';
import { useRouter } from 'next/navigation';

interface ClaimButtonProps {
  alternative: {
    id: string;
    name: string;
    slug: string;
    github: string;
    hasOwner: boolean;
    approved: boolean;
  };
}

export function ClaimButton({ alternative }: ClaimButtonProps) {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const router = useRouter();

  const handleClaimSuccess = () => {
    setShowClaimModal(false);
    router.push('/dashboard');
  };

  return (
    <>
      <button
        onClick={() => setShowClaimModal(true)}
        className="inline-flex items-center px-2 sm:px-3 py-1 bg-brand/10 text-brand rounded-full text-xs sm:text-sm font-medium font-mono"
      >
        <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        Claim
      </button>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setShowClaimModal(false)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <ClaimProject
              existingAlternative={{
                id: alternative.id,
                name: alternative.name,
                slug: alternative.slug,
                github: alternative.github,
                hasOwner: alternative.hasOwner,
                approved: alternative.approved,
              }}
              onClaimSuccess={handleClaimSuccess}
              onCancel={() => setShowClaimModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
