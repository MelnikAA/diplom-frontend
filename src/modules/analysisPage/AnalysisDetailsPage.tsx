import React from "react";
import { useParams } from "react-router-dom";

const AnalysisDetailsPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Детали анализа для ID: {id}</h1>
      <p>Здесь будет отображаться детальная информация об анализе с ID {id}.</p>
    </div>
  );
};

export default AnalysisDetailsPage;
