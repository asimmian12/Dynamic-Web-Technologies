import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      
      <br />
      
      <NavLink to="/reports/new">Create Report</NavLink>
      
      <br />
      
      <NavLink to="/reports">Reports</NavLink>
      
      <br />

    </nav>
  );
}

