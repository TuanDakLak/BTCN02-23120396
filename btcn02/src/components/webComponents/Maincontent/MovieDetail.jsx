import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { apiGet } from "../../../api/movieAPI";

export default function MovieDetail({ id, onSelectPerson }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviewsPagination, setReviewsPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    page_size: 5,
  });

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await apiGet(`/api/movies/${id}`);
        if (mounted) setMovie(data);
      } catch (err) {
        if (mounted) setError(err.message || "Lỗi khi tải dữ liệu");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  const fetchReviews = async (page = 1) => {
    if (!id) return;
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const data = await apiGet(`/api/movies/${id}/reviews?page=${page}&limit=5&sort=newest`);
      
      setReviews(data.data || []);
      setReviewsPagination(data.pagination || {
        current_page: page,
        total_pages: 1,
        total_items: 0,
        page_size: 5
      });
      
    } catch (err) {
      console.error("Lỗi khi tải reviews:", err);
      setReviewsError(err.message || "Lỗi khi tải đánh giá");
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };
  useEffect(() => {
    if (movie && id) {
      fetchReviews(1);
    }
  }, [movie, id]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= reviewsPagination.total_pages) {
      fetchReviews(page);
      // Scroll to reviews section
      setTimeout(() => {
        const reviewsSection = document.getElementById('reviews-section');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 50);
    }
  };

  const renderPagination = () => {
    const { current_page, total_pages } = reviewsPagination;
    if (total_pages <= 1) return null;
    
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

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

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-lg transition-colors ${
            i === current_page
              ? "bg-blue-500 text-white font-medium"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < total_pages) {
      if (endPage < total_pages - 1) {
        pages.push(
          <span key="dots-end" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={total_pages}
          onClick={() => handlePageChange(total_pages)}
          className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {total_pages}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Đang tải phim...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 shadow-lg rounded-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-3xl mb-2">!</div>
              <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
                Có lỗi xảy ra
              </p>
              <p className="text-gray-600 dark:text-gray-300">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!movie) return null;


  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-6 bg-gray-50 dark:bg-gray-900/50">
              <div className="sticky top-6">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full rounded-xl shadow-lg"
                />
                {movie.year && (
                  <div className="mt-4 text-center">
                    <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-semibold">
                      {movie.year}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-2/3 p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {movie.title}
              </h1>

              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {movie.genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-6">
                {movie.directors && movie.directors.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Đạo diễn
                    </h3>
                    <div className="flex flex-wrap">
                      {movie.directors.map(renderPersonButton)}
                    </div>
                  </div>
                )}

                {movie.writers && movie.writers.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Biên kịch
                    </h3>
                    <div className="flex flex-wrap">
                      {movie.writers.map(renderPersonButton)}
                    </div>
                  </div>
                )}

                {movie.actors && movie.actors.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      Diễn viên
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {movie.actors.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => onSelectPerson?.(a.id)}
                          className="text-left p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {a.name}
                          </p>
                          {a.character && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Vai: {a.character}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(movie.plot_full || movie.short_description) && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      Nội dung
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {movie.plot_full || movie.short_description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {movie.reviews && movie.reviews.length > 0 && (
        <Card
          id="reviews-section"
          className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden mt-8"
        >
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Đánh giá từ khán giả
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {totalReviews} đánh giá
                  {totalPages > 1 && ` • Trang ${currentPage}/${totalPages}`}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {currentReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {review.username}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                          {review.username}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatReviewDate(review.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">
                        {review.rate}
                      </span>
                    </div>
                  </div>

                  {review.title && (
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      {review.title}
                    </h5>
                  )}

                  <div className="mt-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm text-left leading-relaxed">
                      {review.content}
                    </p>
                    {review.warning_spoilers && (
                      <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-xs text-red-600 dark:text-red-400 rounded">
                        ⚠️ Cảnh báo spoiler
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* FIXED: Phân trang luôn hiển thị khi có nhiều hơn 1 trang */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  ← Trước
                </button>

                {renderPagination()}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Sau →
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Similar Movies */}
      {movie.similar_movies && movie.similar_movies.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden mt-8">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Phim tương tự
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {movie.similar_movies.slice(0, 4).map((similarMovie) => (
                <button
                  key={similarMovie.id}
                  onClick={() =>
                    (window.location.href = `/movies/${similarMovie.id}`)
                  }
                  className="group text-left"
                >
                  <div className="relative overflow-hidden rounded-lg mb-2">
                    <img
                      src={similarMovie.image}
                      alt={similarMovie.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      ⭐ {similarMovie.rate?.toFixed(1) || "0.0"}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {similarMovie.title}
                  </h4>
                  {similarMovie.year && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {similarMovie.year}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
