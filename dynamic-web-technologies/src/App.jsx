import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import CreateReport from './pages/CreateReport';
import Reports from './pages/Reports';
import ReportDetails from './pages/ReportDetails';
import EditReport from './pages/EditReport';
import Navbar from "../src/componets/Navbar";


export default function App() {
  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/reports/new" element={<CreateReport />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/reports/:id/edit" element={<EditReport />} />
      </Routes>
    </BrowserRouter>
  );
}
