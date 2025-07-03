import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user = { name: 'Mike William', profileImageUrl: '/default-avatar.png' }, onLogout }) => {
  const location = useLocation();
  // Construct the correct avatar URL
  let avatarUrl = '/default-avatar.png';
  if (user.profileImageUrl) {
    if (user.profileImageUrl.startsWith('http') || user.profileImageUrl.startsWith('/')) {
      avatarUrl = user.profileImageUrl;
    } else {
      avatarUrl = `http://localhost:3000/uploads/${user.profileImageUrl}`;
    }
  }
  return (
    <aside className="sidebar">
      <div className="profile">
        <h3>{user.fullName || user.name}</h3>
      </div>
      <nav>
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
        <Link to="/income" className={location.pathname === '/income' ? 'active' : ''}>Income</Link>
        <Link to="/expense" className={location.pathname === '/expense' ? 'active' : ''}>Expense</Link>
        <button onClick={onLogout} style={{ marginTop: '2rem', background: 'none', border: 'none', color: '#7b2cbf', cursor: 'pointer' }}>Logout</button>
      </nav>
    </aside>
  );
};

export default Sidebar;