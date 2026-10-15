const USER_KEY = 'studygen_user';
const HISTORY_KEY = 'studygen_history';
const SYLLABUS_KEY = 'studygen_syllabus';

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
  catch { return null; }
}
export function setUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
export function clearUser() { localStorage.removeItem(USER_KEY); }

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}
export function addHistory(item) {
  const history = getHistory();
  history.unshift({ ...item, id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, createdAt: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
}
export function getSyllabus() {
  try { return JSON.parse(localStorage.getItem(SYLLABUS_KEY) || 'null'); }
  catch { return null; }
}
export function setSyllabus(syllabus) { localStorage.setItem(SYLLABUS_KEY, JSON.stringify(syllabus)); }