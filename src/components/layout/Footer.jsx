import { Link } from 'react-router';
import { site } from '../../data/site';

export default function Footer({ home }) {
  return (
    <footer className={`footer${home ? '' : ' inner-footer'}`}>
      <span>GRINYAVERSE © {site.year}</span>
      <span>ПРОДОЛЖЕНИЕ СЛЕДУЕТ{home ? '' : '.'}</span>
      {home
        ? <Link to="/about/">ЧЕБОКСАРЫ ↗</Link>
        : <span>СДЕЛАНО ПО-СВОЕМУ <span aria-hidden="true">✳</span></span>}
    </footer>
  );
}
