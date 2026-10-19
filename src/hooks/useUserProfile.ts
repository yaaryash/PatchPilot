
import { useEffect, useState } from "react";
import {
  getUserProfile,
  subscribeToUserProfile,
  type UserProfile,
} from "../data/userProfile";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile);

  useEffect(() => {
    return subscribeToUserProfile(setProfile);
  }, []);

  return profile;
}
