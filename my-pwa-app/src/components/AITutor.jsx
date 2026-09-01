import React, { useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:8000";

function AITutor({ book, lesson }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ==================================================
  // SAFE FALLBACK TITLES
  // ==================================================

  const currentBookTitle =
    book?.title || "LearnHub General Dashboard";

  const currentLessonTitle =
    lesson?.title || "General Assistance";

  // ==================================================
  // INITIAL GREETING
  // ==================================================

  const getInitialMessage = () => {
    if (lesson) {
      return `Hi! 👋 I'm your LearnHub AI Tutor.

You're currently learning "${lesson.title}".

Ask me anything about this chapter, or simply type a topic like "React", "Python", or "JavaScript" and I'll teach you about it.`;
    }

    return `Hi! 👋 I'm your LearnHub AI Tutor.

How can I help you with your learning journey today?

You can ask me a question or simply type a topic such as "React", "Python", "JavaScript", "SQL", or "Machine Learning" and I'll explain it to you.`;
  };

  // ==================================================
  // RESET CHAT WHEN COURSE / CHAPTER CHANGES
  // ==================================================

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: getInitialMessage(),
      },
    ]);

    setInput("");
    setLoading(false);
  }, [lesson?.title, book?.id]);

  // ==================================================
  // SCROLL TO LATEST MESSAGE
  // ==================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  // ==================================================
  // BUILD CHAPTER CONTEXT
  // ==================================================

  const getChapterContent = () => {
    if (!lesson) {
      return `
General LearnHub dashboard view.

There is currently no active chapter selected.

The student may ask general educational or programming
questions.
`;
    }

    return `
Chapter Title:
${lesson?.title || "Not specified"}

Chapter Description:
${lesson?.description || "Not specified"}

Chapter Content:
${lesson?.content || "No chapter content available"}

Example Code:
${lesson?.code || "No example code available"}
`;
  };

  // ==================================================
  // SEND MESSAGE
  // ==================================================

  const sendMessage = async (question = null) => {
    const rawMessage =
      question !== null ? question : input;

    const message =
      typeof rawMessage === "string"
        ? rawMessage.trim()
        : "";

    // Prevent empty / duplicate requests
    if (!message || loading) {
      return;
    }

    // --------------------------------------------------
    // ADD USER MESSAGE IMMEDIATELY
    // --------------------------------------------------

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      console.log("=================================");
      console.log("LEARNHUB AI TUTOR");
      console.log("=================================");
      console.log("API:", `${API_URL}/api/tutor/chat`);
      console.log(
        "Course:",
        book?.title || "General LearnHub"
      );
      console.log(
        "Chapter:",
        lesson?.title || "General Dashboard"
      );
      console.log("Question:", message);
      console.log("=================================");

      // ==================================================
      // CALL BACKEND
      // ==================================================

      const response = await fetch(
        `${API_URL}/api/tutor/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message,

            courseTitle:
              book?.title || "General LearnHub",

            chapterTitle:
              lesson?.title || "General Dashboard",

            chapterContent:
              getChapterContent(),
          }),
        }
      );

      // ==================================================
      // READ RESPONSE
      // ==================================================

      const text = await response.text();

      let data = null;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(
          "Invalid JSON returned by backend:",
          text
        );

        throw new Error(
          "The backend returned an invalid response."
        );
      }

      console.log(
        "AI Tutor response:",
        data
      );

      // ==================================================
      // HANDLE HTTP ERROR
      // ==================================================

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Request failed with status ${response.status}`
        );
      }

      // ==================================================
      // HANDLE API ERROR
      // ==================================================

      if (!data?.success) {
        throw new Error(
          data?.error ||
            data?.message ||
            "AI Tutor failed to generate a response."
        );
      }

      // ==================================================
      // GET AI ANSWER
      // ==================================================

      const answer =
        data?.answer?.trim() ||
        "Sorry, I couldn't generate a response.";

      // ==================================================
      // ADD AI RESPONSE
      // ==================================================

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: answer,
        },
      ]);

    } catch (error) {
      console.error("=================================");
      console.error("AI TUTOR FRONTEND ERROR");
      console.error("=================================");
      console.error(error);

      let errorMessage;

      // --------------------------------------------------
      // CONNECTION ERROR
      // --------------------------------------------------

      if (
        error instanceof TypeError ||
        error?.message === "Failed to fetch"
      ) {
        errorMessage = `Unable to connect to the LearnHub backend.

Please make sure the backend is running at:

${API_URL}

Then try again.`;
      }

      // --------------------------------------------------
      // OTHER ERROR
      // --------------------------------------------------

      else {
        errorMessage = `Sorry, I couldn't get a response from the AI Tutor.

${error?.message || "Unknown error occurred."}`;
      }

      // --------------------------------------------------
      // SHOW ERROR INSIDE CHAT
      // --------------------------------------------------

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);

      // Focus input after response
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  // ==================================================
  // ENTER KEY
  // ==================================================

  const handleKeyDown = (event) => {
    // Enter = Send
    // Shift + Enter = New line

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (!loading && input.trim()) {
        sendMessage();
      }
    }
  };

  // ==================================================
  // QUICK QUESTION
  // ==================================================

  const askQuickQuestion = (question) => {
    if (loading) {
      return;
    }

    sendMessage(question);
  };

  // ==================================================
  // CLEAR CHAT
  // ==================================================

  const clearChat = () => {
    if (loading) {
      return;
    }

    setMessages([
      {
        role: "assistant",
        content: lesson
          ? `Chat cleared. 🧹

I'm ready to help you with "${lesson.title}".

You can ask me a question or type a topic you want to learn.`
          : `Chat cleared. 🧹

I'm ready to help you with your learning journey.

What would you like to learn?`,
      },
    ]);

    setInput("");

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // ==================================================
  // OPEN TUTOR
  // ==================================================

  const openTutor = () => {
    setIsOpen(true);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // ==================================================
  // CLOSE TUTOR
  // ==================================================

  const closeTutor = () => {
    setIsOpen(false);
  };

  // ==================================================
  // QUICK QUESTIONS
  // ==================================================

  const quickQuestions = lesson
    ? [
        {
          icon: "💡",
          label: "Explain simply",
          question: `Explain "${lesson.title}" in simple words.`,
        },
        {
          icon: "📝",
          label: "Give example",
          question:
            "Give me a simple practical example related to this chapter.",
        },
        {
          icon: "🎯",
          label: "Key points",
          question:
            "What are the most important things I should remember from this chapter?",
        },
      ]
    : [
        {
          icon: "💡",
          label: "Explain React",
          question: "React",
        },
        {
          icon: "🐍",
          label: "Explain Python",
          question: "Python",
        },
        {
          icon: "⚡",
          label: "Explain JavaScript",
          question: "JavaScript",
        },
      ];

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <>
      {/* =================================================
          FLOATING BUTTON
      ================================================= */}

      {!isOpen && (
        <button
          type="button"
          className="ai-tutor-floating-button"
          onClick={openTutor}
          aria-label="Open LearnHub AI Tutor"
          title="Open AI Tutor"
        >
          <span className="ai-tutor-floating-icon">
            🤖
          </span>

          <span className="ai-tutor-floating-text">
            AI Tutor
          </span>
        </button>
      )}

      {/* =================================================
          AI TUTOR PANEL
      ================================================= */}

      {isOpen && (
        <div
          className="ai-tutor-panel"
          role="dialog"
          aria-label="LearnHub AI Tutor"
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="ai-tutor-header">
            <div className="ai-tutor-header-left">
              <div className="ai-tutor-avatar">
                🤖
              </div>

              <div>
                <strong>
                  LearnHub AI Tutor
                </strong>

                <span>
                  {currentLessonTitle}
                </span>
              </div>
            </div>

            <div className="ai-tutor-header-actions">
              {/* CLEAR */}
              <button
                type="button"
                onClick={clearChat}
                title="Clear chat"
                aria-label="Clear chat"
                disabled={loading}
              >
                ↻
              </button>

              {/* CLOSE */}
              <button
                type="button"
                onClick={closeTutor}
                title="Close AI Tutor"
                aria-label="Close AI Tutor"
              >
                ×
              </button>
            </div>
          </div>

          {/* =================================================
              COURSE / CHAPTER CONTEXT
          ================================================= */}

          <div className="ai-tutor-context">
            <span>📚</span>

            <div>
              <strong>
                {currentBookTitle}
              </strong>

              <small>
                {currentLessonTitle}
              </small>
            </div>
          </div>

          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="ai-tutor-messages">
            {messages.map((message, index) => {
              const isUser =
                message.role === "user";

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={
                    isUser
                      ? "ai-tutor-message-row user"
                      : "ai-tutor-message-row"
                  }
                >
                  {/* AI AVATAR */}

                  {!isUser && (
                    <div className="ai-message-avatar">
                      🤖
                    </div>
                  )}

                  {/* MESSAGE */}

                  <div
                    className={
                      isUser
                        ? "ai-tutor-message user-message"
                        : "ai-tutor-message"
                    }
                    style={{
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="ai-tutor-message-row">
                <div className="ai-message-avatar">
                  🤖
                </div>

                <div className="ai-tutor-message ai-loading-message">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* =================================================
              QUICK QUESTIONS
          ================================================= */}

          {messages.length <= 1 &&
            !loading && (
              <div className="ai-tutor-quick-questions">
                {quickQuestions.map(
                  (item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        askQuickQuestion(
                          item.question
                        )
                      }
                      disabled={loading}
                    >
                      {item.icon}{" "}
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}

          {/* =================================================
              INPUT
          ================================================= */}

          <div className="ai-tutor-input-area">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder={
                lesson
                  ? "Ask about this chapter or type a topic..."
                  : "Ask a question or type a topic..."
              }
              rows={1}
              disabled={loading}
              aria-label="Ask LearnHub AI Tutor"
            />

            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={
                loading ||
                !input.trim()
              }
              aria-label="Send message"
              title={
                loading
                  ? "AI is thinking..."
                  : "Send message"
              }
            >
              {loading ? "..." : "➤"}
            </button>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="ai-tutor-footer">
            LearnHub AI can make mistakes.
            Verify important information.
          </div>
        </div>
      )}
    </>
  );
}

export default AITutor;