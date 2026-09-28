# GrinyaVerse · Осенний выпуск

Личный сайт Гриши: React 19 + React Router + Vite, JavaScript и CSS.

## Запуск

Node.js 22.13+.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Содержимое `dist/` можно публиковать на Nginx. Сборка создаёт отдельные HTML-входы для `/about/`, `/projects/` и `/tips/`.

## Структура

- `src/main.jsx` - вход приложения, BrowserRouter и стили.
- `src/App.jsx` - маршруты, общая оболочка.
- `src/components/layout/` - шапка с меню, подвал, оболочка страниц.
- `src/components/home/` - осенний коллаж, кнопка знакомства, подпись выпуска.
- `src/components/common/PaperDialog.jsx` - доступный нативный dialog с раскрытием и смятием бумаги. Escape, кнопка закрытия, клик снаружи, блокировка прокрутки, возврат фокуса. Анимация CSS: деформация контура, масштаб, поворот и свет складок; это стилизация, не физическая 3D-симуляция. Учитывается reduced motion.
- `src/components/common/SocialLinks.jsx` - общие социальные ссылки.
- `src/pages/` - страницы, биография и интересы, проекты, интерактивные направления чаевых.
- `src/data/site.js` - соцсети и платёжная ссылка. `url: null` означает, что ссылка ещё не задана: соцсеть отображается с подписью «скоро», платёжная кнопка скрыта. Вставляйте только свои подтверждённые URL.
- `src/data/projects.js` - реальные проекты и их статусы.
- `src/styles/` - шрифты, основа, шапка, обложка, подвал, страницы, бумажный диалог и адаптация.
- `public/fonts/` - локальные variable WOFF2 Oswald, Manrope, Caveat и оригинальные OFL-лицензии. Проверены все русские буквы, включая Ё/ё.
- `public/assets/` - фото и материалы коллажа. На обложке исходный `grisha-portrait.jpeg`, без генеративной обработки лица.

## Источники материалов

Шрифты скачаны из официального репозитория Google Fonts (`ofl/oswald`, `ofl/manrope`, `ofl/caveat`), преобразованы из TTF в WOFF2 с сохранением набора символов и вариативности. Лицензии находятся рядом с каждым шрифтом.

`novocheboksarsk.jpg`: Георгий Долгопский, «Собор Святого князя Владимира в Новочебоксарске», Wikimedia Commons, CC BY-SA 3.0. Исходник сохранён без изменений, отображение кадрировано средствами CSS. Атрибуция и ссылки на источник/лицензию находятся на странице «Обо мне».

`autumn-park.webp` и `paper-card.webp` созданы встроенной генерацией изображений для оформления и оптимизированы в WebP. Это декоративные изображения, не документальные фотографии конкретного парка.

Промпты генерации:
- Park: quiet golden autumn park, tall maple and birch trees, honey yellow leaves, soft olive shadows, distant path, late September warm afternoon, analog 35mm editorial photo, no people, buildings or text.
- Card: early 2000s youth magazine paper collage, geometric cream card, folds, burgundy and powder-blue scraps, restrained silver foil and halftone, large empty cream centre, no text, arrows or people.

Фотографии Гриши личные; разрешение на повторное использование нужно получать у владельца.

Примечание: блок соцсетей содержит только готовую ссылку GitHub. Для YouTube, TikTok, Telegram и перевода нужны адреса владельца. На сайте нет фиктивных платёжных кнопок и ссылок на чужие профили.
