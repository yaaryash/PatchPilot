
export type UserProfile = {
  displayName: string;
  email: string;
};

const STORAGE_KEY = "patchpilot:user-profile";
const PROFILE_EVENT = "patchpilot:profile-updated";

const DEFAULT_PROFILE: UserProfile = {
  displayName: "Yash",
  email: "",
};

export function getUserProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return DEFAULT_PROFILE;
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "displayName" in parsed &&
      "email" in parsed &&
      typeof parsed.displayName === "string" &&
      typeof parsed.email === "string"
    ) {
      return {
        displayName: parsed.displayName,
        email: parsed.email,
      };
    }
  } catch {
    // Use the default profile when stored data is unavailable or invalid.
  }

  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  const normalizedProfile = {
    displayName: profile.displayName.trim() || "Developer",
    email: profile.email.trim(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedProfile));

  window.dispatchEvent(
    new CustomEvent(PROFILE_EVENT, { detail: normalizedProfile })
  );
}

export function subscribeToUserProfile(
  callback: (profile: UserProfile) => void
): () => void {
  const handleUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<UserProfile>;
    callback(customEvent.detail);
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback(getUserProfile());
    }
  };

  window.addEventListener(PROFILE_EVENT, handleUpdate);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(PROFILE_EVENT, handleUpdate);
    window.removeEventListener("storage", handleStorage);
  };
}
