
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, error, refresh } = useAuth();

  if (loading) {
    return (
      <main className="auth-status">
        <h2>Checking your session...</h2>
        <p>Please wait while PatchPilot verifies your login.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="auth-status">
        <h2>Unable to verify your session</h2>
        <p>{error}</p>
        <button type="button" onClick={() => void refresh()}>
          Retry connection
        </button>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
