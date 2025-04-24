const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;

// background particles (small drifting stars)
let stars = [];
for (let i = 0; i < 120; i++) {
  stars.push({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2,
    α: Math.random() * 0.5 + 0.3,
    da: Math.random() * 0.005 + 0.002
  });
}

// shines (occasional glow pulses)
let shines = [];

// define two simple constellations by relative coords
const CONST_DEFS = [
  {
    name: "Orion",
    points: [
      { x: 0.55, y: 0.3 },
      { x: 0.60, y: 0.45 },
      { x: 0.50, y: 0.55 },
      { x: 0.65, y: 0.60 },
      { x: 0.45, y: 0.40 }
    ]
  },
  {
    name: "BigDipper",
    points: [
      { x: 0.20, y: 0.20 },
      { x: 0.25, y: 0.25 },
      { x: 0.30, y: 0.30 },
      { x: 0.35, y: 0.25 },
      { x: 0.40, y: 0.20 },
      { x: 0.45, y: 0.15 },
      { x: 0.50, y: 0.10 }
    ]
  }
];
// instantiate with actual coords + active flag
let constellations = CONST_DEFS.map(def => ({
  name: def.name,
  stars: def.points.map(p => ({ 
    x: p.x * W, 
    y: p.y * H 
  })),
  active: false
}));

function draw() {
  // fade for motion trails
  ctx.fillStyle = "rgba(10, 10, 20, 0.15)";
  ctx.fillRect(0, 0, W, H);

  // draw bg stars
  stars.forEach(s => {
    s.x += s.dx; s.y += s.dy;
    s.α += s.da;
    if (s.α <= 0.3 || s.α >= 0.8) s.da *= -1;
    if (s.x < 0) s.x = W;
    if (s.x > W) s.x = 0;
    if (s.y < 0) s.y = H;
    if (s.y > H) s.y = 0;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2*Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${s.α})`;
    ctx.fill();
  });

  // draw shines
  shines = shines.filter(sh => {
    sh.radius += sh.growth;
    sh.opacity -= sh.decay;
    if (sh.opacity <= 0) return false;
    ctx.beginPath();
    ctx.arc(sh.x, sh.y, sh.radius, 0, 2*Math.PI);
    ctx.fillStyle = `rgba(255,255,200,${sh.opacity})`;
    ctx.fill();
    return true;
  });

  // draw constellations if active
  constellations.forEach(c => {
    if (!c.active) return;
    ctx.strokeStyle = "rgba(150,200,255,0.8)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    c.stars.forEach((pt, i) => {
      ctx.lineTo(pt.x, pt.y);
      // draw small star point
      ctx.moveTo(pt.x + 1, pt.y);
      ctx.arc(pt.x, pt.y, 2, 0, 2*Math.PI);
      ctx.moveTo(pt.x, pt.y);
    });
    ctx.stroke();
  });

  requestAnimationFrame(draw);
}

// random occasional shine bursts
setInterval(() => {
  shines.push({
    x: Math.random() * W,
    y: Math.random() * H,
    radius: 0,
    growth: Math.random() * 1 + 0.5,
    opacity: 0.6,
    decay: Math.random() * 0.005 + 0.002
  });
}, 2000);

// click to toggle constellations
canvas.addEventListener("click", e => {
  const mx = e.clientX, my = e.clientY;
  constellations.forEach(c => {
    c.stars.forEach(pt => {
      const d = Math.hypot(pt.x - mx, pt.y - my);
      if (d < 20) {
        c.active = !c.active;
        // add sparkle shines on those stars
        c.stars.forEach(s => shines.push({
          x: s.x, y: s.y,
          radius: 0, growth: 1.5,
          opacity: 0.8, decay: 0.01
        }));
      }
    });
  });
});

// handle resize
window.addEventListener("resize", () => {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  // recalc constellation positions
  constellations.forEach((c, i) => {
    c.stars = CONST_DEFS[i].points.map(p => ({
      x: p.x * W,
      y: p.y * H
    }));
  });
});

draw();
