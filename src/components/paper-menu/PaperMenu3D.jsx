import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { PAPER_MENU_ITEMS } from './paperConfig';

const DebugControls = import.meta.env.DEV ? lazy(() => import('./PaperDebugControls')) : null;

export default function PaperMenu3D({ open, onClose, triggerRef, onSelect }) {
  const navigate = useNavigate();
  const dialogRef = useRef(null), closedHost = useRef(null), openHost = useRef(null);
  const sceneRef = useRef(null), linksRef = useRef([]), closeRef = useRef(null);
  const callbacks = useRef({ open, onClose, onSelect, navigate });
  callbacks.current = { open, onClose, onSelect, navigate };
  const lock = useRef(null), closing = useRef(false), pending = useRef(null), pressed = useRef(null);
  const [status, setStatus] = useState('loading');
  const [phase, setPhase] = useState('closed');
  const [layout, setLayout] = useState([]);

  function restoreScroll() {
    if (lock.current !== null) { document.body.style.overflow = lock.current; lock.current = null; }
  }
  function finishClose() {
    dialogRef.current?.close();
    sceneRef.current?.attach(closedHost.current);
    restoreScroll(); closing.current = false; setPhase('closed');
    callbacks.current.onClose();
    triggerRef.current?.focus({ preventScroll: true });
    if (pending.current) {
      const href = pending.current; pending.current = null;
      callbacks.current.navigate(href);
    }
  }
  function requestClose() {
    if (closing.current) return;
    closing.current = true; setPhase('closing');
    if (sceneRef.current) sceneRef.current.setOpen(false); else finishClose();
  }
  function choose(item, event) {
    if (event?.metaKey || event?.ctrlKey) {
      if (event.type === 'pointerup') window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }
    event?.preventDefault();
    // Returning false reserves selection for a future paper preview flow.
    if (callbacks.current.onSelect?.(item) === false) return;
    pending.current = item.href; requestClose();
  }
  const handlers = useRef({});
  handlers.current = { finishClose, requestClose };

  useEffect(() => {
    let cancelled = false;
    import('./PaperScene').then(({ PaperScene }) => {
      if (cancelled) return;
      try {
        const scene = new PaperScene(closedHost.current, triggerRef.current, {
          onSettled(isOpen) {
            if (cancelled) return;
            if (!isOpen) { handlers.current.finishClose(); return; }
            setPhase('open');
            if (!closing.current && (document.activeElement === closeRef.current || document.activeElement === dialogRef.current)) {
              linksRef.current[0]?.focus({ preventScroll: true });
            }
          },
          onLayout: (rects) => { if (!cancelled) setLayout(rects); },
          onError(reason) {
            if (cancelled) return;
            if (import.meta.env.DEV) console.warn('PaperMenu fallback:', reason);
            sceneRef.current?.dispose(); sceneRef.current = null; setStatus('fallback');
            if (closing.current) handlers.current.finishClose();
          },
        });
        sceneRef.current = scene;
        if (import.meta.env.DEV) window.__paperMenuDev = scene;
        setStatus('ready');
      } catch (error) {
        if (import.meta.env.DEV) console.warn('PaperMenu WebGL unavailable:', error.message);
        setStatus('fallback');
      }
    }).catch(() => { if (!cancelled) setStatus('fallback'); });
    return () => {
      cancelled = true;
      if (import.meta.env.DEV && window.__paperMenuDev === sceneRef.current) delete window.__paperMenuDev;
      sceneRef.current?.dispose(); sceneRef.current = null;
      dialogRef.current?.close(); restoreScroll();
    };
  }, [triggerRef]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open) return;
    if (!dialog.open) {
      lock.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal(); closeRef.current?.focus({ preventScroll: true });
    }
    closing.current = false;
    if (status === 'ready' && sceneRef.current) {
      setPhase('opening');
      sceneRef.current.attach(openHost.current); sceneRef.current.setOpen(true);
    } else if (status === 'fallback') {
      setPhase('open'); linksRef.current[0]?.focus({ preventScroll: true });
    }
  }, [open, status]);

  function keyDown(event) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const current = linksRef.current.indexOf(document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? PAPER_MENU_ITEMS.length - 1
      : (current + (event.key === 'ArrowDown' ? 1 : -1) + PAPER_MENU_ITEMS.length) % PAPER_MENU_ITEMS.length;
    linksRef.current[next]?.focus();
  }
  function pointerUp(event) {
    if (!pressed.current || Math.hypot(event.clientX - pressed.current[0], event.clientY - pressed.current[1]) > 10) return;
    pressed.current = null;
    const hit = sceneRef.current?.pick(event.clientX, event.clientY);
    if (!hit) return;
    if (hit.index >= 0) choose(PAPER_MENU_ITEMS[hit.index], event);
    else if (!hit.paper) requestClose();
  }
  return createPortal(<>
    <div ref={closedHost} className="paper-menu-rest" aria-hidden="true" />
    <dialog ref={dialogRef} id="site-menu" aria-label="Меню GrinyaVerse"
      className={`paper-menu-3d ${status !== 'ready' ? 'paper-menu-fallback' : ''}`}
      data-phase={phase} onKeyDown={keyDown}
      onCancel={(event) => { event.preventDefault(); requestClose(); }}>
      <div ref={openHost} className="paper-menu-stage"
        onPointerDown={(event) => { pressed.current = [event.clientX, event.clientY]; }}
        onPointerUp={pointerUp}
        onPointerMove={(event) => {
          if (event.pointerType === 'touch') return;
          const hit = sceneRef.current?.pick(event.clientX, event.clientY);
          sceneRef.current?.setActive(hit?.index ?? -1);
          event.currentTarget.style.cursor = hit?.index >= 0 ? 'pointer' : 'default';
        }}
        onPointerLeave={() => sceneRef.current?.setActive(-1)} />
      <button ref={closeRef} type="button" className="paper-menu-close" onClick={requestClose}
        onFocus={() => sceneRef.current?.setActive(-1)} aria-label="Закрыть меню">Закрыть <span aria-hidden="true">×</span></button>
      <nav className="paper-menu-controls" aria-label="Основные разделы">
        {PAPER_MENU_ITEMS.map((item, index) => <a key={item.id}
          ref={(element) => { linksRef.current[index] = element; }} href={item.href}
          style={status === 'ready' ? layout[index] : undefined}
          onClick={(event) => choose(item, event)}
          onFocus={() => sceneRef.current?.setActive(index, true)}>
          {item.label}
        </a>)}
      </nav>
      {import.meta.env.DEV && DebugControls && open && status === 'ready' && <Suspense fallback={null}>
        <DebugControls scene={sceneRef.current} />
      </Suspense>}
    </dialog>
  </>, document.body);
}
