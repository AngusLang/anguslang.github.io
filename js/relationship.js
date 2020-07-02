const duration_label = document.getElementById('relationship-duration');
const start = new Date('June 18, 2020 16:15:30');
const now = new Date();
const day_duration = 1000 * 60 * 60 * 24;
const duration = ((now - start) / day_duration) | 0;
duration_label.innerHTML = `${duration} days`;