import { useState } from 'react';
import { CheckCircle2, FileCheck2, ShieldCheck, UploadCloud } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import Loading from '../components/Loading';
import { uploadSyllabus } from '../services/n8nApi';
import { addHistory, setSyllabus } from '../utils/storage';

export default function UploadSyllabus() {
  const [file, setFile] = useState(null); const [busy, setBusy] = useState(false);
  const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  async function submit(e) {
    e.preventDefault(); setError(''); setSuccess('');
    if (!file) { setError('Please choose a syllabus file before uploading.'); return; }
    setBusy(true);
    try {
      const result = await uploadSyllabus(file);
      const details = { fileName: file.name, fileType: file.name.split('.').pop().toUpperCase(), fileSize: file.size, status: 'Processed request accepted', uploadedAt: new Date().toISOString(), response: result };
      setSyllabus(details);
      addHistory({ type: 'Syllabus upload', title: file.name, status: 'success' });
      setSuccess('The upload request was accepted by n8n. Review its response below and confirm your workflow actually extracted and stored the syllabus.');
      setResultText(JSON.stringify(result, null, 2));
    } catch (err) { setError(err.message || 'Upload failed. Please try again.'); }
    finally { setBusy(false); }
  }
  const [resultText, setResultText] = useState('');
  return <><div className="page-heading"><div><span className="eyebrow">LEARNING SOURCE</span><h1>Upload syllabus</h1><p>Start with the syllabus you want StudyGen-AI to use as its learning source.</p></div></div>
    <div className="upload-layout"><section className="panel upload-panel"><div className="panel-heading"><div><h2>Choose your syllabus</h2><p>Supported documents: PDF, DOCX and TXT</p></div><div className="panel-icon"><UploadCloud size={21}/></div></div><form onSubmit={submit}><FileUpload file={file} onChange={f => { setFile(f); setError(''); setSuccess(''); setResultText(''); }} disabled={busy}/>{error && <div className="alert alert-error">{error}</div>}{success && <div className="alert alert-success"><CheckCircle2 size={18}/><span>{success}</span></div>}<button type="submit" className="button button-primary button-full" disabled={busy}>{busy ? <Loading label="Uploading and processing..."/> : <><UploadCloud size={18}/> Upload &amp; Process</>}</button></form><p className="fine-print">The file is sent to your configured n8n webhook using multipart/form-data. The frontend does not invent extracted text or AI results.</p></section>
      <aside className="upload-aside"><section className="info-card"><div className="info-icon"><ShieldCheck size={22}/></div><h3>Keep it syllabus-grounded</h3><p>Your n8n workflow should extract the uploaded file, save its content, and use that source when generating learning materials. Reject unrelated topics or requests without a processed syllabus.</p></section><section className="panel"><h3>What happens next?</h3><div className="steps-list"><div className="step-row"><span>1</span><div><strong>Upload</strong><p>Send your file to the webhook.</p></div></div><div className="step-row"><span>2</span><div><strong>Extract &amp; validate</strong><p>Configure n8n to read and verify the syllabus.</p></div></div><div className="step-row"><span>3</span><div><strong>Generate content</strong><p>Use the processed syllabus as the only learning source.</p></div></div></div></section></aside></div>
    {resultText && <section className="panel response-panel"><div className="panel-heading"><div><h3>n8n response</h3><p>Raw response returned by your workflow</p></div><FileCheck2 size={20}/></div><pre className="response-json">{resultText}</pre></section>}
  </>;
}