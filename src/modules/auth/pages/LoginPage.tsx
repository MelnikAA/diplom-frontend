import { Container, Paper, Title } from "@mantine/core";
import React from "react";
import { LoginForm } from "./ui/ui";

const LoginPage: React.FC = () => (
  <Container size={420} my={40}>
    <Title ta="center" className={"title"}>
      Авторизация{" "}
    </Title>
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <LoginForm />
    </Paper>
  </Container>
);

export default LoginPage;
