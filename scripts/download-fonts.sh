#!/bin/bash
# ─────────────────────────────────────────────────────────
# download-fonts.sh
# Скачивает Google Fonts (Bebas Neue, Inter) локально
# Запускать из корня проекта: bash scripts/download-fonts.sh
# ─────────────────────────────────────────────────────────

set -e

FONT_DIR="frontend/public/fonts"
CSS_FILE="frontend/src/styles/fonts.css"

echo "🔤 Скачиваю шрифты локально..."

mkdir -p "$FONT_DIR"

# Bebas Neue (Regular)
echo "  ⬇️  Bebas Neue..."
curl -sL "https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5rygbi49c.woff2" \
  -o "$FONT_DIR/bebas-neue-regular.woff2" || echo "  ⚠️ Ошибка скачивания Bebas Neue"

# Inter (400, 500, 600, 700, 900)
WEIGHTS="400 500 600 700 900"
for W in $WEIGHTS; do
  echo "  ⬇️  Inter $W..."
  curl -sL "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2" \
    -o "$FONT_DIR/inter-${W}.woff2" || echo "  ⚠️ Ошибка скачивания Inter $W"
done

echo ""
echo "🔄 Обновляю fonts.css..."

cat > "$CSS_FILE" << 'CSSEOF'
/* Локальные шрифты (вместо Google Fonts) */

@font-face {
  font-family: 'Bebas Neue';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/bebas-neue-regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-400.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/inter-500.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/inter-600.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/inter-700.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url('/fonts/inter-900.woff2') format('woff2');
}
CSSEOF

echo "✅ Готово! Шрифты скачаны в $FONT_DIR"
echo ""
echo "📋 Не забудь:"
echo "   1. Пересобрать фронтенд: cd frontend && npm run build"
echo "   2. Убедись что public/ копируется в dist/ при билде"
