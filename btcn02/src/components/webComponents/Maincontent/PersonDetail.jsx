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
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <CardContent className="p-12 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-500 border-t-transparent mx-auto" />
              <p className="text-gray-600 dark:text-gray-300 font-medium">Đang tải thông tin...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 shadow-lg rounded-xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-red-500 text-3xl mb-2">!</div>
            <p className="text-red-600 dark:text-red-400 font-semibold text-lg">Lỗi</p>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
            <button
              className="px-5 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
              onClick={onBack}
            >
              Quay lại
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
    <div className="max-w-6xl mx-auto p-4">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
      >
        ← <span>Quay lại</span>
      </button>

      <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden mb-8">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-6 bg-gray-50 dark:bg-gray-900/50">
              <div className="sticky top-6">
                <img
                  src={image || "/placeholder-person.png"}
                  alt={name}
                  className="w-full rounded-xl shadow-lg mb-6"
                />
                
                <div className="space-y-4">
                  {role && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Vai trò</p>
                      <p className="font-semibold text-blue-700 dark:text-blue-300">{role}</p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {birth_date && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sinh</p>
                        <p className="font-medium">{formatDate(birth_date)}</p>
                      </div>
                    )}
                    {death_date && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Mất</p>
                        <p className="font-medium">{formatDate(death_date)}</p>
                      </div>
                    )}
                    {height && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Chiều cao</p>
                        <p className="font-medium">{height}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {name}
              </h1>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Tiểu sử</h2>
                {summary ? (
                  <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {summary}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">Không có tiểu sử.</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Phim nổi bật</h2>
                </div>

                {known_for.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                    Không tìm thấy phim liên quan.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {known_for.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => onSelectMovie?.(m.id)}
                        className="group text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
                      >
                        <div className="flex gap-4">
                          <img
                            src={m.image}
                            alt={m.title}
                            className="w-20 h-28 object-cover rounded-lg shadow"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {m.title}
                              </h3>
                              {m.year && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  ({m.year})
                                </span>
                              )}
                            </div>
                            
                            <div className="mt-2 space-y-1">
                              {m.role && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">{m.role}</p>
                              )}
                              {m.character && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                  Vai: {m.character}
                                </p>
                              )}
                              {m.rate !== undefined && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm font-bold">{m.rate.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            
                            {m.short_description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                                {m.short_description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
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