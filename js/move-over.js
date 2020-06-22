const gallery = document.getElementById('gallery');

let screen_width, screen_height, half_screen_width, half_screen_height;
const matrix = new Float32Array(16);

const screen_offset = 10;

const matrix_rotate_euler = (x, y, z) => {
  const a = Math.cos(x), b = Math.sin(x);
  const c = Math.cos(y), d = Math.sin(y);
  const e = Math.cos(z), f = Math.sin(z);

  const ae = a * e, af = a * f, be = b * e, bf = b * f;

  matrix[0] = c * e;
  matrix[4] = - c * f;
  matrix[8] = d;

  matrix[1] = af + be * d;
  matrix[5] = ae - bf * d;
  matrix[9] = - b * c;

  matrix[2] = bf - ae * d;
  matrix[6] = be + af * d;
  matrix[10] = a * c;
  
  matrix[15] = 1;
}

const matrix_to_css = () => {
  let css = `matrix3d(${matrix[0]}`;
  for (let i = 1; i < matrix.length; ++i) {
    css += `, ${matrix[i]}`;
  }
  css += ');';
  return css;
}

const resize = () => {
  screen_width = window.innerWidth;
  screen_height = window.innerHeight;
  half_screen_width = screen_width >>> 1;
  half_screen_height = screen_height >>> 1;
}

const mousemove = (event) => {
  const x = event.screenX;
  const y = event.screenY;

  const u = (x - half_screen_width) / screen_width;
  const v = (half_screen_height - y) / screen_height;

  gallery.style.transform = `translateZ(0px) rotateX(${v * screen_offset}deg) rotateY(${u * screen_offset}deg)`;
  tab.style.transform = `translateZ(10px) rotateX(${v * screen_offset}deg) rotateY(${u * screen_offset}deg)`;
}

window.addEventListener('resize', resize, false);
window.addEventListener('mousemove', mousemove, false);

resize();