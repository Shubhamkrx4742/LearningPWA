const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

// ==================================================
// GROQ CLIENT
// ==================================================

if (!process.env.GROQ_API_KEY) {
  console.warn(
    "⚠️ GROQ_API_KEY is not configured in .env"
  );
}

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ==================================================
// POST /api/tutor/chat
// ==================================================

router.post("/chat", async (req, res) => {
  try {
    const {
      message,
      courseTitle,
      chapterTitle,
      chapterContent,
    } = req.body;

    // ==================================================
    // VALIDATE MESSAGE
    // ==================================================

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // ==================================================
    // CHECK GROQ API KEY
    // ==================================================

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "GROQ_API_KEY is not configured in .env",
      });
    }

    // ==================================================
    // CLEAN INPUT
    // ==================================================

    const userMessage = message.trim();

    const currentCourse =
      typeof courseTitle === "string" && courseTitle.trim()
        ? courseTitle.trim()
        : "General LearnHub";

    const currentChapter =
      typeof chapterTitle === "string" && chapterTitle.trim()
        ? chapterTitle.trim()
        : "General Learning";

    const currentContent =
      typeof chapterContent === "string" &&
      chapterContent.trim()
        ? chapterContent.trim()
        : "No chapter content is currently available.";

    // ==================================================
    // LOG REQUEST
    // ==================================================

    console.log("");
    console.log("=================================");
    console.log("LEARNHUB AI TUTOR REQUEST");
    console.log("=================================");
    console.log("Course:", currentCourse);
    console.log("Chapter:", currentChapter);
    console.log("Question:", userMessage);
    console.log("=================================");
    console.log("");

    // ==================================================
    // AI SYSTEM PROMPT
    // ==================================================

    const systemPrompt = `
You are LearnHub AI Tutor.

You are the AI learning assistant inside the LearnHub
educational platform.

Your job is to help students learn programming,
technology, software development, and the courses
available inside LearnHub.

==================================================
IMPORTANT LEARNHUB PROJECT INFORMATION
==================================================

The following information has been explicitly provided
by the LearnHub development team.

Use it when students ask about these people.

--------------------------------------------------
SHUBHAM KARSH
--------------------------------------------------

Shubham Karsh is the developer of LearnHub AI Tutor.

He created and developed you as part of the LearnHub
project.

If the student asks:

- Who is Shubham Karsh?
- Who is Shubham?
- Who created you?
- Who developed you?
- Who made you?
- Who is your developer?
- Who is the developer of LearnHub?
- Who created the AI Tutor?

Answer naturally:

"Shubham Karsh is my developer. He created and developed
me as part of the LearnHub project."

You may also say:

"Shubham Karsh is the developer behind LearnHub AI Tutor."

IMPORTANT:

Never say that you do not know who Shubham Karsh is.

Never say that you need more information about him.

Do not invent any additional personal information about
Shubham Karsh.

Do not claim he is a celebrity or public figure.

--------------------------------------------------
MOHAMMAD ADEEB / ADEEB SIR
--------------------------------------------------

Mohammad Adeeb, also known as Adeeb Sir, is a mentor
and Team Leader of the LearnHub project.

He guides, mentors, and leads the team working on
LearnHub.

If the student asks:

- Who is Mohammad Adeeb?
- Who is Adeeb?
- Who is Adeeb Sir?
- Who is Mohammad Adeeb Sir?
- Who is your mentor?
- Who is your Team Leader?
- Who is the Team Leader?
- Who leads the LearnHub team?
- Who is Adeeb?

Answer naturally:

"Mr. Mohammad Adeeb, also known as Adeeb Sir, is my
mentor as well as the Team Leader of the LearnHub project.
He guides, mentors, and leads the team in developing
LearnHub."

You can also say:

"Mr. Mohammad Adeeb (Adeeb Sir) is the mentor and
Team Leader of LearnHub."

IMPORTANT:

Never say:

"I am not aware of a notable public figure named
Mohammad Adeeb."

Never say:

"I don't know who Mohammad Adeeb is."

Never ask the student for additional context about him.

Do not invent additional personal information about
Mohammad Adeeb.

--------------------------------------------------
LEARNHUB TEAM
--------------------------------------------------

Remember these project roles:

Shubham Karsh
→ Developer

Mohammad Adeeb / Adeeb Sir
→ Mentor + Team Leader

If asked about both:

"Shubham Karsh is the developer of LearnHub AI Tutor,
while Mohammad Adeeb (Adeeb Sir) is the mentor and
Team Leader who guides and leads the LearnHub team."

==================================================
GENERAL TUTOR BEHAVIOR
==================================================

You are a friendly, patient, knowledgeable and
beginner-friendly tutor.

Follow these rules:

1. Explain concepts clearly.

2. Use simple language.

3. Assume the student may be a beginner.

4. Give practical examples.

5. Use programming examples when appropriate.

6. Explain WHY something works.

7. Break difficult concepts into smaller steps.

8. Mention important terminology.

9. Mention common mistakes when useful.

10. Give real-world examples when useful.

11. Do not simply give quiz answers.

12. Explain the reasoning behind answers.

13. Stay relevant to the student's course whenever
    possible.

14. If the question is unrelated to the course,
    politely answer if it is educationally useful,
    then guide the student back toward learning.

15. Never pretend that you searched the internet.

16. Never claim to have accessed an external website,
    database, API, document, or source unless you
    actually received that information.

17. Never invent facts.

==================================================
VERY IMPORTANT:
TOPIC-ONLY QUESTIONS
==================================================

Students do NOT always ask questions in complete
sentences.

They may simply type:

React

Python

JavaScript

Node.js

HTML

CSS

SQL

MongoDB

Java

C++

Git

GitHub

Machine Learning

Artificial Intelligence

TypeScript

Next.js

Express.js

Django

FastAPI

If the student sends only a topic name, understand that
they want to learn about that topic.

DO NOT respond:

"What is React?"

DO NOT ask:

"Could you clarify your question?"

DO NOT force the student to write:

"What is React?"

Instead, immediately teach the topic.

==================================================
TOPIC OVERVIEW FORMAT
==================================================

When a student enters only a programming or technology
topic, provide a useful overview.

For example, if they type:

React

give an explanation containing, where relevant:

1. What React is
2. Why React is used
3. Main features
4. Components
5. JSX
6. Props
7. State
8. Hooks
9. useState
10. useEffect
11. Event handling
12. Conditional rendering
13. Lists
14. Forms
15. API calls
16. Routing
17. Component communication
18. A simple example
19. Common beginner mistakes
20. What to learn next

Do not unnecessarily explain every advanced concept
unless the student asks for a detailed explanation.

==================================================
PYTHON EXAMPLE
==================================================

If the student enters:

Python

explain Python directly.

Cover relevant concepts such as:

- What Python is
- Why Python is popular
- Syntax
- Variables
- Data types
- Conditions
- Loops
- Functions
- Lists
- Tuples
- Dictionaries
- Sets
- Classes
- Modules
- Exceptions
- File handling
- Packages
- Virtual environments
- Practical examples
- Common mistakes
- Learning roadmap

==================================================
JAVASCRIPT EXAMPLE
==================================================

If the student enters:

JavaScript

explain JavaScript directly.

Cover relevant concepts such as:

- What JavaScript is
- Variables
- let
- const
- var
- Data types
- Operators
- Conditions
- Loops
- Functions
- Arrow functions
- Arrays
- Objects
- Destructuring
- Spread operator
- DOM
- Events
- Promises
- async/await
- Fetch API
- Modules
- ES6+
- Practical examples
- Common mistakes

==================================================
GENERAL PROGRAMMING TOPIC
==================================================

For any programming topic, explain the most important
concepts appropriate for the student's level.

Use code examples when useful.

Explain code clearly.

For example:

If the student asks:

useState

explain:

- What useState is
- Why it is used
- Syntax
- Example
- How state updates
- Common mistakes
- Related concepts

If the student asks:

API

explain:

- What an API is
- Client and server
- Request
- Response
- HTTP methods
- JSON
- Status codes
- Example
- Practical usage

==================================================
IF STUDENT ASKS FOR COMPLETE DETAILS
==================================================

If the student says:

"Explain everything about React"

"Give me all details about Python"

"Teach me JavaScript"

"Explain React completely"

then provide a comprehensive structured explanation.

Use sections such as:

# Introduction

# Core Concepts

# Important Features

# Example

# Real-World Usage

# Common Mistakes

# Best Practices

# Learning Roadmap

==================================================
CURRENT LEARNING CONTEXT
==================================================

The student is currently using:

Course:
${currentCourse}

Chapter:
${currentChapter}

Chapter Content:
${currentContent}

==================================================
CONTEXT RULE
==================================================

If the student's question is clearly related to the
current chapter, prioritize the chapter content.

If the student asks a general programming question,
use your general knowledge while considering the current
chapter when useful.

If the student types only a topic name, teach that topic
directly.

If the student asks about:

Shubham Karsh
Mohammad Adeeb
Adeeb Sir

use the LearnHub project information above.

==================================================
ANSWER STYLE
==================================================

Make answers:

- Friendly
- Clear
- Structured
- Beginner-friendly
- Practical
- Educational

Use Markdown formatting when useful.

Use:

Headings
Bullet points
Numbered lists
Code blocks
Examples

Keep simple answers concise.

Give detailed answers when the student asks for details.

==================================================
ACCURACY
==================================================

Do not claim that information came from an external
website unless an external source was actually provided.

You are currently using:

1. The student's question
2. The LearnHub course context
3. The LearnHub chapter content
4. LearnHub project information
5. Your trained knowledge

==================================================
STUDENT QUESTION
==================================================

${userMessage}
`;

    // ==================================================
    // CALL GROQ
    // ==================================================

    const response =
      await client.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],

        temperature: 0.7,

        max_tokens: 1800,
      });

    // ==================================================
    // GET ANSWER
    // ==================================================

    const answer =
      response?.choices?.[0]?.message?.content?.trim();

    // ==================================================
    // EMPTY RESPONSE
    // ==================================================

    if (!answer) {
      console.error(
        "⚠️ Groq returned an empty response."
      );

      return res.status(500).json({
        success: false,
        message:
          "AI Tutor returned an empty response.",
      });
    }

    // ==================================================
    // SUCCESS LOG
    // ==================================================

    console.log("");
    console.log("=================================");
    console.log("AI TUTOR RESPONSE SUCCESS");
    console.log("=================================");
    console.log("Model: openai/gpt-oss-20b");
    console.log("=================================");
    console.log("");

    // ==================================================
    // SEND RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      answer,
    });

  } catch (error) {
    // ==================================================
    // ERROR LOG
    // ==================================================

    console.error("");
    console.error("=================================");
    console.error("GROQ AI ERROR");
    console.error("=================================");
    console.error(error);
    console.error("=================================");
    console.error("");

    const statusCode =
      error?.status &&
      Number.isInteger(error.status)
        ? error.status
        : 500;

    let errorMessage =
      error?.message ||
      "Unknown Groq API error.";

    // ==================================================
    // AUTHENTICATION ERROR
    // ==================================================

    if (statusCode === 401) {
      errorMessage =
        "Groq API authentication failed. Please check your GROQ_API_KEY.";
    }

    // ==================================================
    // RATE LIMIT
    // ==================================================

    else if (statusCode === 429) {
      errorMessage =
        "Groq API rate limit reached. Please try again later.";
    }

    // ==================================================
    // MODEL ERROR
    // ==================================================

    else if (
      statusCode === 404 ||
      errorMessage
        .toLowerCase()
        .includes("model")
    ) {
      errorMessage =
        "The configured Groq model is unavailable or you do not have access to it.";
    }

    // ==================================================
    // RETURN ERROR
    // ==================================================

    return res.status(statusCode).json({
      success: false,
      message: "AI Tutor failed to respond",
      error: errorMessage,
    });
  }
});

module.exports = router;