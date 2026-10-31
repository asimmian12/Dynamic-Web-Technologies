import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import TravelLogs from "./pages/TravelLogs";

export default function App() {
  return (
      <BrowserRouter>
        <div className="app-shell">
          <nav className="main-nav" aria-label="Main navigation">
            <Link to="/">Dashboard</Link>
            <Link to="/logs">Travel Logs</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/logs" element={<TravelLogs />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}
