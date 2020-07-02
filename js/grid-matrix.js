const grid_width = 18;
const grid_height = 10;

function create_cell() {
  const cell = document.createElement('div');
  cell.className = 'grid-cell';
  cell.style.width = 100 / grid_width + '%';
  cell.style.height = 100 / grid_height + '%';
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
      const height = sin_wave(i * 0.3, j * 0.3, time * 0.0005);
      cell.style.transform = `translateZ(${height * 30}px)`;

      const c = (height + 1.0) * 50 + 150;
      cell.style.backgroundColor = `rgb(${c}, ${c}, ${c})`;
    }
  }
  requestAnimationFrame(grid_animation);
}

grid_animation();