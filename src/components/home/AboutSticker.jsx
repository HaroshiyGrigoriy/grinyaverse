import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

export default function AboutSticker() {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  function closeAndFocus() {
    setExpanded(false);
    buttonRef.current?.focus();
  }

  function handleClick() {
    if (expanded) navigate('/about/');
    else setExpanded(true);
  }

  useEffect(() => {
    if (!expanded) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setExpanded(false);
        buttonRef.current?.focus();
      }
    }
    function handleOutsideClick(event) {
      if (!containerRef.current?.contains(event.target)) setExpanded(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [expanded]);

  return (
    <div className="about-position" ref={containerRef}>
      <button
        className="about-cutout"
        id="about-sticker"
        ref={buttonRef}
        type="button"
        aria-expanded={expanded}
        aria-controls="about-teaser"
        onClick={handleClick}
      >
        <span className="cutout-index">01 / ДАВАЙ ЗНАКОМИТЬСЯ</span>
        <span className="about-title">ОБО<br />МНЕ <span aria-hidden="true">↗</span></span>
        <span className="cutout-hint" id="about-hint">
          {expanded ? 'ЕЩЁ РАЗ - ВСЯ ИСТОРИЯ' : 'НАЖМИ И УЗНАЙ'}
        </span>
      </button>
      <div className="teaser" id="about-teaser" hidden={!expanded}>
        <button className="teaser-close" type="button" aria-label="Свернуть информацию обо мне" onClick={closeAndFocus}>×</button>
        <span className="teaser-kicker">ПАРА СЛОВ ОБО МНЕ</span>
        <p>Я Гриша. Работаю в William &amp; Kate, делаю свои проекты и люблю разбираться, как всё устроено.</p>
        <Link to="/about/">Познакомимся поближе ↗</Link>
      </div>
    </div>
  );
}
