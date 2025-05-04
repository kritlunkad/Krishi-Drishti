import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Map() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.navigateTo) {
        navigate(event.data.navigateTo);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  return (
    <iframe
      src="http://127.0.0.1:8100/map"
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Map Editor"
    />
  );
}