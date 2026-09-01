import React, { useEffect, useState } from "react";
import CodeBreaker from "./CodeBreaker";
import DebugDetective from "./DebugDetective";
import LogicChallenge from "./LogicChallenge";
import PatternBreaker from "./PatternBreaker";

function BrainGames({ onClaimXP }) {
  const [activeGame, setActiveGame] = useState("home");
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem("learnhub_game_stats");
      return saved ? JSON.parse(saved) : { totalScore: 0, gamesPlayed: 0, challengesSolved: 0 };
    } catch {
      return { totalScore: 0, gamesPlayed: 0, challengesSolved: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem("learnhub_game_stats", JSON.stringify(stats));
  }, [stats]);

  const addScore = (points, solved = true) => {
    setStats((previous) => ({
      ...previous,
      totalScore: previous.totalScore + points,
      gamesPlayed: previous.gamesPlayed + 1,
      challengesSolved: solved ? previous.challengesSolved + 1 : previous.challengesSolved,
    }));
  };

  // Claim earned game XP and send it to main header balance
  const handleClaimReward = () => {
    if (stats.totalScore <= 0) {
      alert("No XP to claim yet! Play some challenges first.");
      return;
    }
    
    if (onClaimXP) {
      onClaimXP(stats.totalScore);
    }

    // Reset game stats score back to zero after claiming
    setStats((prev) => ({
      ...prev,
      totalScore: 0,
    }));

    alert("🎉 Successfully claimed your XP into your main account balance!");
  };

  const games = [
    { id: "code-breaker", icon: "💻", title: "Code Breaker", description: "Predict tricky code output and test your programming intuition.", difficulty: "Advanced", points: "10–30 XP" },
    { id: "debug-detective", icon: "🐛", title: "Debug Detective", description: "Inspect real code and identify subtle bugs before they cause problems.", difficulty: "Intermediate", points: "10–30 XP" },
    { id: "logic-challenge", icon: "🧠", title: "Logic Challenge", description: "Solve reasoning puzzles designed to test deduction and analytical thinking.", difficulty: "Hard", points: "15–40 XP" },
    { id: "pattern-breaker", icon: "🔢", title: "Pattern Breaker", description: "Find hidden mathematical and logical patterns.", difficulty: "Hard", points: "10–35 XP" },
  ];

  return (
    <div className="brain-games-page">
      <section className="games-hero">
        <div className="games-hero-content">
          <span className="games-eyebrow">LEARNHUB CHALLENGES</span>
          <h1>Train Your Mind.<br />Think Like a Problem Solver.</h1>
          <p>Challenging games for developers and adult learners. No childish quizzes — just logic, debugging, patterns, and analytical thinking.</p>
        </div>
        <div className="games-hero-brain">🧠</div>
      </section>

      {/* STATS & CLAIM SECTION */}
      <section className="games-stats" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <div className="game-stat-card" style={{ flex: 1 }}>
          <span>⚡</span>
          <div><strong>{stats.totalScore}</strong><small>Total XP</small></div>
        </div>
        <div className="game-stat-card" style={{ flex: 1 }}>
          <span>🎮</span>
          <div><strong>{stats.gamesPlayed}</strong><small>Games Played</small></div>
        </div>
        <div className="game-stat-card" style={{ flex: 1 }}>
          <span>🏆</span>
          <div><strong>{stats.challengesSolved}</strong><small>Challenges Solved</small></div>
        </div>

        {/* Claim XP Button */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            type="button" 
            onClick={handleClaimReward}
            style={{ 
              background: stats.totalScore > 0 ? '#16a34a' : '#cbd5e1', 
              color: 'white', 
              border: 'none', 
              padding: '16px 24px', 
              borderRadius: '16px', 
              fontWeight: '800', 
              cursor: stats.totalScore > 0 ? 'pointer' : 'not-allowed',
              boxShadow: stats.totalScore > 0 ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🏆 Claim {stats.totalScore} XP
          </button>
        </div>
      </section>

      <section className="games-section">
        <div className="games-section-heading">
          <div>
            <span className="section-label">BRAIN TRAINING</span>
            <h2>Choose Your Challenge</h2>
          </div>
        </div>
        <div className="games-grid">
          {games.map((game) => (
            <button type="button" key={game.id} className="game-card" onClick={() => setActiveGame(game.id)}>
              <div className="game-card-top">
                <div className="game-icon">{game.icon}</div>
                <span className="game-difficulty">{game.difficulty}</span>
              </div>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <div className="game-card-footer">
                <span>⚡ {game.points}</span>
                <span className="play-game">Play →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="games-info">
        <div>
          <span>🎯</span>
          <div>
            <strong>Designed for thinkers</strong>
            <p>Improve reasoning, debugging, pattern recognition and computational thinking.</p>
          </div>
        </div>
        <div>
          <span>🔥</span>
          <div>
            <strong>No easy mode</strong>
            <p>These challenges are designed to make you pause and think.</p>
          </div>
        </div>
      </section>

      {activeGame !== "home" && (
        <div className="game-modal-overlay" onClick={() => setActiveGame("home")}>
          <div className="game-modal-container" onClick={(e) => e.stopPropagation()}>
            {activeGame === "code-breaker" && <CodeBreaker onBack={() => setActiveGame("home")} onScore={addScore} />}
            {activeGame === "debug-detective" && <DebugDetective onBack={() => setActiveGame("home")} onScore={addScore} />}
            {activeGame === "logic-challenge" && <LogicChallenge onBack={() => setActiveGame("home")} onScore={addScore} />}
            {activeGame === "pattern-breaker" && <PatternBreaker onBack={() => setActiveGame("home")} onScore={addScore} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default BrainGames;