import { useAppStore } from "../stores/appStore";

export default function useCart() {
  return useAppStore((state) => state.cartIds);
}
