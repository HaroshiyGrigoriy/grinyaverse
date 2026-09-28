import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { pageTitles } from "../../data/site";

export default function RouteEffects() {
  const { pathname } = useLocation();
  const initialRender = useRef(true);

  useEffect(() => {
    const route = pathname.replace(/\/+$/, "") || "/";
    document.title = pageTitles[route] || "Страница не найдена / GrinyaVerse";
    document.body.classList.toggle("cover-page", route === "/");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", "#f5eddc");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // После перехода с клавиатуры фокус попадает в содержимое новой страницы.
    if (!initialRender.current)
      document.getElementById("main")?.focus({ preventScroll: true });
    initialRender.current = false;
  }, [pathname]);

  return null;
}
