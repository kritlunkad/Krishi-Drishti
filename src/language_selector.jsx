import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={styles.container}>
      <label htmlFor="language-select" style={styles.label}>
        {t('language_selector.label')}
      </label>
      <select
        id="language-select"
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        style={styles.select}
      >
        <option value="en">{t('language_selector.english')}</option>
        <option value="hi">{t('language_selector.hindi')}</option>
      </select>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 10px",
  },
  label: {
    color: "#2E7D32",
    fontWeight: "500",
    fontSize: "14px",
    marginRight: "10px",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #2E7D32",
    backgroundColor: "#fff",
    color: "#2E7D32",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.3s ease",
  },
};