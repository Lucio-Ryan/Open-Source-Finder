'use client';

import { useState, useMemo } from 'react';
import { AlternativeCard } from './AlternativeCard';
import { Pagination } from './Pagination';
import type { AlternativeWithRelations } from '@/types/database';

interface PaginatedAlternativesGridProps {
  alternatives: AlternativeWithRelations[];
  itemsPerPage?: number;
  emptyMessage?: string;
}

const ITEMS_PER_PAGE = 20;

export function PaginatedAlternativesGrid({ 
  alternatives, 
  itemsPerPage = ITEMS_PER_PAGE,
  emptyMessage = '// no alternatives found yet'
}: PaginatedAlternativesGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(alternatives.length / itemsPerPage);

  const paginatedAlternatives = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return alternatives.slice(startIndex, endIndex);
  }, [alternatives, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (alternatives.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted font-mono">
          <span className="text-brand">found:</span>{' '}
          <span className="text-white">{alternatives.length}</span> open source alternatives
          {totalPages > 1 && (
            <span className="text-muted/70"> • page {currentPage} of {totalPages}</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedAlternatives.map((alternative) => (
          <AlternativeCard key={alternative.id} alternative={alternative} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
