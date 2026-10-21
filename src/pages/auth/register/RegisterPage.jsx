import AuthPage from "../../../components/auth/AuthPage";
import { registerUser } from "../../../api/authApi";
import "./RegisterPage.css";

export default function RegisterPage({ onNavigate }) {
  const handleRegister = async (account) => {
    await registerUser(account);
    onNavigate("/login?registered=1");
  };

  return (
    <AuthPage mode="register" onNavigate={onNavigate} onAuthenticate={handleRegister} />
  );
}
