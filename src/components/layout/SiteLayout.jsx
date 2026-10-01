import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Footer from './Footer';

export default function SiteLayout() {
  const home = useLocation().pathname === '/';

  return (
    <>
      <a className="skip-link" href="#main">К содержимому</a>
      <div className={home ? 'cover-shell' : 'page-shell'}>
        {!home && <Header />}
        <main id="main" tabIndex={-1} className={home ? 'cover-main' : 'inner-page'}>
          <Outlet />
        </main>
        {!home && <Footer />}
      </div>
    </>
  );
}
