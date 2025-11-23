import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { useAuth } from "./hooks/useAuth";
import FormPublication from "./components/Publication/FormPublication";

export default function App() {
  //const { isLoggedIn } = useAuth();
  //const path = window.location.pathname;

  //if (!isLoggedIn && path === "/register") return <RegisterPage />;
  //if (!isLoggedIn) return <LoginPage />;

  //return <HomePage />;
  return <FormPublication />;
}
