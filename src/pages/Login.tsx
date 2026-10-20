
import { useState } from "react";
import { GitBranch, ShieldCheck, Wrench } from "lucide-react";
import "./Login.css";

export default function Login() {
  const [message, setMessage] = useState("");

  function handleGithubLogin() {
    setMessage(
      "GitHub sign-in is not connected yet. OAuth will be enabled after the backend is implemented."
    );
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">
            <Wrench size={25} />
          </div>
          <span>PatchPilot</span>
        </div>

        <div className="login-heading">
          <h1>Welcome to PatchPilot</h1>
          <p>
            Your AI-powered code repair workspace.
            Investigate bugs, review proposed fixes, and
            manage repair workflows in one place.
          </p>
        </div>

        <button
          className="github-login-button"
          type="button"
          onClick={handleGithubLogin}
        >
          <GitBranch size={20} />
          <span>Continue with GitHub</span>
        </button>

        {message && (
          <p className="login-message" role="status">
            {message}
          </p>
        )}

        <div className="login-security-note">
          <ShieldCheck size={18} />
          <span>
            Secure repository access and authentication
            will be handled by the PatchPilot backend.
          </span>
        </div>

        <div className="login-divider" />

        <p className="login-footer">
          Built for developers who want to fix bugs
          with confidence.
        </p>
      </section>

      <p className="login-copyright">
        PatchPilot · AI-Powered Code Repair Platform
      </p>
    </main>
  );
}
