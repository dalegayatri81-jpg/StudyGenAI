import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import UploadSyllabus from './pages/UploadSyllabus';
import Notes from './pages/Notes';
import PPT from './pages/PPT';
import Quiz from './pages/Quiz';
import RevisionQuestions from './pages/RevisionQuestions';
import QuestionPaper from './pages/QuestionPaper';
import RevisionPlan from './pages/RevisionPlan';
import Progress from './pages/Progress';
import History from './pages/History';
import Settings from './pages/Settings';
import { getUser } from './utils/storage';

function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="app-shell"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)}/><div className="main-column"><Navbar onMenu={() => setMenuOpen(true)}/><main className="page-main">{children}</main><footer className="app-footer">StudyGen-AI <span>·</span> Turn your syllabus into a complete learning plan.</footer></div></div>;
}
function Guarded({ role, children }) {
  return <ProtectedRoute role={role}><AppLayout>{children}</AppLayout></ProtectedRoute>;
}
function HomeRedirect() {
  const user = getUser();
  return <Navigate to={user ? (user.role === 'teacher' ? '/teacher' : '/dashboard') : '/login'} replace/>;
}
export default function App() {
  const location = useLocation();
  const isAuth = ['/login', '/register'].includes(location.pathname);
  return <div className={isAuth ? 'auth-root' : ''}><Routes>
    <Route path="/" element={<HomeRedirect/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/dashboard" element={<Guarded role="student"><StudentDashboard/></Guarded>}/>
    <Route path="/teacher" element={<Guarded role="teacher"><TeacherDashboard/></Guarded>}/>
    <Route path="/upload" element={<Guarded><UploadSyllabus/></Guarded>}/>
    <Route path="/notes" element={<Guarded><Notes/></Guarded>}/>
    <Route path="/ppt" element={<Guarded><PPT/></Guarded>}/>
    <Route path="/quiz" element={<Guarded><Quiz/></Guarded>}/>
    <Route path="/revision-questions" element={<Guarded><RevisionQuestions/></Guarded>}/>
    <Route path="/question-paper" element={<Guarded><QuestionPaper/></Guarded>}/>
    <Route path="/revision-plan" element={<Guarded><RevisionPlan/></Guarded>}/>
    <Route path="/progress" element={<Guarded><Progress/></Guarded>}/>
    <Route path="/history" element={<Guarded><History/></Guarded>}/>
    <Route path="/settings" element={<Guarded><Settings/></Guarded>}/>
    <Route path="*" element={<HomeRedirect/>}/>
  </Routes></div>;
}