import React from "react";
import MostRevenue from "./MostRevenue";
import TopMovies from "./TopMovies";


export default function Main() {
  return (
    <div>
      <MostRevenue />
      <TopMovies content="Most Popular" types="most-popular" />
      <TopMovies content="Top Rating" types="top-rated" />
    </div>
  );
}