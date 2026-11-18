import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" to="/" aria-label="ReportHub home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span className="brand-copy">
            <strong>ReportHub</strong>
            <span>Glasgow operations</span>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>Overview</NavLink>
          <NavLink to="/reports">Reports</NavLink>
        </nav>

        <NavLink className="button button-primary header-action" to="/reports/new">
          <span aria-hidden="true">+</span>
          New report
        </NavLink>
      </div>
    </header>
  );
}

