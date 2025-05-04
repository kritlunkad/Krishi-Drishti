import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Search from "./search";
import SubmittedDataPage from "./navigate";
import ChatTing from "./chatbot";
import Login from "./login";
import Map from "./Map";
import Layout from "./layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/form" element={<Search />} />
          <Route path="/submitted" element={<SubmittedDataPage />} />
          <Route path="/chatbot" element={<ChatTing />} />
          <Route path="/map" element={<Map />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;