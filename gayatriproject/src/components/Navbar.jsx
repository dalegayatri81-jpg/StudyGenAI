import { Bell, LogOut, Menu, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearUser, getUser } from '../utils/storage';

export default function Navbar({ onMenu }) {
  const navigate = useNavigate();
  const user = getUser();
  function logout() { clearUser(); navigate('/login'); }
  return <header className="topbar">
    <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={20}/></button>
    <div className="topbar-search">Turn your syllabus into a complete learning plan.</div>
    <div className="topbar-actions">
      <span className="role-pill">{user?.role || 'Guest'}</span>
      <button className="icon-button" aria-label="Notifications"><Bell size={18}/></button>
      <div className="avatar"><UserRound size={17}/></div>
      <div className="user-mini"><strong>{user?.name || 'Learner'}</strong><small>{user?.email || ''}</small></div>
      <button className="icon-button" onClick={logout} title="Sign out" aria-label="Sign out"><LogOut size={18}/></button>
    </div>
  </header>;
}