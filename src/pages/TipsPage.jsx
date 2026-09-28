import { useState } from "react";
import BackLink from "../components/common/BackLink";
import { support } from "../data/site";
const directions = [
  [
    "⌨",
    "Программирование",
    "Учёба, инструменты разработки и собственные приложения. Хочу делать полезные вещи, которыми будут пользоваться люди.",
  ],
  [
    "◉",
    "Видео",
    "Программы для монтажа, звук, свет и аппаратура для съёмки. Мне нравится превращать задумки в истории.",
  ],
  [
    "♫",
    "Музыка",
    "Инструменты для записи и работы со звуком, эксперименты и новые треки.",
  ],
  [
    "✳",
    "Свои идеи",
    "Инструменты искусственного интеллекта и система для нашего паба, которая поможет внимательнее работать с гостями.",
  ],
  [
    "◷",
    "Свободное время",
    "Возможность выделить больше времени на учёбу, съёмку, музыку и развитие своих проектов.",
  ],
];
export default function TipsPage() {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <BackLink />
      <header className="page-heading">
        <span className="eyebrow">03 / ВАШ ВКЛАД</span>
        <h1>Ваши чаевые</h1>
        <p className="handwritten">У них есть продолжение.</p>
      </header>
      <div className="tips-intro">
        <p className="lead">
          В пабе я встречаю гостей так, как встречал бы друзей у себя дома.
        </p>
        <p>
          Мне нравится делать вечер хорошим: разговаривать, узнавать о людях,
          рассказывать, чем занимаюсь. Если вы разрешите, могу записать то, что
          поможет мне запомнить ваши предпочтения к следующей встрече.
        </p>
        <p>
          Чаевые помогают мне уделять больше времени тому, что люблю, и
          двигаться дальше. Вот на что я могу их потратить.
        </p>
      </div>
      <section className="tips-destinations" aria-label="На что идут чаевые">
        <div
          className="destination-tabs"
          role="group"
          aria-label="Выберите направление"
        >
          {directions.map(([icon, title], i) => (
            <button
              key={title}
              aria-pressed={selected === i}
              aria-controls="destination-description"
              onClick={() => setSelected(i)}
            >
              <span aria-hidden="true">{icon}</span>
              {title}
            </button>
          ))}
        </div>
        <article
          className="destination-note"
          id="destination-description"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="handwritten">из чаевых - в возможности</span>
          <h2>{directions[selected][1]}</h2>
          <p>{directions[selected][2]}</p>
        </article>
      </section>
      {support.url && (
        <section className="support-action">
          <a
            className="paper-link"
            href={support.url}
            target="_blank"
            rel="noreferrer"
          >
            Оставить чаевые
          </a>
        </section>
      )}
      <p className="tips-signature">
        Мне важно то, чем я живу.
        <br />
        <span className="handwritten">Гриша</span>
      </p>
    </>
  );
}
