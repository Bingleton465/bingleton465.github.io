// velora.js
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;

// drifting stars
const stars = Array.from({length: 120}, () => ({
  x: Math.random()*W,
  y: Math.random()*H,
  r: Math.random()*1.5 + 0.5,
  dx: (Math.random()-0.5)*0.2,
  dy: (Math.random()-0.5)*0.2,
  alpha: Math.random()*0.5 + 0.3,
  dAlpha: Math.random()*0.005 + 0.002
}));

// shine pulses
let shines = [];

// constellation definitions (relative coords)
const CONST_DEFS = [
  { name: 'Orion', points: [
      {x:0.55,y:0.3},{x:0.60,y:0.45},{x:0.50,y:0.55},
      {x:0.65,y:0.60},{x:0.45,y:0.40}
    ]
  },
  { name: 'Big Dipper', points: [
      {x:0.20,y:0.20},{x:0.25,y:0.25},{x:0.30,y:0.30},
      {x:0.35,y:0.25},{x:0.40,y:0.20},{x:0.45,y:0.15},{x:0.50,y:0.10}
    ]
  }
];

// build actual constellation data
const constellations = CONST_DEFS.map(def => ({
  stars: def.points.map(p => ({x: p.x*W, y: p.y*H})),
  active: false
}));

function draw() {
  // fade for trails
  ctx.fillStyle = 'rgba(10,10,20,0.15)';
  ctx.fillRect(0,0,W,H);

  // draw + move stars
  stars.forEach(s => {
    s.x += s.dx; s.y += s.dy;
    if (s.x<0) s.x=W; if (s.x>W) s.x=0;
    if (s.y<0) s.y=H; if (s.y>H) s.y=0;
    s.alpha += s.dAlpha;
    if (s.alpha<=0.3 || s.alpha>=0.8) s.dAlpha *= -1;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2*Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
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

  // draw active constellations
  constellations.forEach(c => {
    if (!c.active) return;
    ctx.strokeStyle = 'rgba(150,200,255,0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    c.stars.forEach((pt, i) => {
      if (i===0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    // draw small nodes
    c.stars.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2, 0, 2*Math.PI);
      ctx.fillStyle = 'rgba(150,200,255,0.9)';
      ctx.fill();
    });
  });

  requestAnimationFrame(draw);
}

// random shine bursts
setInterval(() => {
  shines.push({
    x: Math.random()*W,
    y: Math.random()*H,
    radius: 0,
    growth: Math.random()*1 + 0.5,
    opacity: 0.6,
    decay: Math.random()*0.005 + 0.002
  });
}, 2000);

// click to toggle constellation and sparkle
canvas.addEventListener('click', e => {
  const mx = e.clientX, my = e.clientY;
  constellations.forEach(c => {
    c.stars.forEach(pt => {
      if (Math.hypot(pt.x-mx, pt.y-my) < 20) {
        c.active = !c.active;
        // sparkle on toggle
        c.stars.forEach(s => shines.push({
          x: s.x, y: s.y,
          radius: 0, growth: 1.5,
          opacity: 0.8, decay: 0.01
        }));
      }
    });
  });
});

// resize handler
window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  constellations.forEach((c,i) => {
    c.stars = CONST_DEFS[i].points.map(p => ({
      x: p.x * W, y: p.y * H
    }));
  });
});

draw();
