import { useState } from "react";
import { Brand } from "../common/Header";
import Icon from "../common/Icon";
import "./AuthPage.css";

export default function AuthPage({
  mode,
  onNavigate,
  onAuthenticate,
  successMessage = "",
}) {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(successMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (isRegister && !name.trim()) {
      setError("Enter a display name.");
      return;
    }
    if (password.length < 8 || password.length > 16) {
      setError("Password must be between 8 and 16 characters.");
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await onAuthenticate({
        ...(isRegister && { name: name.trim(), confirmPassword }),
        email: email.trim().toLowerCase(),
        password,
        ...(!isRegister && { rememberMe }),
      });
      if (result?.message) {
        setSuccess(result.message);
        setPassword("");
        setConfirmPassword("");
      }
    } catch (submitError) {
      setError(submitError.message || "Unable to complete your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`auth-page auth-${mode}-page`}>
      <header className="auth-header">
        <div className="container">
          <Brand />
          <button className="auth-back" onClick={() => onNavigate("/")}>
            <Icon name="arrow" size={15} /> Back to Store
          </button>
        </div>
      </header>
      <section className="auth-main">
        <div className="auth-card">
          <div className="auth-mark"><img src="/images/logo.jpg" alt="" /></div>
          <span className="eyebrow">Your next adventure awaits</span>
          <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
          <p className="auth-intro">
            {isRegister
              ? "Join Vapor to keep your games and discoveries in one place."
              : "Sign in to continue your Vapor journey."}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-field">
                <span>Display name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="How should we call you?"
                />
              </label>
            )}
            <label className="auth-field">
              <span>Email address</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                maxLength={100}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <div className="auth-password-control">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  minLength={8}
                  maxLength={16}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={17} />
                </button>
              </div>
            </div>
            {isRegister ? (
              <div className="auth-field">
                <label htmlFor="auth-confirm-password">Confirm password</label>
                <div className="auth-password-control">
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={16}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter your password again"
                  />
                  <button
                    className="auth-password-toggle"
                    type="button"
                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                    aria-pressed={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                  >
                    <Icon name={showConfirmPassword ? "eyeOff" : "eye"} size={17} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-options">
                <label><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Remember me</label>
                <span>Password help coming soon</span>
              </div>
            )}
            {isRegister && <small className="auth-hint">Use a strong password of 8–16 characters. The account service also checks password strength.</small>}
            {error && <p className="auth-error" role="alert">{error}</p>}
            {success && <p className="auth-success" role="status">{success}</p>}
            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting || (isRegister && Boolean(success))}
            >
              {isSubmitting
                ? "Please wait…"
                : isRegister && success
                  ? "Account Created"
                  : isRegister
                    ? "Create Account"
                    : "Sign In"}
              {!isSubmitting && !(isRegister && success) && <Icon name="arrow" size={16} />}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "New to Vapor?"}{" "}
            <button onClick={() => onNavigate(isRegister ? "/login" : "/register")}>
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </p>
          <p className="auth-demo-note">Your credentials are sent to Vapor’s account service for authentication.</p>
        </div>
      </section>
      <footer className="auth-footer">© 2024 Vapor Corporation · Play your way</footer>
    </main>
  );
}
