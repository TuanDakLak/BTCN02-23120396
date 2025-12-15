import React from "react";

export default function SearchResults({ movies = [], onSelect }) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-3 gap-6">
        {movies.map((m) => (
          <div key={m.id} className="bg-transparent">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(m.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect?.(m.id);
              }}
              className="rounded overflow-hidden shadow-md 
                hover:shadow-xl hover:scale-125 transform transition duration-300
                cursor-pointer bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Xem chi tiết ${m.title}`}
            >
              <div className="h-64 w-full bg-gray-200">
                <img
                  src={m.image || ""}
                  alt={m.title}
                  className="w-full h-full"
                />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {m.title} {m.year ? `(${m.year})` : ""}{" "}
                  {m.rate !== undefined ? <span>⭐ {m.rate}</span> : null}
                </h3>
                {m.genres && m.genres.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    [{m.genres.slice(0, 2).join(", ")}]
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}