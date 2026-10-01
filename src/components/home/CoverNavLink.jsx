import { Link } from 'react-router';

export default function CoverNavLink({ label, to, kicker, description, featured = false }) {
  return (
    <Link className={`cover-nav-item${featured ? ' cover-nav-item--featured' : ''}`} to={to} aria-label={label}>
      <span className="cover-nav-kicker" aria-hidden="true">{kicker}</span>
      <span className="cover-nav-label">{label}</span>
      <span className="cover-nav-description" aria-hidden="true">{description}</span>
    </Link>
  );
}
