import React, { useState } from "react";

const API_URL = "http://localhost:8000";

function Register({
  onRegister,
  onSwitchToLogin,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [serverError, setServerError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  // ==================================================
  // VALIDATION
  // ==================================================

  const validate = () => {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name =
        "Name is required.";
    } else if (
      name.trim().length < 2
    ) {
      nextErrors.name =
        "Name must contain at least 2 characters.";
    }

    if (!email.trim()) {
      nextErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password =
        "Password is required.";
    } else {
      if (password.length < 8) {
        nextErrors.password =
          "Password must contain at least 8 characters.";
      } else if (!/[A-Z]/.test(password)) {
        nextErrors.password =
          "Password needs at least one uppercase letter.";
      } else if (!/[a-z]/.test(password)) {
        nextErrors.password =
          "Password needs at least one lowercase letter.";
      } else if (!/[0-9]/.test(password)) {
        nextErrors.password =
          "Password needs at least one number.";
      }
    }

    if (
      confirmPassword !== password
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  // ==================================================
  // REGISTER
  // ==================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        if (data.errors) {
          setErrors(data.errors);
        }

        throw new Error(
          data.message ||
            "Registration failed."
        );
      }

      localStorage.setItem(
        "learnhub_token",
        data.token
      );

      localStorage.setItem(
        "learnhub_user",
        JSON.stringify(data.user)
      );

      onRegister(data.user);
    } catch (error) {
      setServerError(
        error.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <img
            src="/learnhub-logo.png"
            alt="LearnHub"
          />
        </div>

        <div className="auth-heading">
          <span>START LEARNING</span>

          <h1>
            Create your account
          </h1>

          <p>
            Join LearnHub and start learning.
          </p>
        </div>

        {serverError && (
          <div className="auth-error">
            {serverError}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label>
              Full name
            </label>

            <input
              type="text"
              value={name}
              placeholder="Your name"
              autoComplete="name"
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
            />

            {errors.name && (
              <small className="field-error">
                {errors.name}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              autoComplete="email"
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
            />

            {errors.email && (
              <small className="field-error">
                {errors.email}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>
              Password
            </label>

            <div className="password-wrapper">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                placeholder="Create a strong password"
                autoComplete="new-password"
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            {errors.password && (
              <small className="field-error">
                {errors.password}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>
              Confirm password
            </label>

            <input
              type="password"
              value={confirmPassword}
              placeholder="Repeat your password"
              autoComplete="new-password"
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
            />

            {errors.confirmPassword && (
              <small className="field-error">
                {errors.confirmPassword}
              </small>
            )}
          </div>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={
              onSwitchToLogin
            }
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;