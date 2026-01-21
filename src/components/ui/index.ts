export { SearchBar } from './SearchBar';
export { AlternativeCard } from './AlternativeCard';
export { AlternativesList } from './AlternativesList';
export { AlternativeVoteSection } from './AlternativeVoteSection';
export { BioEditor } from './BioEditor';
export { CategoryCard } from './CategoryCard';
export { TagBadge } from './TagBadge';
export { NewsletterForm } from './NewsletterForm';
export { RichTextEditor } from './RichTextEditor';
export { RichTextContent } from './RichTextContent';
export { GitHubStatsCard } from './GitHubStatsCard';
export { ScreenshotCarousel } from './ScreenshotCarousel';
export { TechStackSelector } from './TechStackSelector';
export { CreatorProfileCard } from './CreatorProfileCard';
export { VoteButtons } from './VoteButtons';
export { LaunchesPage } from './LaunchesPage';
export { default as DiscussionSection } from './DiscussionSection';
export { default as NotificationsPanel } from './NotificationsPanel';

// Advertisement components
export { PopupAd } from './PopupAd';
export { BannerAd } from './BannerAd';
export { CardAd, useCardAds, intersperseAds, isAdvertisement } from './CardAd';
export { AlternativesGridWithAds } from './AlternativesGridWithAds';
export { AdSubmitForm } from './AdSubmitForm';

// Submission plan components
export { PlanSelection, type SubmissionPlan } from './PlanSelection';
export { BacklinkVerification } from './BacklinkVerification';
export { SponsoredAlternativeCard } from './SponsoredAlternativeCard';

// Payment components
export { PayPalButton, PayPalRedirectButton } from './PayPalButton';

// Helper to check if an alternative is an active sponsor
export function isActiveSponsor(alternative: { submission_plan?: string | null; sponsor_priority_until?: string | null }): boolean {
  if (alternative.submission_plan !== 'sponsor') return false;
  if (!alternative.sponsor_priority_until) return false;
  return new Date(alternative.sponsor_priority_until) > new Date();
}
