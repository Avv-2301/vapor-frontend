import AuthPage from "../../../components/auth/AuthPage";
import { loginUser } from "../../../api/authApi";
import { useAppStore } from "../../../stores/appStore";
import "./LoginPage.css";

export default function LoginPage({ onNavigate }) {
  const registrationSucceeded =
    new URLSearchParams(window.location.search).get("registered") === "1";

  const handleLogin = async (credentials) => {
    const result = await loginUser(credentials);
    useAppStore.getState().setUser(result.data);
    onNavigate("/");
  };

  return (
    <AuthPage
      mode="login"
      onNavigate={onNavigate}
      onAuthenticate={handleLogin}
      successMessage={
        registrationSucceeded ? "Account created successfully. You can sign in now." : ""
      }
    />
  );
}
