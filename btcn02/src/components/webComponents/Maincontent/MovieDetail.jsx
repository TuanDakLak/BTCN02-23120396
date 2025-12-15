import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { apiGet } from "../../../api/movieAPI";

export default function MovieDetail({ id, onBack, onSelectPerson }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Đang tải phim...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 shadow-lg rounded-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-3xl mb-2">!</div>
              <p className="text-red-600 dark:text-red-400 font-semibold text-lg">Có lỗi xảy ra</p>
              <p className="text-gray-600 dark:text-gray-300">{error}</p>
              <button
                className="mt-4 px-5 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
                onClick={onBack}
              >
                Quay lại
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!movie) return null;

  const renderPersonButton = (p) => (
    <button
      key={p.id}
      onClick={() => onSelectPerson?.(p.id)}
      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors mr-2 mb-2 text-sm"
    >
      {p.name}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
      >
        ← <span>Quay lại</span>
      </button>

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
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Đạo diễn</h3>
                    <div className="flex flex-wrap">
                      {movie.directors.map(renderPersonButton)}
                    </div>
                  </div>
                )}

                {movie.writers && movie.writers.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Biên kịch</h3>
                    <div className="flex flex-wrap">
                      {movie.writers.map(renderPersonButton)}
                    </div>
                  </div>
                )}

                {movie.actors && movie.actors.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Diễn viên</h3>
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
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Nội dung</h3>
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
    </div>
  );
}