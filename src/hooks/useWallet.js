import { useEffect } from "react";
import { useAppStore } from "../stores/appStore";

export default function useWallet(user) {
  const userId = user?._id || null;
  const wallet = useAppStore((state) => state.walletUserId === userId ? state.wallet : null);
  const loading = useAppStore((state) => Boolean(userId) && state.walletUserId === userId && state.walletLoading);
  const error = useAppStore((state) => state.walletUserId === userId ? state.walletError : "");
  const loadWallet = useAppStore((state) => state.loadWallet);

  useEffect(() => {
    if (userId) loadWallet(userId);
  }, [userId, loadWallet]);

  return {
    wallet,
    loading: Boolean(userId) && !wallet && !error || loading,
    error,
    refresh: () => userId ? loadWallet(userId, true) : Promise.resolve(),
  };
}
