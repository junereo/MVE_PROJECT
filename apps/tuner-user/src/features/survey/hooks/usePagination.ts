import { useState } from "react";

export const usePagination = <T>(data: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    currentPage,
    totalPages,
    currentData,
    setCurrentPage,
  };
};
