import { FileText, UploadCloud, X } from 'lucide-react';

export default function FileUpload({ file, onChange, disabled }) {
  function choose(event) { onChange(event.target.files?.[0] || null); event.target.value = ''; }
  return <div className="upload-dropzone">
    {file ? <div className="selected-file"><div className="file-icon"><FileText size={23}/></div><div className="file-details"><strong>{file.name}</strong><span>{file.name.split('.').pop().toUpperCase()} · {(file.size / 1024 / 1024).toFixed(2)} MB</span></div><button type="button" className="icon-button danger-icon" disabled={disabled} onClick={() => onChange(null)} aria-label="Remove file"><X size={18}/></button></div>
      : <><div className="upload-icon"><UploadCloud size={28}/></div><strong>Choose Syllabus File</strong><p>Drop your syllabus here or browse your device</p><label className={`button button-secondary file-picker ${disabled ? 'disabled' : ''}`}>Browse files<input type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={choose} disabled={disabled}/></label><small>PDF, DOCX or TXT · Max recommended size 10 MB</small></>}
  </div>;
}