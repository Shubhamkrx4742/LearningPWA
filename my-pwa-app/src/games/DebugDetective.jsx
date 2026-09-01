import React, { useState } from "react";

const challenges = [
  {
    title:
      "The Missing Return",

    description:
      "This function should return the sum of two numbers.",

    code: `function add(a, b) {
  a + b;
}

console.log(add(2, 3));`,

    options: [
      "The function is missing a return statement.",
      "The parameters should be strings.",
      "console.log cannot print functions.",
      "The function needs async.",
    ],

    answer:
      "The function is missing a return statement.",

    explanation:
      "The expression a + b is calculated but never returned. JavaScript functions return undefined when no return statement is provided.",
  },

  {
    title:
      "The Infinite Loop",

    description:
      "Find the problem.",

    code: `let i = 0;

while (i < 5) {
  console.log(i);
}`,

    options: [
      "i is never incremented.",
      "while cannot use comparison operators.",
      "console.log stops the loop.",
      "i must start at 1.",
    ],

    answer:
      "i is never incremented.",

    explanation:
      "The condition i < 5 always remains true because i never changes.",
  },

  {
    title:
      "Reference Confusion",

    description:
      "Why does changing b also change a?",

    code: `const a = {
  name: "LearnHub"
};

const b = a;

b.name = "Changed";

console.log(a.name);`,

    options: [
      "Objects are passed by reference.",
      "const automatically copies objects.",
      "The code creates two independent objects.",
      "console.log modifies a.",
    ],

    answer:
      "Objects are passed by reference.",

    explanation:
      "Both variables point to the same object in memory. Changing the object through b affects the object referenced by a.",
  },

  {
    title:
      "Async Surprise",

    description:
      "What is the bug in this asynchronous code?",

    code: `function getData() {
  fetch("/api/data")
    .then(response => {
      response.json();
    });
}`,

    options: [
      "response.json() is not returned.",
      "fetch cannot use .then().",
      "The URL must be HTTPS.",
      "The function must be a class.",
    ],

    answer:
      "response.json() is not returned.",

    explanation:
      "The response.json() promise should be returned so the next promise in a chain can receive the parsed data.",
  },
];

function DebugDetective({ onBack, onScore }) {
  const [index, setIndex] =
    useState(0);

  const [selected, setSelected] =
    useState(null);

  const [answered, setAnswered] =
    useState(false);

  const challenge =
    challenges[index];

  const handleSelect = (option) => {
    if (answered) return;

    setSelected(option);
    setAnswered(true);

    if (option === challenge.answer) {
      onScore(25, true);
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
            DEBUGGING
          </span>

          <h1>
            🐛 Debug Detective
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
        <div className="challenge-card">
          <span className="challenge-number">
            CASE #{index + 1}
          </span>

          <h2>
            {challenge.title}
          </h2>

          <p className="challenge-description">
            {challenge.description}
          </p>

          <pre className="challenge-code">
            <code>
              {challenge.code}
            </code>
          </pre>

          <h3 className="detective-question">
            What is the problem?
          </h3>

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
                      handleSelect(option)
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
                  ? "🔎 Bug Found!"
                  : "🔍 Keep Looking"}
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
                  ? "Finish Investigation"
                  : "Next Case →"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DebugDetective;