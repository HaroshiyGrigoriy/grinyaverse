import CoverNavLink from './CoverNavLink';
import { site } from '../../data/site';

export default function Poster() {
  return (
    <section className="poster" aria-labelledby="cover-title">
      <picture>
        <source media="(max-aspect-ratio: 4/5)" srcSet="/assets/grisha-autumn-editorial-mobile.jpg" width="941" height="1672" />
        <img
          className="cover-photo"
          src="/assets/grisha-autumn-editorial.jpg"
          alt="Гриша в коричневой куртке среди осенних берёз и золотой листвы"
          width="1536"
          height="1024"
          fetchPriority="high"
        />
      </picture>

      <header className="cover-heading">
        <h1 id="cover-title">GRINYAVERSE</h1>
        <div className="cover-meta">
          <span>{site.issueDate}</span>
          <span className="cover-meta-tagline">ЖИЗНЬ КАК ОНА ЕСТЬ</span>
          <span>ВЫПУСК № {site.issue}</span>
        </div>
      </header>

      <nav className="cover-nav" aria-label="Читать журнал">
        <CoverNavLink
          label="Обо мне"
          to="/about/"
          kicker="За кадром"
          description="Чуть больше, чем знакомство"
          featured
        />
        <CoverNavLink
          label="Проекты"
          to="/projects/"
          kicker="В процессе"
          description="Идеи, которым я даю жизнь"
        />
        <CoverNavLink
          label="На чай"
          to="/tips/"
          kicker="Хороший жест"
          description="Маленькое спасибо"
        />
      </nav>

      <div className="cover-caption" aria-hidden="true">
        <span>ЧЕБОКСАРЫ</span>
        <span>У каждого сезона — своя история.</span>
      </div>
    </section>
  );
}
