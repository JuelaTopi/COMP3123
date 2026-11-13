import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, notice } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const value = identifier.trim();

    if (!value || !password) {
      setError("Enter your username or email and password.");
      return;
    }

    if (value.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }

    setBusy(true);

    try {
      const credentials = value.includes("@")
        ? { email: value, password }
        : { username: value, password };

      const response = await api.post("/user/login", credentials);

      if (typeof response.data.token !== "string") {
        setError("Login could not be completed. Please try again.");
        return;
      }

      login(response.data.token);
      navigate("/employees", { replace: true });
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
          <h1 className="h3">Welcome back</h1>
          <p className="text-secondary">
            Sign in to manage your employee directory.
          </p>

          {notice && (
            <div className="alert alert-info" role="status">
              {notice}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="identifier" className="form-label">
                Username or email
              </label>
              <input
                id="identifier"
                className="form-control"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                maxLength={254}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={busy}
            >
              {busy ? "Signing in…" : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}