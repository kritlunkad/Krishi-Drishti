import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MapEditor() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const goToDiseaseDetection = () => {
    navigate("/submitted", { state: { ...data, query: data.query || "" } });
  };

  const goToChatbot = () => {
    navigate("/chatbot", { state: { ...data, query: data.query || "" } });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('map.title')}</h2>
      <div className="bg-gray-100 p-4 rounded-md border border-gray-200 text-sm text-gray-700 mb-6">
        <p>{t('map.placeholder_content')}</p>
        {/* Placeholder for map functionality, e.g., a canvas or map library */}
      </div>
      <div className="flex gap-3">
        <button
          onClick={goToDiseaseDetection}
          className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t('map.back_to_disease_detection')}
        </button>
        <button
          onClick={goToChatbot}
          className="px-4 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          {t('map.back_to_chatbot')}
        </button>
      </div>
    </div>
  );
}