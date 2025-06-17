import { Container, Paper, Title, Image } from "@mantine/core";
import React, { useEffect } from "react";
import { LoginForm } from "./ui/ui";
import logo from "../../../layouts/c1e98d86-67a7-4737-aa29-09ffd50e8ff9 (1)-Photoroom.png";

const LoginPage: React.FC = () => {
  useEffect(() => {
    document.title = "Авторизация | brainCheck";
  }, []);
  return (
    <Container size={420} my={40}>
      <Image
        src={logo}
        alt="Logo"
        style={{ width: "200px", margin: "0 auto 20px" }}
      />
      <Title ta="center" className={"title"}>
        Авторизация
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <LoginForm />
      </Paper>
    </Container>
  );
};

export default LoginPage;
