import { Link } from 'react-router-dom';
import { BookOpen, Brain, ChartNoAxesCombined, ClipboardList, Clock3, FileQuestion, FileText, ListChecks, Presentation, Upload, ArrowUpRight, Sparkles } from 'lucide-react';
import { getUser, getSyllabus, getHistory } from '../utils/storage';

const actions = [
  { to: '/upload', title: 'Upload syllabus', desc: 'Start with your course outline.', icon: Upload, tone: 'blue' },
  { to: '/notes', title: 'Generate notes', desc: 'Create syllabus-based study notes.', icon: FileText, tone: 'violet' },
  { to: '/ppt', title: 'Generate PPT', desc: 'Prepare a presentation from your topic.', icon: Presentation, tone: 'orange' },
  { to: '/quiz', title: 'Practice quiz', desc: 'Test your understanding.', icon: Brain, tone: 'green' },
  { to: '/revision-questions', title: 'Revision questions', desc: 'Prepare for exams and viva.', icon: FileQuestion, tone: 'pink' },
  { to: '/question-paper', title: 'Question paper', desc: 'Generate a practice paper.', icon: ClipboardList, tone: 'blue' },
  { to: '/revision-plan', title: 'Revision plan', desc: 'Plan your remaining study time.', icon: ListChecks, tone: 'orange' },
  { to: '/progress', title: 'My progress', desc: 'Review available learning records.', icon: ChartNoAxesCombined, tone: 'green' }
];
export default function StudentDashboard() {
  const user = getUser(); const syllabus = getSyllabus(); const history = getHistory();
  return <><div className="page-heading"><div><span className="eyebrow">STUDENT WORKSPACE</span><h1>Welcome back, {user?.name?.split(' ')[0] || 'Learner'} <span className="wave">👋</span></h1><p>Small steps today can make exam day easier.</p></div><Link to="/upload" className="button button-primary"><Upload size={17}/> Upload syllabus</Link></div>
    <section className="welcome-banner"><div className="welcome-banner-copy"><span className="banner-kicker"><Sparkles size={15}/> STUDYGEN-AI</span><h2>Turn your syllabus into a complete learning plan.</h2><p>Upload your course outline, then request notes, quizzes, presentations and revision material based on that content.</p><Link to="/upload" className="button button-light">Get started <ArrowUpRight size={16}/></Link></div><div className="banner-art"><div className="art-sheet"><BookOpen size={36}/><span>MY LEARNING</span><div className="art-line"/><div className="art-line short"/><div className="art-line"/></div><div className="art-badge"><Sparkles size={18}/></div></div></section>
    <div className="section-heading"><div><h2>Your learning tools</h2><p>Choose what you want to work on next.</p></div></div>
    <div className="action-grid">{actions.map(a => <Link to={a.to} className="action-card" key={a.to}><div className={`action-icon ${a.tone}`}><a.icon size={21}/></div><div className="action-card-text"><h3>{a.title}</h3><p>{a.desc}</p></div><ArrowUpRight className="card-arrow" size={17}/></Link>)}</div>
    <div className="bottom-grid"><section className="panel"><div className="panel-heading"><div><h3>Current syllabus</h3><p>Your selected learning source</p></div><Link to="/upload" className="text-link">Manage</Link></div>{syllabus ? <div className="syllabus-summary"><div className="file-icon"><FileText size={22}/></div><div><strong>{syllabus.fileName}</strong><span>{syllabus.status || 'Uploaded'} · {syllabus.fileType || 'Syllabus file'}</span></div></div> : <div className="empty-state compact"><div className="empty-icon"><BookOpen size={23}/></div><strong>No syllabus uploaded yet</strong><p>Upload your syllabus so your learning workflow has a clear source.</p><Link to="/upload" className="text-link">Upload a syllabus →</Link></div>}</section><section className="panel"><div className="panel-heading"><div><h3>Recent activity</h3><p>Items saved in this browser</p></div><Link to="/history" className="text-link">View history</Link></div>{history.length ? <div className="activity-list">{history.slice(0, 3).map(item => <div className="activity-item" key={item.id}><div className="activity-icon"><Clock3 size={17}/></div><div><strong>{item.title || item.type}</strong><span>{new Date(item.createdAt).toLocaleString()}</span></div></div>)}</div> : <div className="empty-state compact"><div className="empty-icon"><Clock3 size={23}/></div><strong>No activity yet</strong><p>Successful generation requests will appear here.</p></div>}</section></div>
  </>;
}