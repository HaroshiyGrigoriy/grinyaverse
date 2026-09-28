import { useEffect, useRef, useState } from "react";

export default function PaperDialog({
  open,
  onClose,
  id,
  title,
  children,
  className = "",
}) {
  const dialog = useRef(null);
  const timer = useRef(null);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(timer.current);
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [open]);
  function close() {
    if (closing) return;
    setClosing(true);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    timer.current = setTimeout(
      () => {
        setClosing(false);
        onClose();
      },
      reduce ? 0 : 520,
    );
  }
  return (
    <dialog
      ref={dialog}
      id={id}
      className={`paper-dialog ${className} ${closing ? "is-closing" : ""}`}
      aria-labelledby={`${id}-title`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section className="paper-sheet">
        <div className="paper-folds" aria-hidden="true" />
        <button className="paper-close" aria-label="Закрыть" onClick={close}>
          ×
        </button>
        <p className="eyebrow">GRINYAVERSE / ЛИЧНЫЙ ВЫПУСК</p>
        <h2 id={`${id}-title`}>{title}</h2>
        {typeof children === "function" ? children(close) : children}
      </section>
    </dialog>
  );
}
