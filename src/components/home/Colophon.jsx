import { Link } from "react-router";

const chapters = [
  ["01", "Обо мне", "Биография, интересы и мечты", "/about/"],
  ["02", "Проекты", "Что делаю и что задумал", "/projects/"],
  ["03", "Ваши чаевые", "На что я могу их потратить", "/tips/"],
];

export default function Colophon() {
  return (
    <section className="colophon" aria-labelledby="contents-title">
      <h2 className="eyebrow" id="contents-title">В ЭТОМ ВЫПУСКЕ</h2>
      <nav className="issue-contents" aria-label="Страницы выпуска">
        {chapters.map(([number, title, description, url]) => (
          <Link key={url} to={url}>
            <span className="contents-number">{number}</span>
            <span><strong>{title}</strong><small>{description}</small></span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
