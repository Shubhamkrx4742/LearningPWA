const API_URL = "http://localhost:8000";

function getToken() {
  return localStorage.getItem(
    "learnhub_token"
  );
}

// ==================================================
// GET PROGRESS
// ==================================================

export async function getCourseProgress(
  courseId
) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/api/progress/course/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Unable to load progress"
    );
  }

  return data;
}

// ==================================================
// COMPLETE CHAPTER
// ==================================================

export async function completeChapter({
  courseId,
  chapterId,
  rating,
  feedback,
}) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/api/progress/course/${courseId}/chapters/${chapterId}/complete`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        rating,
        feedback,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Unable to complete chapter"
    );
  }

  return data;
}

// ==================================================
// CERTIFICATE
// ==================================================

export async function getCertificate(
  courseId
) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/api/certificates/course/${courseId}`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Unable to get certificate"
    );
  }

  return data;
}