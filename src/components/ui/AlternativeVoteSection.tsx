'use client';

import { VoteButtons } from './VoteButtons';

interface AlternativeVoteSectionProps {
  alternativeId: string;
  initialScore?: number;
}

export function AlternativeVoteSection({ alternativeId, initialScore = 0 }: AlternativeVoteSectionProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <h2 className="text-lg font-mono text-brand mb-4">// community_vote</h2>
      <div className="flex items-center justify-center">
        <VoteButtons 
          alternativeId={alternativeId} 
          initialScore={initialScore}
          size="lg"
          layout="horizontal"
        />
      </div>
      <p className="text-center text-xs font-mono text-muted mt-4">
        Vote to help others discover great alternatives
      </p>
    </div>
  );
}
