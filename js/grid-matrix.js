const grid_width = 8;
const grid_height = 8;

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 * 
 * https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hsl_to_rgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

function fract(i) {
  return i - (i | 0);
}

function loop(i) {
  if (i > 0.5) {
    return (1.0 - i) * 2.0;
  }
  return i * 2.0;
}

const size = window.innerWidth / 4;

function create_cell() {
  const cell = document.createElement('div');
  cell.className = 'grid-cell';
  cell.style.width = `${size}px`;
  cell.style.height = `${size}px`;
  cell.style.margin = `${size * 0.02}px`;
  cell.style.borderRadius = `${size * 0.15}px`;
  return cell;
}

const cells = [];
for (let i = 0; i < grid_height; ++i) {
  for (let j = 0; j < grid_width; ++j) {
    const cell = create_cell();
    cells.push(cell);
    grid.appendChild(cell);
  }
}

function wave(x, y, time, frequency) {
  return Math.sin(frequency * (x + time)) + Math.cos(frequency * (y + time));
}

function sin_wave(x, y, time) {
  const w0 = wave(x, y, time, -3.7);
  const w1 = wave(x, y, time, -2.5);
  const w2 = wave(x, y, time, -1.2);
  const w3 = wave(x, y, time, 2.1);
  const w4 = wave(x, y, time, 3.4);
  const w5 = wave(x, y, time, 4.5);
  return (w0 - w1 + w2 + w3 - w4 + w5) * 0.166666;
}

const grid_animation = (time) => {
  for (let i = 0; i < grid_height; ++i) {
    for (let j = 0; j < grid_width; ++j) {
      const cell = cells[i * grid_width + j];

      const x = cell.offsetLeft / window.innerWidth * 6.0;
      const y = cell.offsetTop / window.innerHeight * 6.0;

      const height = sin_wave(x * 0.3, y * 0.3, time * 0.00025);
      cell.style.transform = `translateZ(${height * 40}px)`;

      const c = (height + 1.0) * 100 + 150;

      const hue = Math.sin(loop(fract(time * 0.0002)) * 0.05 * Math.PI);
      const sat = 0.2;
      const lit = 0.4 + (c / 255) * 0.4;
      const rgb = hsl_to_rgb(hue, sat, lit);
      cell.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  }
  requestAnimationFrame(grid_animation);
}

grid_animation();