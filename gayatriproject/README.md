# StudyGen-AI

**StudyGen-AI: AI-Powered Syllabus-to-Learning Content Generation and Student Progress Management Platform**

A beginner-friendly React + Vite frontend designed to call an n8n HTTP webhook. The frontend does not fabricate AI-generated notes, quizzes, PPTs, or student statistics: generation pages display the response returned by your workflow.

## Features

- Student and teacher demo registration/login using browser `localStorage`
- Responsive EdTech dashboard with sidebar navigation
- PDF, DOCX and TXT syllabus upload using `multipart/form-data`
- Centralized n8n API client and connection test
- Notes, PPT, quiz, revision questions, question paper and revision plan request forms
- Dynamic quiz rendering when n8n returns a recognized questions array
- Progress endpoint integration with honest empty states
- Browser-local generation history
- Google Drive save actions sent to n8n (Drive itself must be configured in n8n)
- Friendly errors, loading indicators, request timeouts and validation

## Important limitations

1. **Authentication is only a local demo.** It is not secure and is not shared across devices. Do not use real/reused passwords or sensitive data. Replace it with backend/database authentication before production.
2. **n8n workflows must implement each action.** The frontend sends real HTTP requests but cannot create AI content by itself.
3. **Syllabus grounding must be enforced in n8n.** The frontend sends the selected topic and uploaded filename metadata. Your workflow must extract the uploaded document, store/identify its contents, and reject topics not supported by that syllabus. Do not treat a filename alone as the syllabus text.
4. **Google Drive is not connected by default.** Save buttons send `action: "save_to_drive"`; configure Google Drive credentials and nodes in n8n.
5. A successful upload HTTP response means n8n responded. Verify that your workflow actually extracts and stores the syllabus before generating content from it.
6. The workflow needs to respond with JSON (or plain text) and permit browser requests from your frontend origin. If n8n is hosted on another origin, configure CORS appropriately. Do not expose private API keys in Vite environment variables.

## 1. Install Node.js

Install a current Node.js LTS release from the official Node.js website: https://nodejs.org/ . The installer includes npm.

After installation, close and reopen PowerShell, then verify:

```powershell
node --version
npm --version
```

Both commands should print version numbers. If PowerShell says a command is not recognized, reopen the terminal or check that Node.js was installed and added to PATH.

## 2. Open the project folder

Extract the `StudyGen-AI.zip` file to a location you can find, for example:

```text
C:\Users\YOUR_NAME\Desktop\StudyGen-AI
```

Open VS Code, select **File → Open Folder**, and choose the `StudyGen-AI` folder. The root folder must contain `package.json`, `.env.example`, `index.html`, and `src`.

## 3. Open PowerShell in VS Code

Select **Terminal → New Terminal**. Confirm you are in the project root:

```powershell
Get-Location
Get-ChildItem
```

If you need to move to the folder, use your actual path, for example:

```powershell
cd "$HOME\Desktop\StudyGen-AI"
```

## 4. Install frontend dependencies

Run this in the project root:

```powershell
npm install
```

Wait for it to finish. If you see a network error, check your internet connection and run `npm install` again. Do not run this command inside `src`.

## 5. Create the `.env` file

The provided file is `.env.example`. Copy it to `.env` in the **root project folder**.

```powershell
Copy-Item .env.example .env
```

Correct:

```text
StudyGen-AI\.env
StudyGen-AI\package.json
StudyGen-AI\src\
```

Incorrect:

```text
StudyGen-AI\src\.env
```

Open the root `.env` and set the webhook URL:

```env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/studygen
```

The URL above is the usual production webhook path. During testing, n8n may show a **test URL** such as `/webhook-test/studygen`; use the exact URL shown by the Webhook node while listening for a test event. Switch to the production URL when your workflow is active.

The `.env` file is ignored by Git. Vite exposes variables prefixed with `VITE_` to browser code, so never put passwords, private API keys, or n8n credentials in this file.

## 6. Start the frontend

```powershell
npm run dev
```

Vite prints a local address, normally:

```text
http://localhost:5173/
```

Open that address in your browser. Keep the terminal running while you use the app. To stop the server, press `Ctrl+C`.

**Whenever you edit `.env`, stop Vite with `Ctrl+C` and run `npm run dev` again.**

## 7. Start n8n

Use an n8n installation you control. Official documentation: https://docs.n8n.io/ . You can run n8n locally or use an appropriately configured hosted instance. If running locally, its editor is commonly available at `http://localhost:5678`.

