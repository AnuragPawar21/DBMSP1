const canvas = document.getElementById('wave-bg');
if (!canvas) {
  console.warn("Canvas with id 'wave-bg' not found.");
  throw new Error("Missing canvas element with id='wave-bg'");
}

const ctx = canvas.getContext('2d');
if (!ctx) {
  console.error("Failed to get 2D context from canvas.");
  throw new Error("Canvas context is null.");
}

// Responsive sizing
let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Generate wave settings
const waves = Array.from({ length: 4 }, (_, i) => ({
  speed: (Math.random() * 0.02 + 0.01) * (i % 2 === 0 ? 1 : -1),
  offset: Math.random() * 1000,
  waveWidth: Math.random() * 50 + 100,
  heightRatio: i / 3,
  color: `rgba(${74 + i * 20}, ${108 + i * 10}, 247, ${0.3 + 0.15 * i})`
}));

// Draw loop
function drawWaves() {
  ctx.clearRect(0, 0, width, height);
  const now = Date.now();

  for (const wave of waves) {
    const h = height * 0.6;
    const yOffset = wave.heightRatio * (height - h);

    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x <= width; x++) {
      const y =
        Math.sin((x + now * wave.speed + wave.offset) / wave.waveWidth) *
          (h / 4) +
        (height - h) +
        yOffset;

      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = wave.color;
    ctx.fill();
  }

  requestAnimationFrame(drawWaves);
}

drawWaves();
