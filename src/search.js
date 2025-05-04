import "./styles.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useTranslation } from "react-i18next";

const fields = [
  { label: "name", name: "name", type: "text" },
  { label: "Location", name: "Location", type: "text" },
  { label: "Crops Grown", name: "Crops Grown", type: "text" },
  { label: "Soil Type", name: "Soil Type", type: "text" },
  {
    label: "IrrigationSystem",
    name: "IrrigationSystem",
    type: "select",
    options: ["Drip", "Sprinkler", "Surface", "Manual"],
  },
  { label: "Farm Type", name: "Farm Type", type: "text" },
  { label: "postContent", name: "postContent", type: "textarea" },
  {
    label: "OrganicFarming",
    name: "OrganicFarming",
    type: "select",
    options: ["Fully Organic", "Partial Organic", "Not Organic"],
  },
  { label: "Extra Farm Type", name: "Extra Farm Type", type: "text" },
  { label: "cweather", name: "cweather", type: "text" },
  { label: "anyimp", name: "anyimp", type: "textarea" },
];

export default function VoiceEnabledForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { aadhar } = location.state || {};
  const [formData, setFormData] = useState({ query: aadhar || "" });
  const [currentStep, setCurrentStep] = useState(0);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [error, setError] = useState(null);

  const field = fields[currentStep];

  useEffect(() => {
    if (!aadhar) {
      setError(t('form.error_aadhar_missing'));
    }
  }, [aadhar, t]);

  useEffect(() => {
    if (listening && transcript) {
      setFormData((prev) => ({ ...prev, [field.name]: transcript }));
    }
  }, [transcript, listening, field.name]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [field.name]: e.target.value }));
  };

  const handleNext = () => {
    resetTranscript();
    if (currentStep < fields.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    navigate("/submitted", { state: { ...formData, fromForm: true } });
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div style={{
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      color: "#2e7d32",
      maxWidth: "600px",
      margin: "20px auto",
      textAlign: "center"
    }}>{t('form.speech_not_supported')}</div>;
  }

  return (
    <div style={{ 
      padding: "24px", 
      maxWidth: "800px", 
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: "100vh"
    }}>
      {error && (
        <div style={{ 
          color: "#d32f2f", 
          backgroundColor: "#fde8e8",
          padding: "12px",
          borderRadius: "4px",
          marginBottom: "20px",
          borderLeft: "4px solid #d32f2f"
        }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        padding: "24px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "24px"
      }}>
        <h2 style={{ 
          color: "#2e7d32",
          marginTop: "0",
          marginBottom: "24px",
          fontSize: "1.75rem",
          fontWeight: "600"
        }}>
          {t('form.title')}
        </h2>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#2e7d32",
              fontWeight: "500"
            }}>
              {t(`form.fields.${field.label}`)}
            </label>
            
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #81c784",
                  backgroundColor: "white",
                  fontSize: "16px"
                }}
              >
                <option value="">{t('form.select_placeholder')}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt.toLowerCase()}>
                    {t(`form.options.${field.label}.${opt}`)}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                rows={4}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #81c784",
                  fontSize: "16px",
                  resize: "vertical"
                }}
              />
            ) : (
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #81c784",
                  fontSize: "16px"
                }}
              />
            )}
          </div>

          <div style={{ 
            display: "flex", 
            gap: "12px",
            flexWrap: "wrap"
          }}>
            <button
              type="button"
              onClick={() => SpeechRecognition.startListening({ continuous: false })}
              disabled={listening}
              style={{
                padding: "10px 16px",
                backgroundColor: listening ? "#a5d6a7" : "#388e3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background-color 0.3s",
                flex: "1",
                minWidth: "120px"
              }}
            >
              {t('form.speak_button')}
            </button>
            <button
              type="button"
              onClick={SpeechRecognition.stopListening}
              disabled={!listening}
              style={{
                padding: "10px 16px",
                backgroundColor: !listening ? "#a5d6a7" : "#d32f2f",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background-color 0.3s",
                flex: "1",
                minWidth: "120px"
              }}
            >
              {t('form.stop_button')}
            </button>
            {currentStep < fields.length - 1 ? (
              <button 
                type="button" 
                onClick={handleNext}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#689f38",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background-color 0.3s",
                  flex: "1",
                  minWidth: "120px"
                }}
              >
                {t('form.next_button')}
              </button>
            ) : (
              <button 
                type="submit"
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#2e7d32",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background-color 0.3s",
                  flex: "1",
                  minWidth: "120px"
                }}
              >
                {t('form.submit_button')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: "#e8f5e9",
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center",
        color: "#2e7d32",
        fontWeight: "500"
      }}>
        <p style={{ margin: "0" }}>
          {t('form.current_step')}: {currentStep + 1} / {fields.length} - {t(`form.fields.${field.label}`)}
        </p>
      </div>
    </div>
  );
}