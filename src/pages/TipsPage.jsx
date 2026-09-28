import { Link } from 'react-router';
import BackLink from '../components/common/BackLink';

export default function TipsPage() {
  return (
    <>
      <BackLink />
      <div className="tips-layout">
        <p className="section-label">ЕСЛИ БЫЛО КЛАССНО</p>
        <h1 className="inner-heading">ОСТАВИТЬ<br /><mark>НА ЧАЙ.</mark></h1>
        <p className="lead">Если мы встретились в пабе и тебе понравилось, как прошёл вечер, здесь можно будет сказать спасибо чаевыми.</p>
        <div className="tips-note" role="note">
          <strong>ПЕРЕВОД ПОКА НЕ ПОДКЛЮЧЁН</strong>
          <p>Платёжная ссылка появится здесь позже. А если ты сейчас в пабе - можно просто спросить меня лично.</p>
        </div>
        <p className="body-copy">Спасибо, что заглянул ко мне.</p>
        <Link className="text-link" to="/">Вернуться на обложку ↗</Link>
      </div>
    </>
  );
}
