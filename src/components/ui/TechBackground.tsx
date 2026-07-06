import React, { useEffect, useRef } from "react";

export default function TechBackground({ theme = "gold" }: { theme?: "gold" | "joker" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; pulse: number; pulseSpeed: number;
  }>>([]);
  const circuitNodesRef = useRef<Array<{ x: number; y: number; connections: number[] }>>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const rgbLight = theme === "joker" ? "102, 0, 197" : "255, 215, 0";
    const rgbDark  = theme === "joker" ? "41, 0, 79"  : "180, 140, 0";

    const initElements = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;

      // Circuit nodes on a grid with some randomness
      const cols = 12, rows = 8;
      const nodes: typeof circuitNodesRef.current = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.35) {
            nodes.push({
              x: (c / (cols - 1)) * W + (Math.random() - 0.5) * (W / cols) * 0.6,
              y: (r / (rows - 1)) * H + (Math.random() - 0.5) * (H / rows) * 0.6,
              connections: [],
            });
          }
        }
      }
      // Build connections (nearby nodes)
      nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
          if (i === j) return;
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < W / 6 && Math.random() > 0.5) {
            node.connections.push(j);
          }
        });
      });
      circuitNodesRef.current = nodes;

      // Floating particles
      particlesRef.current = Array.from({ length: 40 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      }));
    };

    const draw = (time: number) => {
      timeRef.current = time * 0.001;
      const t = timeRef.current;
      const rgb     = theme === "joker" ? "102, 0, 197" : "255, 215, 0";
      const rgbDark = theme === "joker" ? "41, 0, 79"   : "180, 140, 0";

      ctx.clearRect(0, 0, W, H);

      // Dark background gradient
      const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
      bgGrad.addColorStop(0,   theme === "joker" ? `rgba(${rgbDark}, 0.65)` : "rgba(6, 8, 16, 1)");
      bgGrad.addColorStop(0.5, theme === "joker" ? `rgba(${rgbDark}, 0.35)` : "rgba(3, 5, 10, 1)");
      bgGrad.addColorStop(1,   "rgba(0, 0, 0, 1)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // ── Secondary atmospheric glow (center) ──
      const centerGlow = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, Math.max(W, H) * 0.4);
      centerGlow.addColorStop(0, `rgba(${rgb}, 0.04)`);
      centerGlow.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, W, H);

      // ── Hex grid overlay ──
      const hexSize = 60;
      const hexW = hexSize * 2;
      const hexH = Math.sqrt(3) * hexSize;
      ctx.strokeStyle = `rgba(${rgb}, 0.045)`;
      ctx.lineWidth = 0.9;
      for (let row = -1; row < H / hexH + 2; row++) {
        for (let col = -1; col < W / hexW + 2; col++) {
          const xOffset = row % 2 === 0 ? 0 : hexW * 0.75;
          const cx = col * hexW * 1.5 + xOffset;
          const cy = row * hexH;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const hx = cx + hexSize * Math.cos(angle);
            const hy = cy + hexSize * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // ── Circuit traces ──
      const nodes = circuitNodesRef.current;
      nodes.forEach((node, i) => {
        node.connections.forEach((j) => {
          const other = nodes[j];
          const pulsePhase = (t * 0.5 + i * 0.3) % 1;
          const grad = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
          grad.addColorStop(0, `rgba(${rgb}, 0.06)`);
          grad.addColorStop(Math.max(0, pulsePhase - 0.15), `rgba(${rgb}, 0.06)`);
          grad.addColorStop(pulsePhase, `rgba(${rgb}, 0.35)`);
          grad.addColorStop(Math.min(1, pulsePhase + 0.15), `rgba(${rgb}, 0.06)`);
          grad.addColorStop(1, `rgba(${rgb}, 0.06)`);
          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.0;

          const midX = (node.x + other.x) / 2;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(midX, node.y);
          ctx.lineTo(midX, other.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        });

        const nodePulse = Math.sin(t * 1.5 + i * 0.7) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5 + nodePulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${0.25 + nodePulse * 0.45})`;
        ctx.fill();

        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8 + nodePulse * 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rgb}, ${0.08 + nodePulse * 0.12})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // ── Floating particles ──
      particlesRef.current.forEach((p) => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        p.pulse += p.pulseSpeed;
        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx.fill();
      });

      // ── Vertical scan beam ──
      const scanX = ((t * 0.08) % 1.4 - 0.2) * W;
      const scanGrad = ctx.createLinearGradient(scanX - 100, 0, scanX + 100, 0);
      scanGrad.addColorStop(0, `rgba(${rgb}, 0)`);
      scanGrad.addColorStop(0.5, `rgba(${rgb}, 0.05)`);
      scanGrad.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = scanGrad;
      ctx.fillRect(scanX - 100, 0, 200, H);

      // ── Horizontal scanlines ──
      for (let y = 0; y < H; y += 4) {
        ctx.fillStyle = "rgba(0,0,0,0.06)";
        ctx.fillRect(0, y, W, 1);
      }

      // ── Data stream columns ──
      const streamCols = Math.floor(W / 24);
      for (let c = 0; c < streamCols; c += 3) {
        const streamT = (t * 0.3 + c * 0.17) % 1;
        if (streamT > 0.85) {
          const streamY = streamT * H * 1.4;
          const streamOpacity = (1 - streamT) * 0.15;
          ctx.fillStyle = `rgba(${rgb}, ${streamOpacity})`;
          ctx.font = "10px 'Space Grotesk', monospace";
          const chars = "01BTWK∑ΦΩΔΓΛ";
          ctx.fillText(chars[Math.floor(t * 20 + c) % chars.length], c * 24 + 8, streamY % H);
        }
      }

      // ── Corner bracket glows ──
      const cornerSize = Math.min(W, H) * 0.08;
      const cornerAlpha = 0.15 + 0.08 * Math.sin(t * 1.2);
      [
        [0, 0, 1, 1],
        [W, 0, -1, 1],
        [0, H, 1, -1],
        [W, H, -1, -1],
      ].forEach(([cx, cy, sx, sy]) => {
        ctx.strokeStyle = `rgba(${rgb}, ${cornerAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy + sy * cornerSize);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + sx * cornerSize, cy);
        ctx.stroke();
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    initElements();
    window.addEventListener("resize", initElements);
    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", initElements);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1, pointerEvents: "none" }}
    />
  );
}
