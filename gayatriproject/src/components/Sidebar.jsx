import { NavLink } from 'react-router-dom';
import { BookOpen, Brain, ChartNoAxesCombined, ClipboardList, Clock3, FileQuestion, FileText, GraduationCap, LayoutDashboard, ListChecks, Presentation, Settings, Upload, Users, X } from 'lucide-react';
import { getUser } from '../utils/storage';

const studentLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload syllabus', icon: Upload },
  { to: '/notes', label: 'AI Notes', icon: FileText },
  { to: '/ppt', label: 'PPT generator', icon: Presentation },
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/revision-questions', label: 'Revision questions', icon: FileQuestion },
  { to: '/question-paper', label: 'Question paper', icon: ClipboardList },
  { to: '/revision-plan', label: 'Revision plan', icon: ListChecks },
  { to: '/progress', label: 'My progress', icon: ChartNoAxesCombined },
  { to: '/history', label: 'History', icon: Clock3 },
  { to: '/settings', label: 'Settings', icon: Settings }
];
const teacherLinks = [
  { to: '/teacher', label: 'Overview', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload syllabus', icon: Upload },
  { to: '/notes', label: 'AI Notes', icon: FileText },
  { to: '/ppt', label: 'PPT generator', icon: Presentation },
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/question-paper', label: 'Question papers', icon: ClipboardList },
  { to: '/progress', label: 'Progress', icon: ChartNoAxesCombined },
  { to: '/history', label: 'Content history', icon: Clock3 },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ open, onClose }) {
  const user = getUser();
  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;
  return <>
    {open && <button className="sidebar-scrim" aria-label="Close menu" onClick={onClose}/>}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand-row"><div className="brand-mark"><GraduationCap size={22}/></div><div><b>StudyGen-AI</b><small>LEARN SMARTER</small></div><button className="icon-button close-sidebar" onClick={onClose} aria-label="Close menu"><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><BookOpen size={18}/></div><strong>Learn with purpose</strong><p>Use your uploaded syllabus to keep study content relevant.</p></div><small className="version-label">STUDYGEN-AI · FRONTEND</small></div>
    </aside>
  </>;
}