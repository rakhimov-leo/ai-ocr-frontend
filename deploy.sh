#!/bin/bash
# AI-OCR Frontend — PRODUCTION deploy
# Serverda ishlatish: ./deploy.sh
# Master branch ishlatiladi. Port: .env da FRONTEND_PORT (default 3030).

set -e

echo "🔄 Lokal o'zgarishlarni bekor qilish..."
git reset --hard

echo "📌 master branch ga o'tish..."
git checkout master

echo "⬇️  Oxirgi kodni olish..."
git pull origin master

echo "🐳 Docker (nginx) ni ishga tushirish..."
docker compose up -d

# Port .env dan yoki default 3030
PORT="${FRONTEND_PORT:-3030}"
echo "✅ Deploy tugadi."
echo "   Frontend: http://$(hostname -f 2>/dev/null || echo 'localhost'):${PORT}"
echo "   Yoki domen orqali: https://ai-ocr.site (agar nginx reverse proxy sozlangan bo'lsa)."
echo "   API: config.local.js da API_BASE_URL ni server backend manziliga qiling."
