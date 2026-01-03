import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { mockCategories, mockTechStacks, mockAlternatives, mockProprietary, mockTags } from '@/lib/mock-data';

// Flag to check if we're using mock data
export const isUsingMockData = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Only log the warning once
let hasLoggedMockWarning = false;

// Create mock query builder that returns actual mock data
const createMockQueryBuilder = (tableName: string) => {
  let currentData: any[] = [];
  let filters: { column: string; value: any }[] = [];
  let isSingle = false;

  // Get the base data for the table
  const getTableData = () => {
    switch (tableName) {
      case 'categories':
        return mockCategories;
      case 'tech_stacks':
        return mockTechStacks;
      case 'alternatives':
        return mockAlternatives;
      case 'proprietary_software':
        return mockProprietary;
      case 'tags':
        return mockTags;
      default:
        return [];
    }
  };

  const applyFilters = (data: any[]) => {
    let result = [...data];
    for (const filter of filters) {
      result = result.filter(item => {
        if (filter.column.includes('.')) {
          // Handle nested filters like 'alternative_categories.category_id'
          return true; // Skip nested filters for mock
        }
        return item[filter.column] === filter.value;
      });
    }
    return result;
  };

  const builder: any = {
    select: () => {
      currentData = getTableData();
      return builder;
    },
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: (column: string, value: any) => {
      filters.push({ column, value });
      return builder;
    },
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: (column: string, pattern: string) => {
      const searchTerm = pattern.replace(/%/g, '').toLowerCase();
      currentData = currentData.filter(item => 
        item[column]?.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm)
      );
      return builder;
    },
    is: () => builder,
    in: () => builder,
    contains: () => builder,
    containedBy: () => builder,
    or: (orFilter: string) => {
      // Parse or filter for search
      const searchMatch = orFilter.match(/name\.ilike\.%(.+)%/);
      if (searchMatch) {
        const searchTerm = searchMatch[1].toLowerCase();
        currentData = currentData.filter(item =>
          item.name?.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm)
        );
      }
      return builder;
    },
    and: () => builder,
    not: () => builder,
    filter: () => builder,
    match: () => builder,
    order: (column: string, options?: { ascending?: boolean }) => {
      currentData.sort((a, b) => {
        const aVal = a[column] ?? 0;
        const bVal = b[column] ?? 0;
        if (options?.ascending) {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });
      return builder;
    },
    limit: (count: number) => {
      currentData = currentData.slice(0, count);
      return builder;
    },
    range: () => builder,
    single: () => {
      isSingle = true;
      const filtered = applyFilters(currentData);
      return Promise.resolve({ 
        data: filtered[0] || null, 
        error: filtered[0] ? null : { message: 'Not found' } 
      });
    },
    maybeSingle: () => {
      isSingle = true;
      const filtered = applyFilters(currentData);
      return Promise.resolve({ data: filtered[0] || null, error: null });
    },
    then: (resolve: Function) => {
      const filtered = applyFilters(currentData);
      resolve({ data: filtered, error: null, count: filtered.length });
    },
  };
  return builder;
};

// Admin client for API routes and queries (server-side only, no cookie handling needed)
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer service role key for server-side operations, fall back to anon key
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client that returns mock data during dev/build
    if (!hasLoggedMockWarning) {
      console.log('⚠️ Supabase credentials not found - using mock data');
      hasLoggedMockWarning = true;
    }
    return {
      from: (tableName: string) => createMockQueryBuilder(tableName),
    } as unknown as ReturnType<typeof createSupabaseClient<Database>>;
  }
  
  return createSupabaseClient<Database>(supabaseUrl, supabaseKey);
}
