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
      <div className="app-shell">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reports/new" element={<CreateReport />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
            <Route path="/reports/:id/edit" element={<EditReport />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <span>REPORTHUB</span>
          <span>Private workspace · reports stay on this device</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}
