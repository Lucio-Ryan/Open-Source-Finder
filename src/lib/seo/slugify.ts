/**
 * URL Slug Generation System
 * 
 * Converts software names to SEO-friendly URL segments with:
 * - Lowercase conversion
 * - Special character handling
 * - Duplicate suffix generation
 * - Length truncation (60 chars max)
 * - Reserved word protection
 */

// Reserved URL segments that shouldn't be used as slugs
const RESERVED_SLUGS = new Set([
  'admin', 'api', 'auth', 'login', 'signup', 'signout',
  'dashboard', 'settings', 'profile', 'search', 'submit',
  'categories', 'tags', 'alternatives', 'alternatives-to',
  'tech-stacks', 'languages', 'self-hosted', 'launches',
  'about', 'privacy', 'terms', 'refund', 'donate',
  'advertise', 'payment', 'debug', 'sitemap', 'robots',
  'new', 'edit', 'delete', 'create', 'update',
]);

const MAX_SLUG_LENGTH = 60;

/**
 * Generate a URL-safe slug from a name string
 * 
 * @example
 * generateSlug("Notion Alternative") → "notion-alternative"
 * generateSlug("VS Code (IDE)") → "vs-code-ide"
 * generateSlug("C++ Compiler Tool") → "cpp-compiler-tool"
 * generateSlug("  My—App! v2.0 ") → "my-app-v2-0"
 */
export function generateSlug(name: string): string {
  let slug = name
    // Convert to lowercase
    .toLowerCase()
    // Normalize unicode (e.g., accented characters)
    .normalize('NFKD')
    // Remove diacritical marks
    .replace(/[\u0300-\u036f]/g, '')
    // Replace C++ and C# with words
    .replace(/c\+\+/g, 'cpp')
    .replace(/c#/g, 'csharp')
    .replace(/f#/g, 'fsharp')
    // Replace .NET with dotnet
    .replace(/\.net/g, 'dotnet')
    // Replace & with 'and'
    .replace(/&/g, 'and')
    // Replace @ with 'at'
    .replace(/@/g, 'at')
    // Replace + with 'plus' (after C++ handling)
    .replace(/\+/g, 'plus')
    // Replace any non-alphanumeric character with a hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Collapse multiple consecutive hyphens
    .replace(/-{2,}/g, '-');

  // Truncate to max length, but don't cut mid-word
  if (slug.length > MAX_SLUG_LENGTH) {
    slug = slug.substring(0, MAX_SLUG_LENGTH);
    // Remove trailing partial word (cut at last hyphen)
    const lastHyphen = slug.lastIndexOf('-');
    if (lastHyphen > MAX_SLUG_LENGTH * 0.5) {
      slug = slug.substring(0, lastHyphen);
    }
  }

  return slug;
}

/**
 * Generate a unique slug by appending a numeric suffix if the slug already exists
 * 
 * @param name - The name to generate a slug from
 * @param existingSlugs - Set or array of existing slugs to check against
 * @returns A unique slug string
 * 
 * @example
 * generateUniqueSlug("Notion", new Set(["notion"])) → "notion-2"
 * generateUniqueSlug("Notion", new Set(["notion", "notion-2"])) → "notion-3"
 */
export function generateUniqueSlug(
  name: string,
  existingSlugs: Set<string> | string[]
): string {
  const slugSet = existingSlugs instanceof Set ? existingSlugs : new Set(existingSlugs);
  let slug = generateSlug(name);

  // Handle reserved slugs
  if (RESERVED_SLUGS.has(slug)) {
    slug = `${slug}-app`;
  }

  // If slug is unique, return it
  if (!slugSet.has(slug)) {
    return slug;
  }

  // Append numeric suffix until unique
  let counter = 2;
  while (slugSet.has(`${slug}-${counter}`)) {
    counter++;
  }

  return `${slug}-${counter}`;
}

/**
 * Validate a slug format
 * Returns true if the slug is valid, or an error message string
 */
export function validateSlug(slug: string): true | string {
  if (!slug) return 'Slug cannot be empty';
  if (slug.length > MAX_SLUG_LENGTH) return `Slug must be ${MAX_SLUG_LENGTH} characters or less`;
  if (slug !== slug.toLowerCase()) return 'Slug must be lowercase';
  if (/^-|-$/.test(slug)) return 'Slug cannot start or end with a hyphen';
  if (/--/.test(slug)) return 'Slug cannot contain consecutive hyphens';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return 'Slug must contain only lowercase letters, numbers, and hyphens';
  if (RESERVED_SLUGS.has(slug)) return 'Slug is a reserved word';
  return true;
}

/**
 * Generate a language-specific slug for programming language pages
 * 
 * @example
 * generateLanguageSlug("JavaScript") → "javascript"
 * generateLanguageSlug("C++") → "cpp"
 * generateLanguageSlug("C#") → "csharp"
 * generateLanguageSlug("Objective-C") → "objective-c"
 */
export function generateLanguageSlug(language: string): string {
  return generateSlug(language);
}

/**
 * Extract display name from a slug
 * 
 * @example
 * slugToDisplayName("notion-alternative") → "Notion Alternative"
 * slugToDisplayName("project-management") → "Project Management"
 */
export function slugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
