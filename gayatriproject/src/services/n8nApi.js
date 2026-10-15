const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

function getWebhookUrl() {
  if (!N8N_WEBHOOK_URL?.trim()) {
    throw new Error('VITE_N8N_WEBHOOK_URL is not configured. Copy .env.example to .env and add your n8n webhook URL.');
  }
  try {
    const url = new URL(N8N_WEBHOOK_URL);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    return url.toString();
  } catch {
    throw new Error('The n8n webhook URL is invalid. Check VITE_N8N_WEBHOOK_URL in your root .env file.');
  }
}

async function postJson(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(getWebhookUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const raw = await response.text();
    if (!response.ok) throw new Error(`n8n returned HTTP ${response.status}${raw ? `: ${raw.slice(0, 240)}` : ''}`);
    if (!raw.trim()) throw new Error('n8n returned an empty response. Check the Respond to Webhook node.');
    try { return JSON.parse(raw); } catch { return { text: raw }; }
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The request timed out. Check that n8n is running and try again.');
    if (error instanceof TypeError) throw new Error('Could not reach n8n. Check the webhook URL, that n8n is running, and webhook CORS settings.');
    throw error;
  } finally { clearTimeout(timeout); }
}

export function testN8nConnection() {
  return postJson({ action: 'connection_test', message: 'Hello n8n from StudyGen-AI' });
}
export function uploadSyllabus(file) {
  if (!(file instanceof File)) return Promise.reject(new Error('Please choose a syllabus file first.'));
  const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const extAllowed = /\.(pdf|docx|txt)$/i.test(file.name);
  if (!extAllowed || (file.type && !allowed.includes(file.type) && file.type !== 'application/octet-stream')) {
    return Promise.reject(new Error('Unsupported file. Please upload a PDF, DOCX, or TXT file.'));
  }
  const form = new FormData();
  form.append('action', 'upload_syllabus');
  form.append('file', file, file.name);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  return (async () => {
    try {
      const response = await fetch(getWebhookUrl(), { method: 'POST', body: form, signal: controller.signal });
      const raw = await response.text();
      if (!response.ok) throw new Error(`n8n returned HTTP ${response.status}${raw ? `: ${raw.slice(0, 240)}` : ''}`);
      if (!raw.trim()) throw new Error('n8n returned an empty response. Check the Respond to Webhook node.');
      try { return JSON.parse(raw); } catch { return { text: raw }; }
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Upload timed out. Check n8n and try again.');
      if (error instanceof TypeError) throw new Error('Could not reach n8n. Check the URL, n8n status, and CORS settings.');
      throw error;
    } finally { clearTimeout(timeout); }
  })();
}
export function generateNotes(data) { return postJson({ action: 'generate_notes', ...data }); }
export function generatePPT(data) { return postJson({ action: 'generate_ppt', ...data }); }
export function generateQuiz(data) { return postJson({ action: 'generate_quiz', ...data }); }
export function generateRevisionQuestions(data) { return postJson({ action: 'generate_revision_questions', ...data }); }
export function generateQuestionPaper(data) { return postJson({ action: 'generate_question_paper', ...data }); }
export function generateRevisionPlan(data) { return postJson({ action: 'generate_revision_plan', ...data }); }
export function getProgress(data = {}) { return postJson({ action: 'get_progress', ...data }); }
export function saveToDrive(data) { return postJson({ action: 'save_to_drive', ...data }); }