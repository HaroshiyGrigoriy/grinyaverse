import { socials } from "../../data/site";
export default function SocialLinks() {
  return (
    <div className="socials" aria-label="Социальные сети">
      {socials.map(({ label, url }) =>
        url ? (
          <a key={label} href={url} target="_blank" rel="noreferrer">
            {label}
          </a>
        ) : (
          <span className="social-pending" key={label}>
            {label} <small>скоро</small>
          </span>
        ),
      )}
    </div>
  );
}
