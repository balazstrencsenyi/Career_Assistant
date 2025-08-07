// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const signInEmail = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      nav("/");
    } catch (e) {
      setErr(e.message);
    } finally { setLoading(false); }
  };

  const signInGoogle = async () => {
    setErr(""); setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      nav("/");
    } catch (e) {
      setErr(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <form onSubmit={signInEmail} className="auth-form">
          <label>Email</label>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" required
          />
          <label>Password</label>
          <input
            type="password" value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••" required
          />
          {err && <div className="auth-error">{err}</div>}
          <button className="auth-primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <button className="auth-google" onClick={signInGoogle} disabled={loading}>
          <span>🔐</span> Sign in with Google
        </button>

        <p className="auth-alt">
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
