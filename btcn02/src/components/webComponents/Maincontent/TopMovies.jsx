import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Card, CardContent } from "../../ui/card";
import { useState, useEffect } from "react";
import { apiGet } from "@/api/movieAPI";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "../../ui/button";

export default function TopMovies({ content, types}) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [api, setApi] = useState(null);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await apiGet(`/api/movies/${types}`, {
          page: 1,
          limit: 30,
        });
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto p-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300">
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
      <div className="w-full max-w-sm mx-auto p-4">
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                Lỗi khi tải dữ liệu
              </p>
              <p className="text-sm text-red-500 dark:text-red-300">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-3 ">
      <h2 className="text-2xl font-semibold text-left ml-2 mb-5">{content}</h2>
      <div className="w-full">
        <Carousel className="relative w-6xl mx-auto" setApi={setApi}>
          <CarouselContent>
            {movies.map((movie) => (
              <CarouselItem
                key={movie.id}
                className="basis-1/3 overflow-hidden"
              >
                <div className="relative w-full h-[250px] overflow-hidden rounded-sm">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full"
                  />

                  <div className="absolute bottom-16 left-0 w-full text-center px-2">
                    <h3 className="text-yellow-300 font-bold text-lg drop-shadow">
                      {movie.title} ({movie.year})
                    </h3>
                  </div>

                  {movie.genres && (
                    <div className="absolute bottom-10 left-0 w-full text-center">
                      <span className="text-yellow-300 text-sm drop-shadow">
                        [ {movie.genres.join(", ")} ]
                      </span>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <button
            onClick={() => api?.scrollTo(api.selectedScrollSnap() + 3)}
            className="font-bold absolute -right-6 top-1/2 -translate-y-1/2 z-10"
          >
            <ChevronRight />
          </button>

          <button
            onClick={() => api?.scrollTo(api.selectedScrollSnap() - 3)}
            className="font-bold absolute -left-6 top-1/2 -translate-y-1/2 z-10"
          >
            <ChevronLeft />
          </button>
        </Carousel>
      </div>
    </div>
  );
}
