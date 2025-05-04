import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const endpoint = isRegistering ? "/api/register" : "/api/login";
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhar, password, language: i18n.language }),
      });

      const data = await response.json();
      if (response.ok) {
        if (isRegistering) {
          alert(t('register.success_register'));
          navigate("/form", { state: { aadhar } });
        } else {
          const historyResponse = await fetch("http://localhost:8000/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ aadhar, language: i18n.language }),
          });
          const historyData = await historyResponse.json();
          if (historyData.farmer) {
            navigate("/submitted", { state: { query: aadhar, ...historyData.farmer } });
          } else {
            navigate("/search", { state: { aadhar } });
          }
        }
      } else {
        setError(data.detail || t('login.error_generic'));
      }
    } catch (err) {
      console.error(err);
      setError(t('login.error_server'));
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>KRISHTHI DRISHTI</h1>
      </div>
      <div style={styles.container}>
        <h2 style={styles.formTitle}>{isRegistering ? t('register.title') : t('login.title')}</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('login.aadhar_label')}</label>
            <input
              type="text"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              minLength={12}
              maxLength={12}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('login.password_label')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            {isRegistering ? t('register.register_button') : t('login.login_button')}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          style={styles.toggleButton}
        >
          {isRegistering ? t('register.login_link') : t('login.register_link')}
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    backgroundColor: "#2E7D32",
    padding: "20px 0",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    color: "#fff",
    fontSize: "32px",
    fontWeight: "bold",
    margin: 0,
    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
  },
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "100%",
  },
  formTitle: {
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    color: "#555",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    transition: "border 0.3s",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    transition: "border 0.3s",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#2E7D32",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
    marginTop: "10px",
  },
  toggleButton: {
    marginTop: "15px",
    background: "none",
    border: "none",
    color: "#2E7D32",
    cursor: "pointer",
    textAlign: "center",
    width: "100%",
    fontSize: "14px",
    textDecoration: "underline",
  },
  error: {
    color: "#d32f2f",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#fdecea",
    borderRadius: "4px",
    textAlign: "center",
    fontSize: "14px",
  },
};