import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Footer from './Footer';

export default function SiteLayout() {
  const home = useLocation().pathname === '/';

  return (
    <>
      <a className="skip-link" href="#main">К содержимому</a>
      <div className="page-shell">
        <Header home={home} />
        <main id="main" tabIndex={-1} className={home ? undefined : 'inner-page'}>
          <Outlet />
        </main>
        <Footer home={home} />
      </div>
    </>
  );
}
