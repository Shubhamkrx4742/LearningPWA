import React, { useState } from "react";

const challenges = [
  {
    sequence:
      "2, 6, 12, 20, 30, ?",

    options: [
      "36",
      "40",
      "42",
      "44",
    ],

    answer: "42",

    explanation:
      "The differences are +4, +6, +8, +10. The next difference is +12, so 30 + 12 = 42.",
  },

  {
    sequence:
      "1, 1, 2, 3, 5, 8, ?",

    options: [
      "11",
      "12",
      "13",
      "15",
    ],

    answer: "13",

    explanation:
      "Each number is the sum of the previous two numbers: 5 + 8 = 13.",
  },

  {
    sequence:
      "3, 9, 27, 81, ?",

    options: [
      "162",
      "243",
      "324",
      "729",
    ],

    answer: "243",

    explanation:
      "Each number is multiplied by 3.",
  },

  {
    sequence:
      "1, 4, 9, 16, 25, ?",

    options: [
      "30",
      "32",
      "36",
      "49",
    ],

    answer: "36",

    explanation:
      "These are perfect squares: 1², 2², 3², 4², 5², 6².",
  },

  {
    sequence:
      "2, 3, 5, 7, 11, ?",

    options: [
      "12",
      "13",
      "15",
      "17",
    ],

    answer: "13",

    explanation:
      "The sequence contains prime numbers.",
  },
];

function PatternBreaker({ onBack, onScore }) {
  const [index, setIndex] =
    useState(0);

  const [selected, setSelected] =
    useState(null);

  const [answered, setAnswered] =
    useState(false);

  const challenge =
    challenges[index];

  const chooseAnswer = (option) => {
    if (answered) return;

    setSelected(option);
    setAnswered(true);

    if (option === challenge.answer) {
      onScore(15, true);
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
            PATTERN RECOGNITION
          </span>

          <h1>
            🔢 Pattern Breaker
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
        <div className="challenge-card pattern-card">
          <span className="challenge-number">
            PATTERN {index + 1}
          </span>

          <p className="pattern-question">
            What comes next?
          </p>

          <div className="number-sequence">
            {challenge.sequence}
          </div>

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
                      chooseAnswer(option)
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
                  ? "⚡ Pattern Detected!"
                  : "🔍 Pattern Missed"}
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
                  ? "Finish Patterns"
                  : "Next Pattern →"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PatternBreaker;