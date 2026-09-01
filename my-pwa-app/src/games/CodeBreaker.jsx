import React, { useState } from "react";

const challenges = [
  {
    question:
      "What will the following JavaScript code print?",

    code: `console.log([] == ![]);`,

    options: [
      "true",
      "false",
      "undefined",
      "TypeError",
    ],

    answer: "true",

    explanation:
      "The expression is tricky because JavaScript performs type coercion. ![] becomes false, and [] is converted during loose equality comparison, ultimately resulting in true.",
  },

  {
    question:
      "What will this code print?",

    code: `console.log(typeof null);`,

    options: [
      "null",
      "object",
      "undefined",
      "boolean",
    ],

    answer: "object",

    explanation:
      'This is a historical JavaScript behavior. typeof null returns "object" even though null is a primitive value.',
  },

  {
    question:
      "What is the output?",

    code: `console.log(1 + "2" + 3);`,

    options: [
      "6",
      "123",
      "15",
      "NaN",
    ],

    answer: "123",

    explanation:
      "JavaScript evaluates left to right. 1 + '2' becomes the string '12', then '12' + 3 becomes '123'.",
  },

  {
    question:
      "What will this return?",

    code: `console.log(Boolean("false"));`,

    options: [
      "true",
      "false",
      "undefined",
      "Error",
    ],

    answer: "true",

    explanation:
      'Any non-empty string is truthy in JavaScript, including the string "false".',
  },

  {
    question:
      "What is printed?",

    code: `let x = 5;

{
  let x = 10;
}

console.log(x);`,

    options: [
      "10",
      "5",
      "undefined",
      "Error",
    ],

    answer: "5",

    explanation:
      "The second x exists only inside its block because let has block scope.",
  },
];

function CodeBreaker({ onBack, onScore }) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [answered, setAnswered] =
    useState(false);

  const challenge =
    challenges[currentIndex];

  const handleAnswer = (option) => {
    if (answered) return;

    setSelectedAnswer(option);
    setAnswered(true);

    const correct =
      option === challenge.answer;

    if (correct) {
      onScore(20, true);
    } else {
      onScore(0, false);
    }
  };

  const nextChallenge = () => {
    if (
      currentIndex <
      challenges.length - 1
    ) {
      setCurrentIndex(
        (previous) => previous + 1
      );

      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      onBack();
    }
  };

  const isCorrect =
    selectedAnswer === challenge.answer;

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
            CODE THINKING
          </span>

          <h1>
            💻 Code Breaker
          </h1>
        </div>

        <div className="game-progress">
          {currentIndex + 1} /
          {challenges.length}
        </div>
      </div>

      <div className="game-progress-bar">
        <span
          style={{
            width: `${
              ((currentIndex + 1) /
                challenges.length) *
              100
            }%`,
          }}
        />
      </div>

      <main className="challenge-container">
        <div className="challenge-card">
          <span className="challenge-number">
            Challenge{" "}
            {currentIndex + 1}
          </span>

          <h2>
            {challenge.question}
          </h2>

          <pre className="challenge-code">
            <code>
              {challenge.code}
            </code>
          </pre>

          <div className="challenge-options">
            {challenge.options.map(
              (option) => {
                let className =
                  "challenge-option";

                if (
                  selectedAnswer === option
                ) {
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
                  selectedAnswer === option &&
                  option !== challenge.answer
                ) {
                  className += " incorrect";
                }

                return (
                  <button
                    type="button"
                    key={option}
                    className={className}
                    onClick={() =>
                      handleAnswer(option)
                    }
                    disabled={answered}
                  >
                    {option}
                  </button>
                );
              }
            )}
          </div>

          {answered && (
            <div
              className={
                isCorrect
                  ? "game-result correct-result"
                  : "game-result incorrect-result"
              }
            >
              <h3>
                {isCorrect
                  ? "✓ Correct!"
                  : "✕ Not quite."}
              </h3>

              <p>
                {challenge.explanation}
              </p>

              <button
                type="button"
                className="next-challenge-button"
                onClick={nextChallenge}
              >
                {currentIndex ===
                challenges.length - 1
                  ? "Finish Game"
                  : "Next Challenge →"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CodeBreaker;