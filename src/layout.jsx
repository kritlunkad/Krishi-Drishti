import React from 'react';
import { Outlet } from 'react-router-dom';
import LanguageSelector from '/Users/kritlunkad/Downloads/finetunellama3.2/frontend/src/language_selector.jsx';

export default function Layout() {
  return (
    <div>
      <LanguageSelector />
      <Outlet />
    </div>
  );
}

