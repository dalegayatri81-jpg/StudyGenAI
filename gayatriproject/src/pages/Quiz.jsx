import { useState } from 'react';
import { Brain, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import Loading from '../components/Loading';
import { generateQuiz } from '../services/n8nApi';
import { addHistory, getSyllabus } from '../utils/storage';

function extractQuestions(data) {
  if (Array.isArray(data)) return data;
  for (const key of ['questions', 'quiz', 'items']) if (Array.isArray(data?.[key])) return data[key];
  if (data?.data && Array.isArray(data.data.questions)) return data.data.questions;
  return [];
}
export default function Quiz() {
  const syllabus = getSyllabus(); const [topic, setTopic] = useState(''); const [count, setCount] = useState('5'); const [difficulty, setDifficulty] = useState('medium'); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [data, setData] = useState(null); const [answers, setAnswers] = useState({}); const [submitted, setSubmitted] = useState(false);
  async function submit(e) { e.preventDefault(); setError(''); setData(null); setAnswers({}); setSubmitted(false); if (!syllabus) return setError('Upload and process a syllabus first.'); if (!topic.trim()) return setError('Enter a topic from your syllabus.'); setBusy(true); try { const r = await generateQuiz({ topic: topic.trim(), questionType: 'mcq', count: Number(count), difficulty, syllabusFileName: syllabus.fileName }); setData(r); addHistory({ type: 'Quiz', title: `Quiz: ${topic}`, status: 'success', content: r }); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  const questions = extractQuestions(data);
  function answerKey(q) { return q.correctAnswer ?? q.answer ?? q.correct_option ?? q.correctOption; }
  function optionList(q) { const opts = q.options || q.choices || q.answers; if (Array.isArray(opts)) return opts; if (opts && typeof opts === 'object') return Object.entries(opts).map(([key, value]) => ({ key, text: value })); return []; }
  function submitQuiz() { setSubmitted(true); }
const score = questions.filter((q, i) => {
  const key = answerKey(q);
  const opts = optionList(q);
  const selected = answers[i];

  if (key === undefined || selected === undefined) {
    return false;
  }

  const correctIndex = opts.findIndex((opt) => {
    const value =
      typeof opt === 'object'
        ? (opt.key ?? opt.id ?? opt.text ?? opt.label ?? opt.value)
        : opt;

    return String(value) === String(key);
  });

  const correctOption = opts[correctIndex];

  const correctValue =
    correctOption && typeof correctOption === 'object'
      ? (correctOption.key ??
        correctOption.id ??
        correctOption.text ??
        correctOption.label ??
        correctOption.value)
      : correctOption;

  return (
    String(selected) === String(key) ||
    String(selected) === String(correctValue) ||
    String(selected) === String(correctIndex)
  );
}).length;
  return <><div className="page-heading"><div><span className="eyebrow">ACTIVE RECALL</span><h1>Practice quiz</h1><p>Generate MCQs from the syllabus you uploaded.</p></div></div><section className="panel"><form onSubmit={submit} className="generator-form"><label className="field-label">Topic<input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter a syllabus topic" required/></label><div className="form-row"><label className="field-label">Questions<select value={count} onChange={e => setCount(e.target.value)}><option value="5">5 questions</option><option value="10">10 questions</option><option value="20">20 questions</option></select></label><label className="field-label">Difficulty<select value={difficulty} onChange={e => setDifficulty(e.target.value)}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></label></div><div className="source-chip"><Sparkles size={16}/>{syllabus ? `Source: ${syllabus.fileName}` : 'No syllabus uploaded'}</div>{error && <div className="alert alert-error">{error}</div>}<button className="button button-primary" disabled={busy}>{busy ? <Loading label="Generating quiz..."/> : <><Brain size={17}/> Generate Quiz</>}</button></form></section>
    {data && <section className="panel quiz-results"><div className="panel-heading"><div><h2>Generated quiz</h2><p>{questions.length ? `${questions.length} questions received from n8n` : 'Response received, but the expected questions array was not found.'}</p></div>{questions.length > 0 && <button className="button button-secondary button-small" onClick={() => { setData(null); setAnswers({}); setSubmitted(false); }}><RotateCcw size={15}/> New quiz</button>}</div>{!questions.length ? <pre className="generated-content">{JSON.stringify(data, null, 2)}</pre> : <form onSubmit={e => { e.preventDefault(); submitQuiz(); }}><div className="quiz-list">{questions.map((q, i) => <article className="question-card" key={q.id || i}><div className="question-number">QUESTION {i + 1}</div><h3>{q.question || q.text || q.prompt || `Question ${i + 1}`}</h3><div className="option-list">{optionList(q).map((opt, j) => { const text = typeof opt === 'object' ? (opt.text ?? opt.label ?? opt.value ?? opt.option ?? JSON.stringify(opt)) : opt; const val = typeof opt === 'object' ? (opt.key ?? opt.id ?? j) : opt; const key = answerKey(q); const isCorrect = submitted && key !== undefined && (String(val) === String(key) || String(text) === String(key) || String(j) === String(key)); const isWrong = submitted && String(answers[i]) === String(val) && !isCorrect; return <label key={j} className={`quiz-option ${answers[i] === String(val) ? 'chosen' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}><input type="radio" name={`q-${i}`} value={String(val)} checked={answers[i] === String(val)} disabled={submitted} onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}/><span>{String.fromCharCode(65 + j)}.</span>{String(text)}</label>; })}</div>{submitted && (answerKey(q) !== undefined ? <p className="answer-note"><CheckCircle2 size={15}/> Correct answer: {String(answerKey(q))}{q.explanation ? ` — ${q.explanation}` : ''}</p> : <p className="fine-print">Answer key was not provided for this question.</p>)}</article>)}</div>{submitted ? <div className="score-banner"><div><span>Your score</span><strong>{score} / {questions.length}</strong></div><button type="button" className="button button-primary" onClick={() => { setAnswers({}); setSubmitted(false); }}>Retry Quiz</button></div> : <button type="submit" className="button button-primary">Submit Quiz</button>}</form>}</section>}</>;
}