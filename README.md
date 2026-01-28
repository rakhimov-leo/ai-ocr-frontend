# AI-OCR Frontend

Vanilla JavaScript frontend

1. **Backend**

   ```bash
   cd /Users/alina/Desktop/AI-OCR
   source venv/bin/activate
   uvicorn main:app --reload --port 8020
   ```

2. **Frontend**
   - `index.html`
   - **Lokal serverdan oching** (AI Chat uchun ham shart; `file://` da API bloklanadi):
     ```bash
     cd ~/Desktop/"AI-OCR frontend"
     python3 -m http.server 3020
     ```
   - http://localhost:3020
   - **AI Chat (Gemini):** `config.local.js.example` dan `config.local.js` yarating va kalitlarni kiriting. `config.local.js` GitHub'ga chiqmaydi (.gitignore).

## Stack:

- **Vanilla JavaScript**
- **HTML5**
- **CSS3**
- **Fetch API** - connection via backend

## API Endpoints:

- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `GET /api/ocr/documents` - Documents
- `GET /api/ocr/documents/{id}` - Document detail
- `POST /api/ocr/upload` - Document
