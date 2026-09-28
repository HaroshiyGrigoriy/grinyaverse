import { useState } from "react";
import { Link } from "react-router";
import PaperDialog from "../common/PaperDialog";
import SocialLinks from "../common/SocialLinks";
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="masthead">
        <Link className="wordmark" to="/" aria-label="GrinyaVerse, главная">
          GRINYA<span>VERSE</span>
        </Link>
        <span className="edition">
          ЛИЧНЫЙ ВЫПУСК <i>осень / 2026</i>
        </span>
        <button
          className="menu-toggle"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-haspopup="dialog"
        >
          <span>МЕНЮ</span>
          <span className="burger" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </header>
      <PaperDialog
        open={open}
        onClose={() => setOpen(false)}
        id="site-menu"
        title="Содержание"
      >
        {(close) => (
          <>
            <nav className="paper-nav" aria-label="Главное меню">
              {[
                ["00", "Обложка", "/"],
                ["01", "Обо мне", "/about/"],
                ["02", "Проекты, работа, планы", "/projects/"],
                ["03", "Ваши чаевые", "/tips/"],
              ].map(([n, t, url]) => (
                <Link key={url} to={url} onClick={close}>
                  <small>{n}</small>
                  <span>{t}</span>
                </Link>
              ))}
            </nav>
            <SocialLinks />
          </>
        )}
      </PaperDialog>
    </>
  );
}
