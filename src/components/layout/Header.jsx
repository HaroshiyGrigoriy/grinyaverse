import { useRef, useState } from "react";
import { Link } from "react-router";
import PaperMenu3D from "../paper-menu/PaperMenu3D";
export default function Header() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);
  return (
    <>
      <header className="masthead">
        <Link className="wordmark" to="/" aria-label="GrinyaVerse, главная">
          GRINYA<span>VERSE</span>
        </Link>
        <span className="edition">
          ЛИЧНЫЙ ВЫПУСК <i>осень / 2026</i>
        </span>
        <div className="menu-controls">
        <button
          ref={burgerRef}
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
        </div>
      </header>
      <PaperMenu3D open={open} onClose={() => setOpen(false)} triggerRef={burgerRef} />
    </>
  );
}
