import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { getUser, setUser } from '../utils/storage';

export default function Login() {
  const navigate = useNavigate(); const location = useLocation();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  function submit(e) {
    e.preventDefault(); setError('');
    const users = JSON.parse(localStorage.getItem('studygen_users') || '[]');
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password && u.role === role);
    if (!found) { setError('We could not find a matching account. Register first or check your email, password, and role.'); return; }
    setUser({ userId: found.userId, name: found.name, email: found.email, role: found.role });
    navigate(location.state?.from || (role === 'teacher' ? '/teacher' : '/dashboard'), { replace: true });
  }
  return <div className="auth-layout"><section className="auth-showcase"><Link to="/login" className="auth-brand"><span className="brand-mark"><GraduationCap size={23}/></span>StudyGen-AI</Link><div className="showcase-content"><div className="eyebrow"><Sparkles size={15}/> YOUR PERSONAL LEARNING WORKSPACE</div><h1>Your syllabus.<br/><span>Your learning journey.</span></h1><p>Turn your syllabus into a complete learning plan.</p><div className="showcase-points"><div><BookOpen size={19}/><span>Learning content grounded in your syllabus</span></div><div><ShieldCheck size={19}/><span>Separate student and teacher workspaces</span></div></div></div><div className="showcase-footer">Study with clarity. Prepare with confidence.</div></section><section className="auth-form-side"><form className="auth-card" onSubmit={submit}><div className="mobile-auth-brand"><GraduationCap/> StudyGen-AI</div><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p className="muted">Continue where your learning left off.</p><div className="role-toggle"><button type="button" className={role === 'student' ? 'selected' : ''} onClick={() => setRole('student')}>Student</button><button type="button" className={role === 'teacher' ? 'selected' : ''} onClick={() => setRole('teacher')}>Teacher</button></div>{error && <div className="alert alert-error">{error}</div>}<label className="field-label">Email address<input type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/></label><label className="field-label">Password<input type="password" required autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}/></label><button className="button button-primary button-full" type="submit">Sign in</button><p className="auth-switch">New to StudyGen-AI? <Link to="/register">Create an account</Link></p><p className="security-note">Demo authentication uses this browser's localStorage. Do not use a real or reused password.</p></form></section></div>;
}