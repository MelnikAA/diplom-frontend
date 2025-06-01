import { Outlet } from "react-router-dom";
import { AppShell, Burger, Button, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export function MainLayout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3}>My Brain App</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet /> {/* This is where the nested route components will render */}
      </AppShell.Main>
    </AppShell>
  );
}
