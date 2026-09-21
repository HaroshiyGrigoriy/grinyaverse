import { Link } from 'react-router';
import AboutSticker from './AboutSticker';
import { site } from '../../data/site';

export default function Poster() {
  return (
    <section className="poster" aria-labelledby="cover-title">
      <div className="poster-topline"><span>{site.issueDate}</span><span>ЖИЗНЬ. РАБОТА. ВСЁ ОСТАЛЬНОЕ.</span></div>
      <div className="poster-type">
        <p className="hello-slip">Привет, я</p>
        <h1 id="cover-title">ГРИША</h1>
        <span className="echo echo-one" aria-hidden="true">ГРИША</span>
        <span className="echo echo-two" aria-hidden="true">ГРИША</span>
      </div>
      <div className="paper-fragment" aria-hidden="true"><span>GRINYAVERSE</span><span>Личный выпуск</span><span>Истории из жизни</span></div>
      <figure className="hero-portrait">
        <img src="/assets/grisha-cutout.png" alt="Улыбающийся Гриша опирается щекой на руку" width="1106" height="1422" fetchPriority="high" />
      </figure>
      <AboutSticker />
      <Link className="projects-cutout" to="/projects/">
        <span className="cutout-index">02 / ЧТО Я ДЕЛАЮ</span>
        <span className="projects-title">ПРОЕКТЫ.<br />РАБОТА. ПЛАНЫ.</span>
        <span className="projects-arrow" aria-hidden="true">↗</span>
      </Link>
      <Link className="tips-seal" to="/tips/">
        <span className="tips-kicker">ЕСЛИ БЫЛО КЛАССНО</span>
        <span className="tips-word">НА ЧАЙ</span>
        <span className="tips-action">ЧАЕВЫЕ ↗</span>
      </Link>
      <div className="poster-bottomline"><span>WILLIAM &amp; KATE / ГРИША</span><span>ЛИСТАЙ. НАЖИМАЙ. ЗНАКОМЬСЯ.</span></div>
    </section>
  );
}
