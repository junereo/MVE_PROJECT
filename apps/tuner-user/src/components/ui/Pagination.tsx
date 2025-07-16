interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center items-center gap-2 text-sm">
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        return (
          <button
            key={i}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded ${
              currentPage === pageNum
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {pageNum}
          </button>
        );
      })}
    </div>
  );
}
