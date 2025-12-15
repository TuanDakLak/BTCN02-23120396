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
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300">Đang tải chi tiết phim...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-red-600 dark:text-red-400 font-semibold">Lỗi khi tải dữ liệu</p>
              <p className="text-sm text-red-500 dark:text-red-300">{error}</p>
              <button
                className="mt-3 inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
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
      className="text-sm text-blue-600 hover:underline mr-2"
    >
      {p.name}
    </button>
  );
  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={onBack}
        className="mb-4 inline-block text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:underline"
      >
        ← Quay lại
      </button>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <img src={movie.image} alt={movie.title} className="w-full rounded shadow object-cover" />
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl font-bold mb-1">
            {movie.title} <span className="text-gray-500">({movie.year})</span>
          </h1>

          {movie.genres && movie.genres.length > 0 && (
            <p className="mb-3">
              <strong>Thể loại: </strong>
              {movie.genres.join(", ")}
            </p>
          )}

          {movie.directors && movie.directors.length > 0 && (
            <div className="mb-2">
              <strong>Đạo diễn: </strong>
              <span>{movie.directors.map(renderPersonButton)}</span>
            </div>
          )}

          {movie.writers && movie.writers.length > 0 && (
            <div className="mb-2">
              <strong>Biên kịch: </strong>
              <span>{movie.writers.map(renderPersonButton)}</span>
            </div>
          )}

          {movie.actors && movie.actors.length > 0 && (
            <div className="mb-2">
              <strong>Diễn viên: </strong>
              <div className="mt-1 flex flex-wrap gap-2">
                {movie.actors.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => onSelectPerson?.(a.id)}
                    className="text-sm text-left text-blue-600 hover:underline"
                  >
                    {a.name} {a.character ? <span className="text-gray-500">as {a.character}</span> : null}
                  </button>
                ))}
              </div>
            </div>
          )}

          {movie.plot_full ? (
            <div className="mt-3">
              <strong>Tóm tắt:</strong>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{movie.plot_full}</p>
            </div>
          ) : movie.short_description ? (
            <div className="mt-3">
              <strong>Tóm tắt:</strong>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{movie.short_description}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}