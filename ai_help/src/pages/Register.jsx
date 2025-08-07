// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) await updateProfile(cred.user, { displayName: name });
      nav("/");
    } catch (e) {
      setErr(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <form onSubmit={signUp} className="auth-form">
          <label>Name (optional)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Balázs" />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 placeholder="you@example.com" required />
          <label>Password</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
                 placeholder="Minimum 6 characters" required />
          {err && <div className="auth-error">{err}</div>}
          <button className="auth-primary" disabled={loading}>
            {loading ? "Creating…" : "Register"}
          </button>
        </form>

        <p className="auth-alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
