import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles } from 'lucide-react';
import { setUser } from '../utils/storage';

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  function submit(e) {
    e.preventDefault(); setError('');
    if (password.length < 6) { setError('Use at least 6 characters for this demo password.'); return; }
    const users = JSON.parse(localStorage.getItem('studygen_users') || '[]');
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.role === role)) { setError('An account with this email and role already exists. Try signing in.'); return; }
    const user = { userId: `local-${Date.now()}`, name: name.trim(), email: email.trim(), password, role };
    users.push(user); localStorage.setItem('studygen_users', JSON.stringify(users));
    setUser({ userId: user.userId, name: user.name, email: user.email, role: user.role });
    navigate(role === 'teacher' ? '/teacher' : '/dashboard', { replace: true });
  }
  return <div className="auth-layout"><section className="auth-showcase"><Link to="/login" className="auth-brand"><span className="brand-mark"><GraduationCap size={23}/></span>StudyGen-AI</Link><div className="showcase-content"><div className="eyebrow"><Sparkles size={15}/> BUILT AROUND YOUR SYLLABUS</div><h1>Make every<br/><span>study session count.</span></h1><p>One workspace for syllabus-based learning content and progress.</p><div className="showcase-points"><div><GraduationCap size={19}/><span>Choose a student or teacher workspace</span></div><div><Sparkles size={19}/><span>Connect content generation through n8n webhooks</span></div></div></div><div className="showcase-footer">Start small. Learn consistently.</div></section><section className="auth-form-side"><form className="auth-card" onSubmit={submit}><div className="mobile-auth-brand"><GraduationCap/> StudyGen-AI</div><span className="eyebrow">GET STARTED</span><h2>Create your account</h2><p className="muted">Set up your local demo workspace.</p><div className="role-toggle"><button type="button" className={role === 'student' ? 'selected' : ''} onClick={() => setRole('student')}>Student</button><button type="button" className={role === 'teacher' ? 'selected' : ''} onClick={() => setRole('teacher')}>Teacher</button></div>{error && <div className="alert alert-error">{error}</div>}<label className="field-label">Full name<input required autoComplete="name" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)}/></label><label className="field-label">Email address<input type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/></label><label className="field-label">Password<input type="password" required minLength="6" autoComplete="new-password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)}/></label><button className="button button-primary button-full" type="submit">Create account</button><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p><p className="security-note">Demo only: credentials are stored in localStorage, not a secure database.</p></form></section></div>;
}