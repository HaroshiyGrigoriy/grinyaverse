import './paperDebug.css';
import { useState } from 'react';

const controls = [
  ['crumple', 'Crumple', .25, 1, .005],
  ['foldStrength', 'Macro folds', 0, 2.5, .05],
  ['mediumStrength', 'Medium folds', 0, 2.5, .05],
  ['wrinkleStrength', 'Micro wrinkles', 0, 2.5, .05],
  ['edgeCurl', 'Edge curl', 0, 2.5, .05],
  ['lightIntensity', 'Light intensity', .4, 5, .1],
  ['roughness', 'Paper roughness', .7, 1, .01],
];
export default function PaperDebugControls({ scene }) {
  const [values, setValues] = useState({ ...scene.config, crumple: scene.config.openCrumple });
  const change = (name, value) => { setValues(v => ({ ...v, [name]: value })); scene.updateSetting(name, value); };
  return <details className="paper-debug">
    <summary>Бумага · настройки</summary>
    <div className="paper-debug-fields">
      {controls.map(([name, label, min, max, step]) => <label key={name}>
        <span>{label} <output>{Number(values[name]).toFixed(2)}</output></span>
        <input aria-label={label} type="range" min={min} max={max} step={step} value={values[name]}
          onChange={(event) => change(name, Number(event.target.value))} />
      </label>)}
      <label className="paper-debug-checkbox"><input type="checkbox" checked={values.shadow}
        onChange={(event) => change('shadow', event.target.checked)} /> Shadow</label>
      <button type="button" onClick={() => scene.replay()}>Повторить раскрытие</button>
      <small>Только разработка · {scene.quality} · {scene.paper.geometry.attributes.position.count.toLocaleString()} вершин</small>
    </div>
  </details>;
}
