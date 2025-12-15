import React from "react";


export default function SearchResults({ movies = [] }) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-3 gap-6">
        {movies.map((m) => (
          <div key={m.id} className="bg-transparent">
            <div className="rounded overflow-hidden shadow-sm bg-white dark:bg-gray-800">
              <div className="h-64 w-full bg-gray-200">
                <img
                  src={m.image || ""}
                  alt={m.title}
                  className="w-full h-full"
                />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {m.title} {m.year ? `(${m.year})` : ""}
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