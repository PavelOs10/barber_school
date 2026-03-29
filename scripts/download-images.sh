#!/bin/bash
# ─────────────────────────────────────────────────────────
# download-images.sh
# Скачивает все Unsplash-картинки локально и заменяет URL
# Запускать из корня проекта: bash scripts/download-images.sh
# ─────────────────────────────────────────────────────────

set -e

IMG_DIR="frontend/public/images"
SRC_DIR="frontend/src"

echo "📸 Скачиваю Unsplash-изображения локально..."

mkdir -p "$IMG_DIR"

# Находим все Unsplash URL в исходниках
URLS=$(grep -roh "https://images\.unsplash\.com/photo-[^'\"?]*" "$SRC_DIR" | sort -u)

i=1
declare -A URL_MAP

for URL_BASE in $URLS; do
  # Берём ID из URL
  PHOTO_ID=$(echo "$URL_BASE" | grep -oP 'photo-\K[a-zA-Z0-9_-]+')
  FILENAME="img-${PHOTO_ID}.jpg"
  FILEPATH="$IMG_DIR/$FILENAME"

  if [ -f "$FILEPATH" ]; then
    echo "  ✅ $FILENAME уже скачан"
  else
    # Скачиваем в хорошем качестве
    FULL_URL="${URL_BASE}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
    echo "  ⬇️  Скачиваю $FILENAME ..."
    curl -sL "$FULL_URL" -o "$FILEPATH" || {
      echo "  ⚠️  Ошибка при скачивании $FILENAME"
      continue
    }
  fi

  URL_MAP["$URL_BASE"]="/images/$FILENAME"
  i=$((i+1))
done

echo ""
echo "🔄 Заменяю URL в исходниках..."

# Заменяем все URL в .tsx, .ts, .css файлах
for URL_BASE in "${!URL_MAP[@]}"; do
  LOCAL="${URL_MAP[$URL_BASE]}"
  # Экранируем для sed
  ESCAPED_URL=$(echo "$URL_BASE" | sed 's/[&/\]/\\&/g')

  # Заменяем полные URL (с параметрами) на локальный путь
  find "$SRC_DIR" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec \
    sed -i "s|${ESCAPED_URL}[^'\"]*|${LOCAL}|g" {} +

  echo "  ✅ ${URL_BASE} → ${LOCAL}"
done

echo ""
echo "✅ Готово! Скачано изображений: $((i-1))"
echo ""
echo "📋 Не забудь:"
echo "   1. Пересобрать фронтенд: cd frontend && npm run build"
echo "   2. Скопировать public/images в dist/images"
echo "   3. Или добавить в vite.config.ts publicDir для автокопирования"
