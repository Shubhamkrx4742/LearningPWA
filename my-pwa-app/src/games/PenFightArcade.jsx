import React, { useEffect, useRef, useState } from "react";

function PenFightArcade({ onBack, onScore }) {
  const canvasRef = useRef(null);
  const [turn, setTurn] = useState("player"); // 'player' or 'enemy'
  const [status, setStatus] = useState("Your Turn: Click & drag backward on your blue pen to aim, then release to flick!");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Table / Desk dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Game Objects
    let player = { x: width / 2, y: height - 120, vx: 0, vy: 0, angle: 0, radius: 15, color: "#2563eb" };
    let enemy = { x: width / 2, y: 120, vx: 0, vy: 0, angle: Math.PI, radius: 15, color: "#dc2626" };

    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragCurrent = { x: 0, y: 0 };

    // Mouse / Touch Handlers for Aim & Pull-back
    const getCanvasCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onPointerDown = (e) => {
      if (turn !== "player" || gameOver) return;
      const pos = getCanvasCoords(e);
      
      // Check if clicking near player pen
      const dist = Math.hypot(pos.x - player.x, pos.y - player.y);
      if (dist < 40) {
        isDragging = true;
        dragStart = { x: player.x, y: player.y };
        dragCurrent = pos;
      }
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      dragCurrent = getCanvasCoords(e);
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;

      // Calculate vector from drag (Pulling back shoots forward)
      const dx = dragStart.x - dragCurrent.x;
      const dy = dragStart.y - dragCurrent.y;

      player.vx = dx * 0.15;
      player.vy = dy * 0.15;
      player.angle = Math.atan2(dy, dx) - Math.PI / 2;

      setTurn("enemy");
      setStatus("Enemy is taking a shot...");

      // Simulate Enemy AI turn after player stops
      setTimeout(() => {
        if (gameOver) return;
        // Enemy AI shoots towards player
        const edx = player.x - enemy.x + (Math.random() * 60 - 30);
        const edy = player.y - enemy.y + (Math.random() * 60 - 30);
        enemy.vx = edx * 0.12;
        enemy.vy = edy * 0.12;
        enemy.angle = Math.atan2(edy, edx) - Math.PI / 2;

        setTimeout(() => {
          if (!gameOver) {
            setTurn("player");
            setStatus("Your Turn: Aim and flick!");
          }
        }, 1500);
      }, 1500);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);

    // Physics Loop
    let animationFrameId;
    const updatePhysics = () => {
      // Friction slowdown
      player.vx *= 0.96;
      player.vy *= 0.96;
      enemy.vx *= 0.96;
      enemy.vy *= 0.96;

      player.x += player.vx;
      player.y += player.vy;
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;

      // Collision between pens
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      if (dist < player.radius + enemy.radius) {
        // Simple elastic collision bounce
        const tempVx = player.vx;
        const tempVy = player.vy;
        player.vx = enemy.vx * 0.8;
        player.vy = enemy.vy * 0.8;
        enemy.vx = tempVx * 0.8;
        enemy.vy = tempVy * 0.8;
      }

      // Desk Boundary Check (Out of bounds = Loss)
      const margin = 30;
      const checkBounds = (pen, isPlayer) => {
        if (pen.x < margin || pen.x > width - margin || pen.y < margin || pen.y > height - margin) {
          setGameOver(true);
          if (isPlayer) {
            setStatus("❌ Your pen fell off the desk! You lose.");
            onScore(0, false);
          } else {
            setStatus("🎉 You knocked the enemy pen off the desk! You Win!");
            onScore(50, true);
          }
        }
      };

      if (!gameOver) {
        checkBounds(player, true);
        checkBounds(enemy, false);
      }

      // Draw Desk & Game
      ctx.clearRect(0, 0, width, height);

      // Wooden Desk Background
      ctx.fillStyle = "#8B5A2B";
      ctx.fillRect(0, 0, width, height);

      // Desk Border Line (The danger edge)
      ctx.strokeStyle = "#3e2723";
      ctx.lineWidth = 12;
      ctx.strokeRect(margin / 2, margin / 2, width - margin, height - margin);

      // Draw Aim Trajectory Line if dragging
      if (isDragging) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 4;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        // Project opposite line for power/direction preview
        const previewX = player.x + (dragCurrent.x - player.x) * 2;
        const previewY = player.y + (dragCurrent.y - player.y) * 2;
        ctx.lineTo(previewX, previewY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Pen Function
      const drawPen = (pen) => {
        ctx.save();
        ctx.translate(pen.x, pen.y);
        ctx.rotate(pen.angle || 0);

        // Pen Body (Cylinder / Ballpoint shape)
        ctx.fillStyle = pen.color;
        ctx.fillRect(-8, -35, 16, 70);

        // Pen Cap / Clip Detail
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(-3, -42, 6, 12);

        // Pen Tip
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(0, 35, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      drawPen(player);
      drawPen(enemy);

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
    };
  }, [turn, gameOver]);

  return (
    <div className="game-screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#0f172a", minHeight: "100vh" }}>
      <div className="game-screen-header" style={{ width: "100%", maxWidth: "500px", display: "flex", justifyContent: "space-between", padding: "15px" }}>
        <button type="button" className="game-back-button" onClick={onBack}>← Back</button>
        <h1 style={{ color: "white", fontSize: "18px", margin: 0 }}>✏️ Pen Fight Arena</h1>
      </div>

      <div style={{ background: "#1e293b", color: "#e2e8f0", padding: "10px 20px", borderRadius: "8px", marginBottom: "15px", fontSize: "14px", textAlign: "center", maxWidth: "480px" }}>
        {status}
      </div>

      <div style={{ position: "relative", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)", borderRadius: "12px", overflow: "hidden", border: "4px solid #334155" }}>
        <canvas ref={canvasRef} width={450} height={600} style={{ display: "touch" }} />
      </div>

      {gameOver && (
        <div style={{ marginTop: "20px" }}>
          <button className="next-challenge-button" onClick={onBack}>Return to Challenges →</button>
        </div>
      )}
    </div>
  );
}

export default PenFightArcade;