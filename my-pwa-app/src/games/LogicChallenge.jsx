import React, { useState } from "react";

const challenges = [
  {
    question:
      "A developer has three switches outside a room. Inside the room are three bulbs. Each switch controls exactly one bulb. You may enter the room only once. How can you determine which switch controls each bulb?",

    options: [
      "Turn all switches on and enter the room.",
      "Turn one switch on for a few minutes, turn it off, turn another on, then enter the room.",
      "Flip each switch repeatedly.",
      "It cannot be determined.",
    ],

    answer:
      "Turn one switch on for a few minutes, turn it off, turn another on, then enter the room.",

    explanation:
      "One bulb will be on, one bulb will be off but warm, and one bulb will be off and cold. This lets you identify all three switches.",
  },

  {
    question:
      "You have two ropes. Each takes exactly 60 minutes to burn, but they burn unevenly. How can you measure exactly 45 minutes?",

    options: [
      "Burn both ropes from one end.",
      "Burn one rope from both ends and the other from one end.",
      "Burn both ropes from both ends.",
      "Cut both ropes in half.",
    ],

    answer:
      "Burn one rope from both ends and the other from one end.",

    explanation:
      "The first rope finishes in 30 minutes. At that moment, light the other end of the second rope. Its remaining burn time becomes 15 minutes, totaling 45 minutes.",
  },

  {
    question:
      "A system has five servers. Every server can communicate directly with every other server. How many direct communication connections exist?",

    options: [
      "5",
      "10",
      "20",
      "25",
    ],

    answer: "10",

    explanation:
      "The number of unique pairs is n(n−1)/2. For 5 servers: 5 × 4 / 2 = 10.",
  },

  {
    question:
      "If all Bloops are Razzies and all Razzies are Lazzies, which statement must be true?",

    options: [
      "All Lazzies are Bloops.",
      "All Bloops are Lazzies.",
      "No Bloops are Lazzies.",
      "Some Razzies cannot be Bloops.",
    ],

    answer:
      "All Bloops are Lazzies.",

    explanation:
      "This is transitive reasoning. If Bloops are inside the set of Razzies and Razzies are inside the set of Lazzies, Bloops must also be Lazzies.",
  },
];

function LogicChallenge({ onBack, onScore }) {
  const [index, setIndex] =
    useState(0);

  const [selected, setSelected] =
    useState(null);

  const [answered, setAnswered] =
    useState(false);

  const challenge =
    challenges[index];

  const answerQuestion = (option) => {
    if (answered) return;

    setSelected(option);
    setAnswered(true);

    if (option === challenge.answer) {
      onScore(30, true);
    } else {
      onScore(0, false);
    }
  };

  const next = () => {
    if (
      index <
      challenges.length - 1
    ) {
      setIndex((previous) => previous + 1);

      setSelected(null);
      setAnswered(false);
    } else {
      onBack();
    }
  };

  return (
    <div className="game-screen">
      <div className="game-screen-header">
        <button
          type="button"
          className="game-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <span className="game-type">
            ANALYTICAL THINKING
          </span>

          <h1>
            🧠 Logic Challenge
          </h1>
        </div>

        <div className="game-progress">
          {index + 1} / {challenges.length}
        </div>
      </div>

      <div className="game-progress-bar">
        <span
          style={{
            width: `${
              ((index + 1) /
                challenges.length) *
              100
            }%`,
          }}
        />
      </div>

      <main className="challenge-container">
        <div className="challenge-card logic-card">
          <span className="challenge-number">
            LOGIC PUZZLE {index + 1}
          </span>

          <div className="logic-icon">
            🧩
          </div>

          <h2>
            {challenge.question}
          </h2>

          <div className="challenge-options">
            {challenge.options.map(
              (option) => {
                let className =
                  "challenge-option";

                if (selected === option) {
                  className += " selected";
                }

                if (
                  answered &&
                  option === challenge.answer
                ) {
                  className += " correct";
                }

                if (
                  answered &&
                  selected === option &&
                  option !== challenge.answer
                ) {
                  className += " incorrect";
                }

                return (
                  <button
                    type="button"
                    key={option}
                    className={className}
                    disabled={answered}
                    onClick={() =>
                      answerQuestion(option)
                    }
                  >
                    {option}
                  </button>
                );
              }
            )}
          </div>

          {answered && (
            <div className="game-result">
              <h3>
                {selected === challenge.answer
                  ? "🧠 Excellent Reasoning!"
                  : "🤔 Think Again"}
              </h3>

              <p>
                {challenge.explanation}
              </p>

              <button
                type="button"
                className="next-challenge-button"
                onClick={next}
              >
                {index ===
                challenges.length - 1
                  ? "Finish Challenge"
                  : "Next Puzzle →"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default LogicChallenge;