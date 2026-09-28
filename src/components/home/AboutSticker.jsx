import { useState } from "react";
import { Link } from "react-router";
import PaperDialog from "../common/PaperDialog";
export default function AboutSticker() {
  const [open, setOpen] = useState(false);
  return (
    <div className="about-position">
      <button
        className="about-cutout"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="about-teaser"
        aria-haspopup="dialog"
      >
        <span className="cutout-number">01</span>
        <span className="about-title">
          ОБО
          <br />
          МНЕ
        </span>
      </button>
      <PaperDialog
        open={open}
        onClose={() => setOpen(false)}
        id="about-teaser"
        title="Привет, я Гриша."
      >
        {(close) => (
          <>
            <p className="lead">
              Здесь вы можете познакомиться со мной, узнать меня поближе.
            </p>
            <p>
              Здесь о том, кто я, что меня окружает, как я смотрю на мир и к
              чему стремлюсь.
            </p>
            <div className="teaser-chapters">
              <span>Биография</span>
              <span>Мой мир</span>
              <span>Что дальше</span>
            </div>
            <Link className="paper-link" to="/about/" onClick={close}>
              Открыть мою историю
            </Link>
          </>
        )}
      </PaperDialog>
    </div>
  );
}
