import React, { useState, useEffect } from "react";

export default function SearchResults({
  movies = [],
  onSelect,
  itemsPerPage = 12,
  initialPage = 1,
}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [paginatedMovies, setPaginatedMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (movies.length === 0) {
      setPaginatedMovies([]);
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    const total = Math.ceil(movies.length / itemsPerPage);
    setTotalPages(total);

    if (currentPage > total) {
      setCurrentPage(1);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMovies = movies.slice(startIndex, endIndex);

    setPaginatedMovies(currentMovies);
  }, [movies, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1 || movies.length === 0) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Điều chỉnh nếu không đủ maxVisiblePages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Nút trang đầu
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots-start" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    // Các trang giữa
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          aria-current={i === currentPage ? "page" : undefined}
          disabled={i === currentPage}
          className={`px-3 py-1 rounded-lg transition-colors ${
            i === currentPage
              ? "bg-blue-500 text-white font-medium cursor-default"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    // Nút trang cuối
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots-end" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị {paginatedMovies.length} trong tổng số {movies.length} phim
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              ← Trước
            </button>

            <div className="flex items-center space-x-1">{pages}</div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Sau →
            </button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Trang {currentPage} / {totalPages}
          </div>
        </div>

        {totalPages > 10 && (
          <div className="mt-4 flex justify-center">
            <div className="relative">
              <select
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <option key={page} value={page}>
                      Trang {page}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (movies.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 text-center py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Không tìm thấy phim nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Thử tìm kiếm với từ khóa khác
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div
        className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 
        dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Kết quả tìm kiếm
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Tìm thấy {movies.length} phim phù hợp
              {totalPages > 1 && ` • Trang ${currentPage}/${totalPages}`}
            </p>
          </div>
        </div>
      </div>

      {/* Grid hiển thị phim */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedMovies.map((m) => (
          <div key={m.id} className="bg-transparent">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(m.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect?.(m.id);
              }}
              className="rounded-xl overflow-hidden shadow-lg 
                hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300
                cursor-pointer bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500
                border border-gray-200 dark:border-gray-700 h-full flex flex-col"
              aria-label={`Xem chi tiết ${m.title}`}
            >
              <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img
                  src={m.image || ""}
                  alt={m.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {m.rate !== undefined && (
                  <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    ⭐ {m.rate.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 mb-2">
                  {m.title}
                  {m.year && (
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      ({m.year})
                    </span>
                  )}
                </h3>

                {m.genres && m.genres.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {m.genres.slice(0, 2).map((genre, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                      {m.genres.length > 2 && (
                        <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                          +{m.genres.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => onSelect?.(m.id)}
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 
                      hover:from-blue-600 hover:to-purple-600 text-white rounded-lg 
                      text-sm font-medium transition-colors"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
}
