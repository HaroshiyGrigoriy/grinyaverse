import { mkdir, readFile, writeFile } from "node:fs/promises";

// Отдельные HTML-входы сохраняют прямые ссылки и обновление страницы
// на статическом хостинге, где нет перенаправления всех запросов на index.html.
const entries = [
  ["about", "Обо мне / GrinyaVerse"],
  ["projects", "Проекты, работа, планы / GrinyaVerse"],
  ["tips", "Ваши чаевые / GrinyaVerse"],
];
const html = await readFile("dist/index.html", "utf8");
for (const [route, title] of entries) {
  await mkdir(`dist/${route}`, { recursive: true });
  await writeFile(
    `dist/${route}/index.html`,
    html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`),
  );
}
console.log("Created static entry points for /about/, /projects/ and /tips/.");
