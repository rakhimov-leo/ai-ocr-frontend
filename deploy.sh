#!/bin/bash
# AI-OCR Frontend — PRODUCTION deploy
# Serverda ishlatish: ./deploy.sh

set -e

echo "🔄 Lokal o'zgarishlarni bekor qilish..."
git reset --hard

echo "📌 master branch ga o'tish..."
git checkout master

echo "⬇️  Oxirgi kodni olish..."
git pull origin master

echo "🐳 Docker (nginx) ni ishga tushirish..."
docker compose up -d

echo "✅ Deploy tugadi. Frontend: http://localhost:3020 (yoki serveringizdagi domen)"
