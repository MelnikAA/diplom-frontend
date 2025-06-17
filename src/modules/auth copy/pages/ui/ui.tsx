import {
  Alert,
  Box,
  Button,
  Container,
  PasswordInput,
  Loader,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../../shared/api";

export const LoginForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  if (!token || !email) {
    return (
      <Container>
        <Box>
          <Alert variant="light" color="red">
            <p style={{ fontSize: "16px", textAlign: "center" }}>
              Неверная ссылка для установки пароля. Пожалуйста, запросите новую
              ссылку у администратора.
            </p>
          </Alert>
        </Box>
      </Container>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/api/v1/auth/set-password", {
        token,
        password,
        email,
      });
      setSuccess(true);
      // Перенаправляем на страницу входа через 3 секунды
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        "Ошибка при установке пароля. Пожалуйста, попробуйте еще раз или запросите новую ссылку."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Box>
          Установка пароля для: {email}
          {success ? (
            <Alert>
              Пароль успешно установлен! Вы будете перенаправлены на страницу
              входа.
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              {error && <Alert>{error}</Alert>}
              <PasswordInput
                error={error}
                label={"Пароль"}
                placeholder="******"
                required
                mt="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <PasswordInput
                error={error}
                label={"Повторите пароль"}
                placeholder="******"
                required
                mt="md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <Button
                fullWidth
                mt="xl"
                type="submit"
                loading={isLoading}
                leftSection={isLoading ? <Loader size="sm" /> : null}
              >
                {isLoading ? "Установка пароля..." : "Подтвердить"}
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};
