import { Link } from 'react-router';
import { site } from '../../data/site';

export default function Header({ home }) {
  return (
    <header className="masthead">
      <Link className="wordmark" to="/" aria-label="GrinyaVerse, главная">
        GRINYA<span>VERSE</span><sup>®</sup>
      </Link>
      <div className="edition">
        <strong>ЛИЧНЫЙ ВЫПУСК</strong>
        <span className="edition-city">{site.city}{home && ` / № ${site.issue}`}</span>
      </div>
      <Link className="header-link" to="/about/">
        {home ? 'ЗНАКОМИМСЯ' : 'ЗНАКОМИМСЯ?'} <span aria-hidden="true">↗</span>
      </Link>
    </header>
  );
}
