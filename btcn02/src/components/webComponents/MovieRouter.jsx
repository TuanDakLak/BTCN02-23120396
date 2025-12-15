import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieDetail from "./Maincontent/MovieDetail";

export default function MovieRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <MovieDetail
      id={id}
      onBack={() => navigate(-1)}
      onSelectPerson={(pid) => navigate(`/person/${pid}`)}
    />
  );
}