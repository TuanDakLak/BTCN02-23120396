import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { apiGet } from "../../../api/movieAPI";

export default function PersonDetail({ id, onBack, onSelectMovie }) {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchPerson = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiGet(`/api/persons/${id}`);
        if (mounted) {
          setPerson(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || "Lỗi khi tải thông tin người");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPerson();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Đang tải thông tin người...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400 font-semibold">Lỗi</p>
            <p className="text-sm text-red-500 dark:text-red-300">{error}</p>
            <button
              className="mt-4 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded"
              onClick={onBack}
            >
              ← Quay lại
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!person) return null;

  const {
    name,
    role,
    image,
    summary,
    birth_date,
    death_date,
    height,
    known_for = [],
  } = person;

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (isNaN(d)) return iso;
      return d.toLocaleDateString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <button
        onClick={onBack}
        className="mb-4 inline-block text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:underline"
      >
        Quay lại
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <img
            src={image || "/placeholder-person.png"}
            alt={name}
            className="w-full rounded shadow object-cover"
          />
        </div>

        <div className="w-full md:w-2/3">
          <h1 className="text-2xl font-bold mb-1">{name}</h1>
          {role && <p className="text-sm text-gray-500 mb-2">{role}</p>}

          <div className="text-sm text-gray-600 mb-3">
            {birth_date && (
              <div>
                <strong>Sinh:</strong> {formatDate(birth_date)}
              </div>
            )}
            {death_date && (
              <div>
                <strong>Mất:</strong> {formatDate(death_date)}
              </div>
            )}
            {height && (
              <div>
                <strong>Chiều cao:</strong> {height}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-1">Tiểu sử</h3>
            {summary ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {summary}
              </p>
            ) : (
              <p className="text-sm text-gray-500">Không có tiểu sử.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Known for</h2>
        {known_for.length === 0 ? (
          <p className="text-sm text-gray-500">
            Không tìm thấy phim liên quan.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {known_for.map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-gray-800 rounded shadow p-3"
              >
                <div className="flex gap-3">
                  <img
                    src={m.image}
                    alt={m.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div className="flex-1">
                    <button
                      onClick={() => onSelectMovie?.(m.id)}
                      className="text-left text-sm font-semibold hover:underline"
                    >
                      {m.title}{" "}
                      {m.year ? (
                        <span className="text-gray-500">({m.year})</span>
                      ) : null}
                    </button>
                    <div className="text-xs text-gray-500 mt-1">
                      {m.role ? <span>{m.role}</span> : null}
                      {m.character ? <span> • {m.character}</span> : null}
                    </div>
                    {m.rate !== undefined && (
                      <div className="text-xs text-yellow-500 mt-2">
                        Rate: {m.rate}
                      </div>
                    )}
                    {m.short_description && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                        {m.short_description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
