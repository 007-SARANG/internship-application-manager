// Canvas-based Cyberpunk Neon Confetti Generator

export function triggerConfetti() {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = [
    "#ec4899", // Neon Pink
    "#8b5cf6", // Purple
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#06b6d4", // Cyan
  ];

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    shape: "square" | "circle" | "triangle";
  }

  const particles: Particle[] = [];
  const particleCount = 120;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 14 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      shape: ["square", "circle", "triangle"][Math.floor(Math.random() * 3)] as
        | "square"
        | "circle"
        | "triangle",
    });
  }

  let animationId: number;
  let startTime = Date.now();

  function render() {
    const elapsed = Date.now() - startTime;
    ctx?.clearRect(0, 0, width, height);

    let activeParticles = 0;

    for (const p of particles) {
      if (p.opacity <= 0) continue;
      activeParticles++;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.rotationSpeed;

      if (elapsed > 1000) {
        p.opacity -= 0.02;
      }

      ctx?.save();
      ctx?.translate(p.x, p.y);
      ctx?.rotate(p.rotation);
      if (ctx) ctx.globalAlpha = Math.max(0, p.opacity);
      if (ctx) ctx.fillStyle = p.color;
      if (ctx) ctx.shadowColor = p.color;
      if (ctx) ctx.shadowBlur = 8;

      ctx?.beginPath();
      if (p.shape === "circle") {
        ctx?.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      } else if (p.shape === "triangle") {
        ctx?.moveTo(0, -p.size);
        ctx?.lineTo(p.size, p.size);
        ctx?.lineTo(-p.size, p.size);
        ctx?.closePath();
      } else {
        ctx?.rect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      ctx?.fill();
      ctx?.restore();
    }

    if (activeParticles > 0 && elapsed < 3500) {
      animationId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  render();
}
