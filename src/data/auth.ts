
export type AuthUser = {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
};

type AuthResponse =
  | { authenticated: true; user: AuthUser }
  | { authenticated: false };

const API_BASE_URL = "http://localhost:3000";

export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return { authenticated: false };
  }

  if (!response.ok) {
    throw new Error("Could not check the current login session.");
  }

  return response.json() as Promise<AuthResponse>;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not log out.");
  }
}
