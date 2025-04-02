
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface PropertiesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PropertiesPagination: React.FC<PropertiesPaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }
  
  // Calculate page numbers to show (always show max 5 pages)
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate the range of pages to show around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if we're near the beginning
    if (currentPage <= 3) {
      endPage = Math.min(maxPagesToShow - 1, totalPages - 1);
    }
    
    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxPagesToShow + 2);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('start-ellipsis');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('end-ellipsis');
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="mt-8">
      <PaginationContent className="bg-white shadow-sm rounded-md py-2 px-1">
        {/* Previous button */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }} 
            />
          </PaginationItem>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === 'start-ellipsis' || page === 'end-ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next button */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }} 
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PropertiesPagination;
