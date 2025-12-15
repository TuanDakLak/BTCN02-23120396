import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PersonDetail from "./Maincontent/PersonDetail";

export default function PersonRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <PersonDetail
      id={id}
      onBack={() => navigate(-1)}
      onSelectMovie={(mid) => navigate(`/movie/${mid}`)}
    />
  );
}