For a local setup, follow the current official n8n installation instructions for your operating system. If you use a hosted n8n instance, the webhook URL will be that instance's URL, not `localhost`.

## 8. Create the first n8n webhook workflow

Build the simplest connection test first:

```text
Webhook  →  Respond to Webhook
```

### Webhook node

1. Create a new workflow in n8n.
2. Add a **Webhook** node.
3. Set **HTTP Method** to `POST`.
4. Set **Path** to `studygen`.
5. For the response configuration, choose **Using Respond to Webhook Node** (wording may vary by n8n version).
6. Save the workflow.
7. For the first test, click **Listen for Test Event** / **Test workflow** and copy the exact test URL shown by n8n.

### Respond to Webhook node

1. Connect Webhook to **Respond to Webhook**.
2. Set response code to `200`.
3. Return JSON, for example:

```json
{
  "ok": true,
  "message": "StudyGen-AI webhook connected",
  "receivedAction": "connection_test"
}
```

Configure the response body using the expression/editor supported by your n8n version if you want `receivedAction` to echo the incoming action. A fixed JSON response is sufficient for the initial connectivity test.

4. Execute the workflow using its test listener, then click **Test n8n Connection** in StudyGen-AI → Settings.
5. After testing, save and activate/publish the workflow as required by your n8n version.
6. Copy the **Production URL** from the Webhook node, normally ending in `/webhook/studygen`, and update the root `.env`.

A test URL normally contains `/webhook-test/`; the production URL normally contains `/webhook/`. Use the URL that matches whether the workflow is listening for a test event or activated for production.

### Request flow

```text
StudyGen-AI frontend
       |
       | POST JSON or multipart/form-data
       v
n8n Webhook (POST /studygen)
       |
       v
Respond to Webhook (HTTP 200 + JSON)
       |
       v
Frontend shows returned response
```

## 9. Webhook contract used by the frontend

All requests go through `src/services/n8nApi.js`.

| Feature | `action` value | Main fields |
|---|---|---|
| Test connection | `connection_test` | `message` |
| Upload syllabus | `upload_syllabus` | multipart fields `action`, `file` |
| Notes | `generate_notes` | `topic`, syllabus filename metadata |
| PPT | `generate_ppt` | `topic`, `slides`, `level`, syllabus filename metadata |
| Quiz | `generate_quiz` | `topic`, `questionType`, `count`, `difficulty`, syllabus filename metadata |
| Revision questions | `generate_revision_questions` | `topic`, `category`, `count` |
| Question paper | `generate_question_paper` | `topic`, `totalMarks`, `difficulty`, `numberOfQuestions` |
| Revision plan | `generate_revision_plan` | `topic`, `examDate`, `availableStudyHours` |
| Progress | `get_progress` | `userId`, `role` |
| Google Drive save | `save_to_drive` | `contentType`, `title`, content/result |

Every action also includes `action` in a JSON request, except the file upload uses multipart form data. The browser automatically creates the multipart boundary; do not manually set the `Content-Type` header for file uploads.

The frontend currently includes the uploaded filename as metadata in later generation requests. Your workflow must associate that request with the stored, processed syllabus for the current user/session. For a robust production app, return a syllabus ID from upload and send that ID with each generation request; store and verify the ID in a backend/database. Do not rely on a client-supplied filename as proof of syllabus contents.

## 10. Upload syllabus test

1. Ensure the Webhook workflow is listening or active and `.env` contains the matching URL.
2. Restart Vite if `.env` changed.
3. Open StudyGen-AI and register a demo student or teacher.
4. Open **Upload syllabus**.
5. Choose a small PDF, DOCX or TXT file.
6. Click **Upload & Process**.
7. Inspect the execution in n8n and confirm the binary file arrives in the Webhook node.

The simple Webhook → Respond workflow may receive the file but does not extract its text. Add extraction and validation nodes before expecting syllabus-grounded AI generation.

## 11. Future workflow for syllabus-grounded generation

```text
Upload Syllabus
      ↓
Webhook receives binary file
      ↓
Validate file type and size
      ↓
Extract PDF / DOCX / TXT text
      ↓
Validate readable, non-empty syllabus
      ↓
Store extracted text and return syllabusId
      ↓
For each generation action, retrieve that syllabusId
      ↓
Check requested topic exists in syllabus
      ↓
AI model with instructions to use only syllabus context
      ↓
Validate output and reject unrelated content
      ↓
Optional Google Drive node (credentials configured in n8n)
      ↓
Respond to Webhook with structured JSON
```

