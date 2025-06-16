import { Button, PasswordInput, TextInput, Loader } from "@mantine/core";
import useAuthStore from "../model/authStore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const { login, error, setError } = useAuthStore();
  const [username, setUsernameLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setUsernameLocal(username);
      setPasswordLocal(password);
      setError(null);

      await login(username, password);
      navigate("/");
    } catch (error) {
      /*       console.error("Ошибка авторизации:", error);*/
      setError("Ошибка авторизации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encodedLogin = params.get("login");

    if (encodedLogin) {
      try {
        const decodedLogin = atob(encodedLogin);
        setUsernameLocal(decodedLogin);
      } catch (error) {
        /*         console.error("Ошибка декодирования логина:", error);*/
      }
    }
  }, [location.search]);

  return (
    <>
      <TextInput
        error={error}
        label={"Почта"}
        placeholder="user@example.com"
        required
        value={username}
        onChange={(e) => setUsernameLocal(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <PasswordInput
        error={error}
        label={"Пароль"}
        placeholder="******"
        required
        mt="md"
        value={password}
        onChange={(e) => setPasswordLocal(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <Button
        fullWidth
        mt="xl"
        onClick={handleLogin}
        loading={isLoading}
        leftSection={isLoading ? <Loader size="sm" /> : null}
      >
        {isLoading ? "Вход..." : "Войти"}
      </Button>
    </>
  );
};
