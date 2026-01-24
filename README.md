# AI-OCR Frontend

Vanilla JavaScript frontend - npm kerak emas!

## Qanday ishlatish:

1. **Backend'ni ishga tushiring:**
   ```bash
   cd /Users/alina/Desktop/AI-OCR
   source venv/bin/activate
   uvicorn main:app --reload --port 8000
   ```

2. **Frontend'ni oching:**
   - `index.html` faylini brauzerda oching
   - Yoki simple HTTP server ishlatish:
     ```bash
     cd ~/Desktop/"AI-OCR frontend"
     python3 -m http.server 3000
     ```
   - Keyin: http://localhost:3000

## Login:

- **Admin:** username: `admin`, password: `admin123`
- **User:** username: `user`, password: `user123`

## Features:

- ✅ Authentication (login/logout)
- ✅ Dashboard (statistika)
- ✅ Documents ro'yxati
- ✅ Document detail (admin uchun raw data)
- ✅ Document upload
- ✅ Admin panel
- ✅ Role-based access control

## Stack:

- **Vanilla JavaScript** - npm kerak emas!
- **HTML5**
- **CSS3**
- **Fetch API** - backend bilan aloqa

## API Endpoints:

- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `GET /api/ocr/documents` - Documents ro'yxati
- `GET /api/ocr/documents/{id}` - Document detail
- `POST /api/ocr/upload` - Document yuklash
