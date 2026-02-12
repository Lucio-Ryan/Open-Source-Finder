/**
 * SEO Utilities Index
 * 
 * Central export for all SEO-related utilities:
 * - Metadata generation for all page types
 * - Structured data (JSON-LD) generation
 * - URL slug generation
 */

// Metadata generators
export {
  generateAlternativeMetadata,
  generateCategoryMetadata,
  generateLanguageMetadata,
  generateTagMetadata,
  generateTechStackMetadata,
  generateAlternativesToMetadata,
  generateBreadcrumbs,
  type AlternativeMetaInput,
  type CategoryMetaInput,
  type LanguageMetaInput,
  type TagMetaInput,
  type TechStackMetaInput,
  type ProprietaryMetaInput,
} from './metadata';

// Structured data (JSON-LD) generators
export {
  generateSoftwareApplicationSchema,
  generateItemListSchema,
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateFAQSchema,
  buildAlternativePageSchemas,
  buildCategoryPageSchemas,
  buildLanguagePageSchemas,
  buildAlternativesToPageSchemas,
  type SoftwareAppInput,
  type ItemListInput,
  type BreadcrumbInput,
} from './structured-data';

// Slug utilities
export {
  generateSlug,
  generateUniqueSlug,
  validateSlug,
  generateLanguageSlug,
  slugToDisplayName,
} from './slugify';
