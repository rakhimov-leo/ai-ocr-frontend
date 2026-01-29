# Deploy tayyorligi – AI-OCR & AI-OCR Frontend

## Umumiy xulosa

| Loyiha | Tayyorlik | Izoh |
|--------|-----------|------|
| **ai-ocr** (backend) | ~90% | Kod, CORS, Gunicorn, hujjatlar tayyor. Production `.env` va DB sozlash kerak. |
| **AI-OCR frontend** | ~85% | Statik, config orqali API. Production uchun `API_BASE_URL` va (ixtiyoriy) kalitlar sozlash kerak. |

---

## ai-ocr (backend)

### Tayyor

- FastAPI, OCR, auth, news, weather API’lar ishlaydi
- CORS `ALLOWED_ORIGINS` dan o‘qiladi (env)
- `.env` va `database.sqlite` `.gitignore` da
- `gunicorn_config.py`, `requirements.txt` (gunicorn, psycopg2-binary) bor
- `/api/health` health check
- `docs/DEPLOYMENT_CHECKLIST.md`, `docs/PRODUCTION_DEPLOYMENT.md` bor

### Deploydan oldin qilish kerak

1. **Production `.env`** (serverda, hech qachon repoga qo‘ymang):
   - `GEMINI_API_KEY` – production uchun yangi key
   - `ALLOWED_ORIGINS` – frontend domain(lar), masalan: `https://yourdomain.com`
   - `SECRET_KEY`, `ADMIN_TOKEN`, `USER_TOKEN` – kuchli, random
   - `ADMIN_PASSWORD`, `USER_PASSWORD` – default emas, kuchli parollar
   - `DATABASE_URL` – PostgreSQL (tavsiya) yoki SQLite

2. **Database**: PostgreSQL yoki SQLite; `init_db`, kerak bo‘lsa `seed.py`

3. **Port**: README 8020, gunicorn default 8000. `.env` da `PORT=8020` (yoki boshqa) qilib belgilang.

4. **`start_backend.sh`**: Ichida `/Users/alina/Desktop/AI-OCR` yo‘li bor – bu faqat local. Serverda ishlatmasangiz yoki `cd $(dirname "$0")` kabi nisbiy yo‘lga o‘zgartiring.

---

## AI-OCR frontend

### Tayyor

- Statik HTML/CSS/JS, build yo‘q
- API chaqiruvlari `CONFIG.API_BASE_URL` orqali
- `config.local.js` maxfiy kalitlar uchun, `.gitignore` da
- `config.local.js.example` bor, `config.js` da default `http://127.0.0.1:8020/api`

### Deploydan oldin qilish kerak

1. **Backend manzili**: Hozir `config.js` da `API_BASE_URL: 'http://127.0.0.1:8020/api'`.  
   Production’da buni o‘zgartirish kerak.

   **Variant A – `config.local.js` (tavsiya):**  
   Serverda (yoki deploy papkasida) `config.local.js` yarating, masalan:

   ```js
   (function() {
     if (typeof CONFIG === 'undefined') return;
     CONFIG.API_BASE_URL = 'https://api.yourdomain.com/api';
     CONFIG.GEMINI_API_KEY = '...';  // agar frontendda AI chat ishlatilsa
     CONFIG.GROQ_API_KEY = '...';    // ixtiyoriy
   })();
   ```

   `config.local.js` repoda yo‘q, har bir muhitda o‘zingiz yozasiz.

   **Variant B – `config.js` ni o‘zgartirish:**  
   Deploy paytida `config.js` ichidagi `API_BASE_URL` ni production backend manziliga almashtirish (masalan, env’dan generatsiya qilgan build script orqali).

2. **CORS**: Backend `ALLOWED_ORIGINS` da frontend domain’i bo‘lishi kerak (masalan `https://yourdomain.com`). Aks holda brauzer API so‘rovlarini bloklaydi.

3. **`config.local.js` 404**: `index.html` da `config.local.js` always yuklanadi. Agar fayl bo‘lmasa, 404 bo‘ladi. Odatda keyingi skriptlar ishlashda davom etadi, lekin xavfsizlik uchun `config.local.js` ni deploy qiladigan joyda yaratib qo‘yish yaxshiroq (yoki conditional load qilish).

---

## Xavfsizlik tekshiruvi

| Tekshiruv | ai-ocr | Frontend |
|-----------|--------|----------|
| API key / secret kodda yo‘q | ✅ .env | ✅ config.local (gitignore) |
| Parollar default emas (production) | ⚠️ .env’da o‘zgartirish kerak | – |
| CORS faqat kerakli domen(lar) | ⚠️ ALLOWED_ORIGINS sozlash kerak | – |
| HTTPS | ⚠️ Nginx/SSL sozlash kerak | ⚠️ Frontend ham HTTPS da bo‘lishi kerak |

---

## Qisqa deploy ketma-ketligi

1. **Backend (ai-ocr)**  
   - Serverda `git clone` / kodni yoyish  
   - `python -m venv venv`, `pip install -r requirements.txt`  
   - `.env` yaratish (production qiymatlar)  
   - DB yaratish, `init_db`  
   - Gunicorn (yoki uvicorn) + Nginx (reverse proxy, SSL)

2. **Frontend (AI-OCR frontend)**  
   - Statik fayllarni serverga yoyish (yoki CDN)  
   - `config.local.js` yaratish, ichida `CONFIG.API_BASE_URL = 'https://...'`  
   - Nginx (yoki boshqa) orqali frontend’ni xizmat qilish (HTTPS)

3. **CORS**: Backend `.env` da `ALLOWED_ORIGINS` = frontend URL(lar)i.

---

## Kichik takliflar

- **`server.log`**: Frontend papkada bor, `.gitignore` da yo‘q. Log fayllarni repoga kirmasligi uchun `.gitignore` ga `server.log` (yoki `*.log`) qo‘shish ma’qul.
- **Video `assets/ai-ocrhomepage.webm`**: ~3 MB. Repoda saqlash mumkin; keyinchalik CDN yoki lazy-load kerak bo‘lsa, optimallashtirish mumkin.
- **Backend `start_backend.sh`**: Serverda ishlatilsa, ichidagi absolute path’ni o‘zgartirish yoki nisbiy `cd` ga o‘tkazish.

---

**Xulosa:** Ikkala loyiha ham haqiqiy deployga juda yaqin. Asosiy ish – production `.env` (backend), `config.local.js` yoki `config.js` orqali `API_BASE_URL` (frontend) va CORS sozlash. Shundan keyin backend + frontend’ni serverda ishga tushirish mumkin.
