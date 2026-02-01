// Alternative Tags Data
// Based on definitive-opensource tag system

export type AlertTagId = 
  | 'security-minor'
  | 'security-moderate' 
  | 'security-major'
  | 'security-critical'
  | 'abandoned'
  | 'closed-development'
  | 'development-paused'
  | 'development-slowed'
  | 'restrictive-license'
  | 'corporate-influence'
  | 'commercial'
  | 'experimental'
  | 'unstable'
  | 'on-watch';

export type HighlightTagId =
  | 'disruptive'
  | 'influential'
  | 'pioneering'
  | 'innovative';

export type PlatformTagId =
  | 'cross-platform'
  | 'mobile'
  | 'windows'
  | 'macos'
  | 'linux'
  | 'android'
  | 'ios'
  | 'self-host'
  | 'web-cloud'
  | 'vscode'
  | 'jetbrains'
  | 'chromium'
  | 'firefox'
  | 'n-a';

export type PropertyTagId =
  | 'cli-plus'
  | 'tui'
  | 'manual'
  | 'web-ui'
  | 'cli'
  | 'plugin'
  | 'extension';

export type AlternativeTagId = AlertTagId | HighlightTagId | PlatformTagId | PropertyTagId;

export interface AlternativeTagDefinition {
  id: AlternativeTagId;
  name: string;
  emoji: string;
  description: string;
  category: 'alert' | 'highlight' | 'platform' | 'property';
}

// Alert Tags
export const alertTags: AlternativeTagDefinition[] = [
  {
    id: 'security-minor',
    name: 'Security Incident (Minor)',
    emoji: '🟡',
    description: 'Minor security incident reported',
    category: 'alert',
  },
  {
    id: 'security-moderate',
    name: 'Security Incident (Moderate)',
    emoji: '🟠',
    description: 'Moderate security incident reported',
    category: 'alert',
  },
  {
    id: 'security-major',
    name: 'Security Incident (Major)',
    emoji: '🔴',
    description: 'Major security incident reported',
    category: 'alert',
  },
  {
    id: 'security-critical',
    name: 'Security Incident (Critical)',
    emoji: '⭕',
    description: 'Critical security incident reported',
    category: 'alert',
  },
  {
    id: 'abandoned',
    name: 'Potentially Abandoned',
    emoji: '🚫',
    description: 'Project appears to be potentially abandoned',
    category: 'alert',
  },
  {
    id: 'closed-development',
    name: 'Closed Development Model',
    emoji: '🔒',
    description: 'Development is not open to community contributions',
    category: 'alert',
  },
  {
    id: 'development-paused',
    name: 'Development Paused',
    emoji: '🛑',
    description: 'Active development has been paused',
    category: 'alert',
  },
  {
    id: 'development-slowed',
    name: 'Development Slowed',
    emoji: '⏳',
    description: 'Development activity has significantly slowed',
    category: 'alert',
  },
  {
    id: 'restrictive-license',
    name: 'Restrictive License',
    emoji: '⚠️',
    description: 'Uses a restrictive or non-standard open source license',
    category: 'alert',
  },
  {
    id: 'corporate-influence',
    name: 'Corporate Influence',
    emoji: '🏦',
    description: 'Significant corporate influence over the project',
    category: 'alert',
  },
  {
    id: 'commercial',
    name: 'Commercial',
    emoji: '💰',
    description: 'Has commercial/paid aspects',
    category: 'alert',
  },
  {
    id: 'experimental',
    name: 'Experimental (Pre-Alpha)',
    emoji: '🧪',
    description: 'Experimental or pre-alpha software - not ready for production',
    category: 'alert',
  },
  {
    id: 'unstable',
    name: 'Critically Unstable/Buggy',
    emoji: '🚧',
    description: 'Known to be critically unstable or buggy',
    category: 'alert',
  },
  {
    id: 'on-watch',
    name: 'On Watch for Removal',
    emoji: '❌',
    description: 'Being monitored for potential removal from the directory',
    category: 'alert',
  },
];

// Highlight Tags
export const highlightTags: AlternativeTagDefinition[] = [
  {
    id: 'disruptive',
    name: 'Disruptive',
    emoji: '💥',
    description: 'Disruptive technology that challenges established norms',
    category: 'highlight',
  },
  {
    id: 'influential',
    name: 'Influential',
    emoji: '🌍',
    description: 'Has had significant influence on the ecosystem',
    category: 'highlight',
  },
  {
    id: 'pioneering',
    name: 'Pioneering',
    emoji: '🌟',
    description: 'Pioneer in its category or approach',
    category: 'highlight',
  },
  {
    id: 'innovative',
    name: 'Innovative',
    emoji: '💡',
    description: 'Features innovative technology or approaches',
    category: 'highlight',
  },
];

