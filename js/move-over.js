const gallery = document.getElementById('gallery');
const status = document.getElementById('status');
const grid = document.getElementById('grid');
const wallpaper = document.getElementById('wallpaper');

let screen_width, screen_height, half_screen_width, half_screen_height;
const matrix = new Float32Array(16);

const screen_offset = -50;
const screen_rotate = 10;

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

const rotate = (u, v) => {
  const l = Math.sqrt(Math.sqrt(u * u + v * v)) * screen_offset;

  const rotate_u = u * screen_rotate * 0.8;
  const rotate_v = v * screen_rotate * 0.5;
  gallery.style.transform = `translateZ(${l}px) rotateX(${rotate_v}deg) rotateY(${rotate_u}deg)`;
  tab.style.transform = `translateZ(${l - 200}px) rotateX(${rotate_v}deg) rotateY(${rotate_u}deg)`;
  status.style.transform = `translateZ(${l + 50}px) rotateX(${rotate_v}deg) rotateY(${rotate_u}deg) skewX(-5deg)`;
  grid.style.transform = `translateZ(${l - 400}px) rotateX(${rotate_v}deg) rotateY(${rotate_u}deg)`;
  wallpaper.style.transform = `translateZ(${l - 500}px) rotateX(${rotate_v}deg) rotateY(${rotate_u}deg)`;
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
  const v = (y - half_screen_height) / screen_height;

  rotate(u, v);
}

const device_rotate = (event) => {
  alert(event);
  const beta = event.beta / 180;
  const gamma = event.gamma / 90;
  return rotate(beta, gamma);
}

window.addEventListener('resize', resize, false);
window.addEventListener('mousemove', mousemove, false);
window.addEventListener('deviceorientation', device_rotate, true);

rotate(0, 0);

resize();