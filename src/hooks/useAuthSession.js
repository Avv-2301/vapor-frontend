import { useCallback, useEffect } from "react";
import { logoutUser } from "../api/authApi";
import { getProfile } from "../api/profileApi";
import { useAppStore } from "../stores/appStore";

export default function useAuthSession() {
  const user = useAppStore((state) => state.user);
  const initializeAuth = useAppStore((state) => state.initializeAuth);
  const updateUser = useAppStore((state) => state.updateUser);
  const clearUser = useAppStore((state) => state.clearUser);
  const loadWishlist = useAppStore((state) => state.loadWishlist);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!user || user.profilePhoto) return undefined;
    let active = true;
    getProfile()
      .then((profile) => {
        if (active && profile?.profilePhoto) {
          updateUser({ profilePhoto: profile.profilePhoto });
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, [user, updateUser]);

  useEffect(() => {
    if (user?._id) loadWishlist(user._id);
  }, [user?._id, loadWishlist]);

  const signOut = useCallback(() => {
    clearUser();
    logoutUser().catch(() => {});
  }, [clearUser]);

  return [user, signOut];
}