// Platform Tags
export const platformTags: AlternativeTagDefinition[] = [
  {
    id: 'cross-platform',
    name: 'Cross-platform',
    emoji: 'Cross',
    description: 'Available on MacOS, Windows, and Linux',
    category: 'platform',
  },
  {
    id: 'mobile',
    name: 'Mobile',
    emoji: 'Mobile',
    description: 'Available on Android and iOS',
    category: 'platform',
  },
  {
    id: 'windows',
    name: 'Windows',
    emoji: 'Windows',
    description: 'Available on Windows (binary distribution)',
    category: 'platform',
  },
  {
    id: 'macos',
    name: 'MacOS',
    emoji: 'MacOS',
    description: 'Available on MacOS (binary distribution)',
    category: 'platform',
  },
  {
    id: 'linux',
    name: 'Linux',
    emoji: 'Linux',
    description: 'Available on Linux (binary distribution)',
    category: 'platform',
  },
  {
    id: 'android',
    name: 'Android',
    emoji: 'Android',
    description: 'Available on Android',
    category: 'platform',
  },
  {
    id: 'ios',
    name: 'iOS',
    emoji: 'iOS',
    description: 'Available on iOS',
    category: 'platform',
  },
  {
    id: 'self-host',
    name: 'Self-Host',
    emoji: 'SelfHost',
    description: 'Can be self-hosted (Docker by default)',
    category: 'platform',
  },
  {
    id: 'web-cloud',
    name: 'Web (Cloud)',
    emoji: 'Web',
    description: 'Available as a cloud/web service',
    category: 'platform',
  },
  {
    id: 'vscode',
    name: 'VSCode',
    emoji: 'VSCode',
    description: 'Available as VSCode extension',
    category: 'platform',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains',
    emoji: 'JetBrains',
    description: 'Available for JetBrains IDEs',
    category: 'platform',
  },
  {
    id: 'chromium',
    name: 'Chromium',
    emoji: 'Chromium',
    description: 'Available for Chromium-based browsers',
    category: 'platform',
  },
  {
    id: 'firefox',
    name: 'Firefox',
    emoji: 'Firefox',
    description: 'Available for Firefox browser',
    category: 'platform',
  },
  {
    id: 'n-a',
    name: 'N/A',
    emoji: 'N/A',
    description: 'Platform not applicable',
    category: 'platform',
  },
];

// Property Tags
export const propertyTags: AlternativeTagDefinition[] = [
  {
    id: 'cli-plus',
    name: 'CLI+',
    emoji: 'CLI+',
    description: 'Has CLI in addition to GUI',
    category: 'property',
  },
  {
    id: 'tui',
    name: 'TUI',
    emoji: 'TUI',
    description: 'Terminal user interface',
    category: 'property',
  },
  {
    id: 'manual',
    name: 'Manual',
    emoji: 'Manual',
    description: 'Installation via pip, npm, cargo, or building from source',
    category: 'property',
  },
  {
    id: 'web-ui',
    name: 'Web UI',
    emoji: 'Web UI',
    description: 'Desktop app with web-based UI',
    category: 'property',
  },
  {
    id: 'cli',
    name: 'CLI',
    emoji: 'CLI',
    description: 'Command-line interface only',
    category: 'property',
  },
  {
    id: 'plugin',
    name: 'Plugin',
    emoji: 'Plugin',
    description: 'Operates as a plugin',
    category: 'property',
  },
  {
    id: 'extension',
    name: 'Extension',
    emoji: 'Extension',
    description: 'Browser or IDE extension',
    category: 'property',
  },
];

// All tags combined
export const allAlternativeTags: AlternativeTagDefinition[] = [
  ...alertTags,
  ...highlightTags,
  ...platformTags,
  ...propertyTags,
];

// Helper function to get tag by ID
export function getAlternativeTagById(id: AlternativeTagId): AlternativeTagDefinition | undefined {
  return allAlternativeTags.find(tag => tag.id === id);
}

// Helper function to get tags by category
export function getAlternativeTagsByCategory(category: 'alert' | 'highlight' | 'platform' | 'property'): AlternativeTagDefinition[] {
  switch (category) {
    case 'alert':
      return alertTags;
    case 'highlight':
      return highlightTags;
    case 'platform':
      return platformTags;
    case 'property':
      return propertyTags;
    default:
      return [];
  }
}

// Re-export the interface from database.ts for consistency
// Use string[] for flexibility when storing/retrieving from database
export type { AlternativeTagsData } from '@/types/database';

// Default empty tags
export const emptyAlternativeTags = {
  alerts: [] as string[],
  highlights: [] as string[],
  platforms: [] as string[],
  properties: [] as string[],
};