Do not pass untrusted uploaded text directly into privileged tools. Keep credentials inside n8n, restrict allowed file sizes/types, validate inputs, and require authentication/authorization in a production backend.

## 12. Suggested response shapes

### Notes response

```json
{
  "ok": true,
  "content": "Notes generated from the validated syllabus content."
}
```

### Quiz response

```json
{
  "ok": true,
  "questions": [
    {
      "id": "q1",
      "question": "Question text returned by your AI workflow?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "explanation": "Explanation grounded in the uploaded syllabus."
    }
  ]
}
```

The quiz page accepts `questions`, `quiz`, or `items` arrays. For predictable scoring, set `correctAnswer` to exactly match one option string. You may also use an option key if your options are objects.

### Revision plan response

```json
{
  "ok": true,
  "plan": [
    {
      "day": "Day 1",
      "topic": "Topic from syllabus",
      "task": "Read and review the relevant section",
      "duration": "2 hours",
      "status": "Planned"
    }
  ]
}
```

### PPT response

```json
{
  "ok": true,
  "downloadUrl": "https://your-own-file-host.example/presentation.pptx"
}
```

Use a real URL returned by your workflow; the example domain is illustrative and not an actual service.

### Drive save response

```json
{
  "ok": true,
  "message": "File saved",
  "url": "https://drive.google.com/..."
}
```

Only return a Drive URL after the workflow really saved the file and its permissions are correct.

## 13. Troubleshooting

### `npm` or `node` is not recognized

Install Node.js LTS, close all terminals, reopen VS Code, and check `node --version` and `npm --version`.

### `npm install` fails

Confirm the terminal is at the project root (the folder with `package.json`), then retry. If a proxy/firewall blocks npm, resolve that network issue first.

### Port 5173 is busy

Vite usually offers another port in the terminal. Open the exact address it prints.

### `VITE_N8N_WEBHOOK_URL is not configured`

Confirm `.env` is at `StudyGen-AI\.env`, not inside `src`. Copy `.env.example` if necessary, add the URL, and restart Vite.

### n8n connection fails / `Failed to fetch`

- Confirm n8n is running and the URL opens from your browser/computer.
- Use the test URL only while n8n is listening for a test event.
- Use the production URL only after the workflow is active.
- Confirm the path is `studygen` and method is `POST`.
- Ensure the Respond to Webhook node is connected and configured.
- If frontend and n8n have different origins, configure n8n/web server CORS to allow the frontend origin, such as `http://localhost:5173`.
- Avoid mixed-content blocking: an HTTPS frontend generally cannot call an HTTP webhook.
- Check the n8n execution log for the actual server-side error.

### HTTP 404

Usually the URL path is wrong or the workflow is not active/listening for that URL type. Copy the URL directly from the Webhook node.

### HTTP 500 or empty response

Inspect the n8n execution and ensure all branches end with a Respond to Webhook node (or use a valid response mode). Return a non-empty JSON body.

### Upload succeeds but content generation says no syllabus

The starter webhook does not extract or persist file content. Add file extraction, syllabus storage, and a returned `syllabusId`. Update the generation workflow to look up that ID. A local browser record of a filename is not the actual syllabus text.

### Google Drive save does nothing / fails

The frontend sends an `action: "save_to_drive"` request. Add a matching route in n8n, configure Google Drive credentials and nodes there, and return the real result. No Drive connection is included by default.

### Login does not work

Register an account in the same browser and select the same role when signing in. Clearing browser site data removes these demo accounts. This is not production authentication.

### Quiz questions appear as raw JSON

Make the n8n response use a `questions` array with `question`, `options`, and `correctAnswer` fields. The frontend intentionally shows the raw response if the expected shape is not present.

## Project structure

```text
StudyGen-AI/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Loading.jsx
│   │   └── FileUpload.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── UploadSyllabus.jsx
│   │   ├── Notes.jsx
│   │   ├── PPT.jsx
│   │   ├── Quiz.jsx
│   │   ├── RevisionQuestions.jsx
│   │   ├── QuestionPaper.jsx
│   │   ├── RevisionPlan.jsx
│   │   ├── Progress.jsx
│   │   ├── History.jsx
│   │   └── Settings.jsx
│   ├── services/n8nApi.js
│   ├── utils/storage.js
│   ├── App.jsx
│   └── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Build check

```powershell
npm run build
```

The production bundle is generated in `dist/`. The frontend is structured for n8n integration, but AI generation, document extraction, persistent student data, secure authentication, and Google Drive access only work after the corresponding backend/n8n workflows are configured.
