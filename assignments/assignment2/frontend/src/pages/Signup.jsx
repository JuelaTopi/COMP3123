import { useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../api/client";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username.trim())) {
      setError(
        "Username must contain 3–50 letters, numbers or underscores."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (
      password.length < 8 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      new TextEncoder().encode(password).length > 72
    ) {
      setError(
        "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter and a number. Maximum 72 bytes."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      await api.post("/user/signup", {
        username: username.trim(),
        email: email.trim(),
        password
      });

      setSuccess(true);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container py-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: 460 }}>
        <div className="card-body p-4">
          <h1 className="h3">Create your account</h1>
          <p className="text-secondary">
            Start managing your employee directory.
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="status">
              Account created successfully.{" "}
              <Link to="/login">Log in to continue.</Link>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="signupUsername" className="form-label">
                Username
              </label>
              <input
                id="signupUsername"
                className="form-control"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                maxLength={50}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="signupEmail" className="form-label">
                Email
              </label>
              <input
                id="signupEmail"
                type="email"
                className="form-control"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                maxLength={254}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="signupPassword" className="form-label">
                Password
              </label>
              <input
                id="signupPassword"
                type="password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                aria-describedby="passwordHelp"
                required
              />
              <div id="passwordHelp" className="form-text">
                Use at least 8 characters with uppercase, lowercase
                and a number. Maximum 72 bytes.
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={busy}
            >
              {busy ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}