import { Link } from "react-router";
import BackLink from "../components/common/BackLink";
export default function AboutPage() {
  return (
    <>
      <BackLink />
      <header className="page-heading">
        <span className="eyebrow">01 / ЛИЧНОЕ ДЕЛО</span>
        <h1>Обо мне</h1>
        <p className="handwritten">Знакомство чуть ближе.</p>
      </header>
      <nav className="chapter-nav" aria-label="Разделы обо мне">
        <a href="#biography">Биография</a>
        <a href="#world">Мой мир</a>
        <a href="#future">К чему стремлюсь</a>
      </nav>
      <section id="biography" className="biography chapter">
        <div>
          <span className="eyebrow">ГЛАВА 01</span>
          <h2>
            Всё началось
            <br />в августе.
          </h2>
          <p className="lead">
            Я родился 21 августа 1994 года в Новочебоксарске, тёплым
            августовским вечером.
          </p>
          <p>
            Сейчас живу в Чебоксарах, работаю в William & Kate, учусь
            программировать и собираю собственные проекты.
          </p>
        </div>
        <figure className="city-stamp">
          <span>НОВОЧЕБОКСАРСК</span>
          <img
            src="/assets/novocheboksarsk.jpg"
            alt="Собор Святого князя Владимира в Новочебоксарске"
            loading="lazy"
          />
          <figcaption>
            21 / 08 / 1994 <small>место, где началась моя история</small>
          </figcaption>
        </figure>
      </section>
      <section id="world" className="chapter">
        <span className="eyebrow">ГЛАВА 02</span>
        <h2>То, что меня окружает</h2>
        <div className="interest-grid">
          <article>
            <span>01</span>
            <h3>Люди</h3>
            <p>
              Люблю разговаривать, узнавать чужие истории и делиться своими. В
              пабе встречаю гостей так, как встречал бы друзей у себя дома.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Технологии</h3>
            <p>
              Изучаю программирование, собираю приложения и пробую инструменты
              искусственного интеллекта. Мне интересно понимать, как всё
              устроено.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Видео и музыка</h3>
            <p>
              Мне нравится монтировать видео, придумывать истории и
              экспериментировать с музыкой. Хочется давать этим идеям больше
              времени.
            </p>
          </article>
          <article>
            <span>04</span>
            <h3>Парфюмерия</h3>
            <p>
              Знакомлюсь с ароматами, пробую новое и собираю впечатления. Запах
              может напомнить место, человека или целый период жизни.
            </p>
          </article>
        </div>
      </section>
      <section id="future" className="chapter future-note">
        <span className="eyebrow">ГЛАВА 03</span>
        <h2>К чему стремлюсь</h2>
        <p className="lead">
          Развиваться в разработке, делать полезные вещи для людей и находить
          больше времени для собственного творчества.
        </p>
        <p>
          Одна из идей - система для нашего паба, которая поможет команде лучше
          узнавать гостей и помнить их предпочтения с их разрешения.
        </p>
        <Link className="paper-link" to="/projects/">
          Мои проекты и планы
        </Link>
      </section>
      <p className="photo-credit">
        Фото Новочебоксарска: Георгий Долгопский,{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Собор_Святого_князя_Владимира_в_Новочебоксарске.jpg"
          target="_blank"
          rel="noreferrer"
        >
          Wikimedia Commons
        </a>
        ,{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/3.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY-SA 3.0
        </a>
        . Фото показано с кадрированием.
      </p>
    </>
  );
}
