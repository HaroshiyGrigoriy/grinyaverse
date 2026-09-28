import { site } from '../../data/site';

export default function Colophon() {
  return (
    <div className="colophon">
      <p>Работаю в пабе.<br /><em>Придумываю своё.</em></p>
      <span className="colophon-note">У каждой вырезки<br />есть продолжение.</span>
      <span className="issue-number" aria-hidden="true">{site.issue}</span>
    </div>
  );
}
