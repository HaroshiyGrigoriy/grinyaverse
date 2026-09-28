import { Link } from "react-router";
import AboutSticker from "./AboutSticker";
export default function Poster() {
  return (
    <section className="poster" aria-labelledby="cover-title">
      <div className="poster-topline">
        <span>СЕНТЯБРЬ 2026</span>
        <span>ОСЕННИЙ ВЫПУСК / 01</span>
      </div>
      <div className="newspaper" aria-hidden="true">
        <strong>ЛИЧНАЯ ХРОНИКА</strong>
        <div>
          <p>
            Люди. Идеи. Впечатления. Любопытство начинается с простого вопроса.
            Каждый день есть что-то, к чему хочется присмотреться.
          </p>
          <p>
            Работа, музыка, новые города. Истории складываются из разговоров и
            маленьких наблюдений. Продолжение на следующих страницах.
          </p>
        </div>
      </div>
      <div className="poster-type">
        <p className="hello-slip">Привет, я</p>
        <h1 id="cover-title">ГРИША</h1>
      </div>
      <figure className="hero-portrait">
        <img
          src="/assets/grisha-portrait.jpeg"
          alt="Гриша улыбается, опираясь щекой на руку"
          width="864"
          height="1536"
          fetchPriority="high"
        />
        
      </figure>
      <AboutSticker />
      <Link className="projects-cutout" to="/projects/">
        <span className="cutout-number">02</span>
        <span className="projects-title">
          ПРОЕКТЫ
          <br />
          РАБОТА <em>&</em> ПЛАНЫ
        </span>
        <span className="project-tabs" aria-hidden="true">
          <i>идеи</i>
          <i>в процессе</i>
        </span>
      </Link>
      <Link className="tips-seal" to="/tips/">
        <span className="tips-icons" aria-hidden="true">
          ♫ ◉ ₽
        </span>
        <span className="tips-word">
          ВАШИ
          <br />
          ЧАЕВЫЕ
        </span>
        <span className="tips-action">во что они превращаются</span>
      </Link>
      <div className="poster-bottomline">
        <span>WILLIAM & KATE</span>
        <span>ЛИЧНАЯ ХРОНИКА</span>
      </div>
    </section>
  );
}
