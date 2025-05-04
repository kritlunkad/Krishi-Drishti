import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SubmittedDataPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const [uploadedFile, setUploadedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState({ farmer: null, detections: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const styles = {
    container: {
      padding: "30px",
      maxWidth: "1000px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflowY: "auto",
      height: "100vh" // Set the container height to full viewport height
    },
    header: {
      color: "#2c3e50",
      marginBottom: "25px",
      borderBottom: "2px solid #27ae60",
      paddingBottom: "10px"
    },
    card: {
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    preformatted: {
      backgroundColor: "#ecf0f1",
      padding: "15px",
      borderRadius: "6px",
      overflowX: "auto",
      fontSize: "14px",
      lineHeight: "1.5",
      borderLeft: "4px solid #27ae60",
      maxHeight: "300px", // Limit the height
      overflowY: "auto" // Make it scrollable
    },
    inputGroup: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      marginBottom: "20px",
      flexWrap: "wrap" // Allow wrapping on smaller screens
    },
    fileInput: {
      padding: "8px",
      border: "1px solid #bdc3c7",
      borderRadius: "4px",
      backgroundColor: "white",
      flex: "1" // Allow it to grow
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#27ae60",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "background-color 0.2s"
    },
    resultCard: {
      backgroundColor: "#e8f5e9",
      padding: "15px",
      borderRadius: "8px",
      marginTop: "20px",
      position: "relative",
      border: "1px solid #c8e6c9"
    },
    copyButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      padding: "6px 12px",
      fontSize: "12px",
      backgroundColor: "#2ecc71",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    },
    saveButton: {
      position: "absolute",
      top: "45px",
      right: "10px",
      padding: "6px 12px",
      fontSize: "12px",
      backgroundColor: "#16a085",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    },
    error: {
      color: "#e74c3c",
      backgroundColor: "#fadbd8",
      padding: "10px",
      borderRadius: "4px",
      marginBottom: "20px",
      borderLeft: "4px solid #e74c3c"
    },
    list: {
      listStyleType: "none",
      padding: 0,
      maxHeight: "300px", // Limit the height
      overflowY: "auto" // Make it scrollable
    },
    listItem: {
      padding: "10px",
      marginBottom: "8px",
      backgroundColor: "#e8f5e9",
      borderRadius: "4px",
      borderLeft: "3px solid #27ae60"
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      marginTop: "25px",
      flexWrap: "wrap" // Allow wrapping on smaller screens
    },
    chatButton: {
      backgroundColor: "#3498db"
    },
    mapButton: {
      backgroundColor: "#1abc9c"
    },
    loadingIndicator: {
      textAlign: "center",
      padding: "10px",
      color: "#27ae60"
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching history for Aadhar:", data.query);
      const response = await fetch("http://localhost:8000/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhar: data.query || "", language: i18n.language }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      };
      
      const historyData = await response.json();
      console.log("History data received:", historyData);
      
      if (historyData && Array.isArray(historyData.detections)) {
        setHistory({
          
          detections: historyData.detections || []
        });
      } else {
        console.error("Invalid history data format:", historyData);
        setError(t('submitted.invalid_history_data'));
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      setError(t('submitted.error_fetch_history') + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!uploadedFile) {
      alert(t('submitted.no_file_selected'));
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("aadhar", data.query || "");
    formData.append("language", i18n.language);

    try {
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload result:", result);
      setResult(result);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(t('submitted.error_upload_failed') + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetection = async () => {
    if (!result || !result.disease || typeof result.confidence !== "number") {
      setError(t('submitted.error_invalid_result'));
      return;
    }

    const aadhar = result.aadhar || data.query;
    if (!aadhar) {
      setError(t('submitted.error_aadhar_missing'));
      return;
    }

    setLoading(true);
    setError(null);
    const payload = {
      aadhar,
      disease: result.disease,
      confidence: result.confidence
    };
    console.log("Saving detection:", payload);

    try {
      const response = await fetch("http://localhost:8000/api/save_detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save detection");
      }
      
      // Fetch updated history after saving
      await fetchHistory();
    } catch (error) {
      console.error("Error saving detection:", error);
      setError(t('submitted.error_save_failed') + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Initial data:", data);
    
    // Handle data from form submission
    if (data.query && data.fromForm) {
      setLoading(true);
      setError(null);
      fetch("http://localhost:8000/api/farmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadhar: data.query || null,
          name: data.name || null,
          location: data.Location || "",
          crops_grown: data["Crops Grown"] || null,
          soil_type: data["Soil Type"] || "",
          irrigation: data.IrrigationSystem || "",
          farm_size: data["Farm Type"] || null,
          previous_diseases: data.postContent || null,
          farming_method: data.OrganicFarming || "",
          extra_farm_type: data["Extra Farm Type"] || null,
          recent_weather: data.cweather || "",
          any_other_info: data.anyimp || null,
          crop_type: data["Crops Grown"] || "",
          symptoms: data.postContent || "",
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Farmer API error:", errorData);
            throw new Error(errorData.detail || "Failed to save farmer data");
          }
          return fetchHistory();
        })
        .catch((error) => {
          console.error("Error saving farmer data:", error);
          setError(t('submitted.error_save_farmer') + ": " + error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } 
    // Just fetch history if not from form
    else if (data.query) {
      fetchHistory();
    }
  }, [data, t, i18n.language]);

  const chatbot_reroute = () => {
    navigate("/chatbot", { state: data });
  };

  const map_reroute = () => {
    localStorage.setItem('mapData', JSON.stringify({ ...data, language: i18n.language }));
    navigate("/map", { state: data });
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(
        `${t('submitted.disease_label')}: ${result.disease}, ${t('submitted.confidence_label')}: ${(result.confidence * 100).toFixed(2)}%`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={styles.container}>
      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}
      
      {loading && (
        <div style={styles.loadingIndicator}>
          {t('submitted.loading')}...
        </div>
      )}
      

      <h2 style={styles.header}>{t('submitted.image_analysis_title')}</h2>
      <div style={styles.card}>
        <div style={styles.inputGroup}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={styles.fileInput}
          />
          <button 
            onClick={handleFileUpload} 
            disabled={loading || !uploadedFile}
            style={{
              ...styles.button,
              opacity: (loading || !uploadedFile) ? 0.6 : 1
            }}
          >
            {loading ? t('submitted.uploading') : t('submitted.upload_button')}
          </button>
        </div>
        
        {result && (
          <div style={styles.resultCard}>
            <h3>{t('submitted.latest_result_title')}</h3>
            <div>
              {t('submitted.disease_label')}: {result.disease}
              <br />
              {t('submitted.confidence_label')}: {(result.confidence * 100).toFixed(2)}%
              <button
                onClick={handleCopy}
                style={styles.copyButton}
              >
                {copied ? t('submitted.copied') : t('submitted.copy_button')}
              </button>
              <button
                onClick={handleSaveDetection}
                disabled={loading || !result || !result.disease || typeof result.confidence !== "number" || !data.query}
                style={{
                  ...styles.saveButton,
                  opacity: (loading || !result || !result.disease || typeof result.confidence !== "number" || !data.query) ? 0.6 : 1
                }}
              >
                {t('submitted.save_button')}
              </button>
            </div>
          </div>
        )}
      </div>

      <h2 style={styles.header}>{t('submitted.past_detections_title')}</h2>
      <div style={styles.card}>
        {history.detections && history.detections.length > 0 ? (
          <ul style={styles.list}>
            {history.detections.map((d, index) => (
              <li key={index} style={styles.listItem}>
                {t('submitted.disease_label')}: {d.disease}, {t('submitted.confidence_label')}: {(d.confidence * 100).toFixed(2)}%
                <br />
                <small>{new Date(d.timestamp || Date.now()).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t('submitted.no_detections')}</p>
        )}
      </div>

      <div style={styles.buttonGroup}>
        <button 
          onClick={chatbot_reroute} 
          style={{...styles.button, ...styles.chatButton}}
          disabled={loading}
        >
          {t('submitted.chat_button')}
        </button>
        <button 
          onClick={map_reroute} 
          style={{...styles.button, ...styles.mapButton}}
          disabled={loading}
        >
          {t('submitted.map_editor_button')}
        </button>
      </div>
    </div>
  );
}