// Icons im Kugelschreiber-Strich: ein Raster (24 px), eine Strichstärke, runde Enden.
const NS = 'http://www.w3.org/2000/svg';

const CIRCLE = 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z';

const PATHS = {
  plus: ['M12 5v14', 'M5 12h14'],
  x: ['M6 6l12 12', 'M18 6L6 18'],
  check: ['M5 12.5l4.5 4.5L19 7'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'chevron-right': ['M9 6l6 6-6 6'],
  'arrow-up': ['M12 19V5', 'M6 11l6-6 6 6'],
  'arrow-down': ['M12 5v14', 'M6 13l6 6 6-6'],
  sort: ['M8 20V4', 'M4.5 7.5L8 4l3.5 3.5', 'M16 4v16', 'M12.5 16.5L16 20l3.5-3.5'],
  alert: [CIRCLE, 'M12 7.5v5.5', 'M12 16.5v.01'],
  info: [CIRCLE, 'M12 11v5.5', 'M12 7.5v.01'],
  camera: [
    'M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.6-2.2h5.8L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z',
    'M15.5 13a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z',
  ],
  download: ['M12 4v11', 'M7 10l5 5 5-5', 'M5 19.5h14'],
  upload: ['M12 15V4', 'M7 9l5-5 5 5', 'M5 19.5h14'],
  trash: ['M4 7h16', 'M10 11v6', 'M14 11v6', 'M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7', 'M9 7V4.5h6V7'],
  logout: ['M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14', 'M10 16l-4-4 4-4', 'M6 12h10'],
  'money-in': ['M17 7L7 17', 'M7 9v8h8'],
  'money-out': ['M7 17L17 7', 'M9 7h8v8'],
  cloud: ['M7 18h10a4 4 0 0 0 .8-7.92A5.5 5.5 0 0 0 7.2 9.1 4.5 4.5 0 0 0 7 18z'],
  'cloud-off': ['M7 18h10a4 4 0 0 0 1.9-.48', 'M20.6 14.5A4 4 0 0 0 17.8 10.08 5.5 5.5 0 0 0 9.6 6.2', 'M6.2 9.4A4.5 4.5 0 0 0 7 18', 'M4 4l16 16'],
  saving: ['M12 4a8 8 0 1 0 8 8'],
  file: ['M7.5 3H14l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3z', 'M14 3v5h5'],
};

export function icon(name, { size = 20, label = '', className = '' } = {}) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('class', `icon icon-${name}${className ? ` ${className}` : ''}`);
  if (label) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', label);
  } else {
    svg.setAttribute('aria-hidden', 'true');
  }
  for (const d of PATHS[name] || []) {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
  }
  return svg;
}
