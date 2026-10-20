
import { useCallback, useEffect, useState } from "react";
import { getCurrentUser, logout, type AuthUser } from "../data/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getCurrentUser();
      setUser(result.authenticated ? result.user : null);
    } catch (err) {
      setUser(null);
      setError(
        err instanceof Error ? err.message : "Authentication check failed.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  return { user, loading, error, refresh, signOut };
}
