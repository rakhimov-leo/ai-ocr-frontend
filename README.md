# AI-OCR Frontend

Professional OCR tizim frontend qismi.

## 🚀 Ishga tushirish

### Usul 1: Brauzerda to'g'ridan-to'g'ri ochish (Eng oson)

1. Desktop'da "AI-OCR frontend" papkasini oching
2. `index.html` faylini brauzerda oching (ikki marta bosib yoki o'ng tugma → "Open with" → Brauzer)

**Yoki terminalda:**
```bash
cd ~/Desktop/AI-OCR\ frontend
open index.html
```

### Usul 2: Python HTTP Server (Tavsiya etiladi)

CORS muammolarini oldini olish uchun oddiy HTTP server ishga tushiring:

```bash
cd ~/Desktop/AI-OCR\ frontend
python3 -m http.server 3000
```

Keyin brauzerda oching:
```
http://localhost:3000
```

### Usul 3: Node.js http-server

Agar Node.js o'rnatilgan bo'lsa:

```bash
cd ~/Desktop/AI-OCR\ frontend
npx http-server -p 3000
```

Keyin brauzerda oching:
```
http://localhost:3000
```

## ⚙️ Sozlamalar

Frontend backend'ga quyidagi manzil orqali ulanadi:
- **Backend URL:** `http://127.0.0.1:8000/api`

Agar backend boshqa portda ishlayotgan bo'lsa, `app.js` faylida `API_BASE_URL` ni o'zgartiring:

```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';  // O'zgartiring
```

## 📋 Talablar

1. **Backend ishga tushirilgan bo'lishi kerak:**
   ```bash
   cd ~/Desktop/AI-OCR
   source venv/bin/activate
   uvicorn main:app --reload
   ```

2. **Brauzer** (Chrome, Firefox, Safari, Edge)

## 🎯 Xususiyatlar

- ✅ Drag & Drop rasm yuklash
- ✅ Professional jadval renderer
- ✅ Strikethrough (chizilgan qiymatlar)
- ✅ Qizil rang highlight
- ✅ Low confidence warning (sariq rang)
- ✅ Edit funksiyasi (qatorlarni tahrirlash)
- ✅ Responsive dizayn

## 🐛 Muammolar

### CORS xatosi

Agar CORS xatosi chiqsa, backend'da CORS sozlamalarini tekshiring yoki Python HTTP server ishlatishingiz kerak.

### Backend ulanmayapti

1. Backend ishga tushirilganligini tekshiring: `http://127.0.0.1:8000/docs`
2. `app.js` faylida `API_BASE_URL` ni tekshiring
3. Firewall sozlamalarini tekshiring
