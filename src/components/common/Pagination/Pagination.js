import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
  const pageNumbers = [];

  // Calculate page numbers to show (with ellipsis)
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageNumbers.push("...");
    }
  }

  // Remove consecutive dots
  const filteredPageNumbers = pageNumbers.filter(
    (number, index, array) =>
      index === 0 || number !== "..." || array[index - 1] !== "..."
  );

  if (totalPages <= 1) return null;

  return (
    <nav className={`pagination ${className}`} aria-label="Product pagination">
      <button
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Previous
      </button>

      <div className="page-numbers">
        {filteredPageNumbers.map((number, index) =>
          number === "..." ? (
            <span key={`dots-${index}`} className="pagination-dots">
              ...
            </span>
          ) : (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`page-number ${currentPage === number ? "active" : ""}`}
              aria-label={`Page ${number}`}
              aria-current={currentPage === number ? "page" : null}
            >
              {number}
            </button>
          )
        )}
      </div>

      <button
        className="pagination-btn pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;