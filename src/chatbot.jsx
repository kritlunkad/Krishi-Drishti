import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function ChatTing() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const chatContainerRef = useRef(null);

  const languageMap = {
    en: "en",
    hi: "hi"
  };

  const recognitionLang = languageMap[i18n.language] || "en-US";

  const startListening = () => {
    SpeechRecognition.startListening({ language: recognitionLang, continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setQuery((prev) => prev + (prev ? " " : "") + transcript);
    resetTranscript();
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const lastMessage = chatContainerRef.current.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (data.query) {
      fetchChatHistory();
    }
  }, [data.query]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, response]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhar: data.query || "", language: i18n.language }),
      });
      if (response.ok) {
        const historyData = await response.json();
        setChatHistory(historyData.chats || []);
      } else {
        setError(t('chatbot.error_fetch_history'));
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setError(t('chatbot.error_fetch_history'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: {
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
          },
          question: query,
          language: i18n.language,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setResponse(result);
        setQuery("");
        await fetchChatHistory();
      } else {
        setError(t('chatbot.error_chat_failed'));
      }
    } catch (error) {
      console.error("Error in chatbot request:", error);
      setError(t('chatbot.error_chat_request'));
    }
    setLoading(false);
  };

  const goToDiseaseDetection = () => {
    navigate("/submitted", { state: data });
  };

  if (!browserSupportsSpeechRecognition) {
    return <div style={styles.errorContainer}>{t('chatbot.speech_not_supported')}</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.chatContainer}>
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        <h2 style={styles.title}>{t('chatbot.title')}</h2>
        
        <form onSubmit={handleSubmit} style={styles.inputForm}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('chatbot.placeholder')}
            style={styles.textInput}
          />
          <button 
            type="submit" 
            disabled={loading} 
            style={loading ? styles.submitButtonDisabled : styles.submitButton}
          >
            {loading ? t('chatbot.sending') : t('chatbot.send_button')}
          </button>
          {listening ? (
            <button
              type="button"
              onClick={stopListening}
              style={styles.stopButton}
            >
              {t('chatbot.stop_button')}
            </button>
          ) : (
            <button
              type="button"
              onClick={startListening}
              style={styles.voiceButton}
            >
              {t('chatbot.speak_button')}
            </button>
          )}
        </form>

        {response && (
          <div style={styles.latestResponse}>
            <h3 style={styles.subtitle}>{t('chatbot.latest_response_title')}</h3>
            <div style={styles.responseCard}>
              <p style={styles.responseText}><strong style={styles.label}>{t('chatbot.question_label')}:</strong> {response.question}</p>
              <p style={styles.responseText}><strong style={styles.label}>{t('chatbot.answer_label')}:</strong> {response.answer}</p>
            </div>
          </div>
        )}

        <div style={styles.chatHistorySection}>
          <h2 style={styles.subtitle}>{t('chatbot.past_chats_title')}</h2>
          {chatHistory.length > 0 ? (
            <ul 
              ref={chatContainerRef} 
              style={styles.chatList}
            >
              {chatHistory.map((chat, index) => (
                <li
                  key={index}
                  style={styles.chatItem}
                >
                  <p style={styles.responseText}><strong style={styles.label}>{t('chatbot.question_label')}:</strong> {chat.question}</p>
                  <p style={styles.responseText}><strong style={styles.label}>{t('chatbot.answer_label')}:</strong> {chat.answer}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.noChats}>{t('chatbot.no_chats')}</p>
          )}
        </div>

        <button
          onClick={goToDiseaseDetection}
          style={styles.backButton}
        >
          {t('chatbot.back_button')}
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f0f7f0",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    maxWidth: "800px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    padding: "30px",
  },
  errorContainer: {
    color: "#d32f2f",
    padding: "16px",
    backgroundColor: "#fdecea",
    borderRadius: "4px",
    textAlign: "center",
    margin: "20px",
  },
  errorMessage: {
    backgroundColor: "#fdecea",
    borderLeft: "4px solid #d32f2f",
    color: "#d32f2f",
    padding: "16px",
    borderRadius: "4px",
    marginBottom: "24px",
  },
  title: {
    color: "#2E7D32",
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "24px",
    textAlign: "center",
  },
  subtitle: {
    color: "#2E7D32",
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  inputForm: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid #a5d6a7",
    borderRadius: "8px",
    outline: "none",
    transition: "border 0.3s",
  },
  textInputFocus: {
    border: "2px solid #2E7D32",
    boxShadow: "0 0 0 2px rgba(46, 125, 50, 0.2)",
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#2E7D32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  submitButtonDisabled: {
    padding: "12px 20px",
    backgroundColor: "#81c784",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "not-allowed",
    fontWeight: "600",
    fontSize: "16px",
    opacity: 0.7,
  },
  voiceButton: {
    padding: "12px 20px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  stopButton: {
    padding: "12px 20px",
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  latestResponse: {
    marginBottom: "24px",
    backgroundColor: "#e8f5e9",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #c8e6c9",
  },
  responseCard: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #e8f5e9",
  },
  chatHistorySection: {
    marginBottom: "24px",
  },
  chatList: {
    maxHeight: "400px",
    overflowY: "auto",
    paddingRight: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  chatItem: {
    backgroundColor: "#e8f5e9",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #c8e6c9",
  },
  label: {
    color: "#2E7D32",
  },
  responseText: {
    marginBottom: "8px",
    lineHeight: "1.5",
  },
  noChats: {
    color: "#757575",
    fontStyle: "italic",
    textAlign: "center",
  },
  backButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#2E7D32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
};