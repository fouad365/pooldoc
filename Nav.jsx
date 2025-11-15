import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Nav(){
  const navigate = useNavigate();
  function logout(){
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="logo">PoolPro</Link>
        <div className="links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/calculator">Calculator</Link>
          <Link to="/login">Login</Link>
          <button onClick={logout} className="link-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
}
