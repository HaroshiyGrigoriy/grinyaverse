import { Link } from 'react-router';
import BackLink from '../components/common/BackLink';

export default function AboutPage() {
  return (
    <>
      <BackLink />
      <h1 className="inner-heading">ОБО МНЕ.<br /><mark>ЧЕМ ЖИВУ.</mark></h1>
      <div className="about-layout">
        <div>
          <p className="lead">Живу в Чебоксарах, работаю официантом в William &amp; Kate и придумываю, что ещё могу сделать.</p>
          <p className="body-copy">Мне интересно, как всё устроено: от вкуса и запаха до программ и космоса. Люблю докапываться до сути, связывать разные вещи и превращать идеи во что-то настоящее.</p>
          <p className="body-copy">Сейчас собираю свой GrinyaVerse. Здесь встречаются моя работа, проекты и всё, чему хочется дать продолжение.</p>
          <div className="tagline"><span>ЧЕБОКСАРЫ</span><span>WILLIAM &amp; KATE</span><span>ЛЮБОПЫТСТВО</span></div>
          <Link className="text-link" to="/projects/">Чем я занимаюсь ↗</Link>
        </div>
        <div className="about-photo"><div className="photo-window"><img src="/assets/grisha.jpeg" alt="Гриша в пабе William &amp; Kate" width="1152" height="1536" /></div></div>
      </div>
    </>
  );
}
