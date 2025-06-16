import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppShell,
  Burger,
  Button,
  Group,
  Tabs,
  Text,
  Title,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useWhoamiStore } from "./model/whoamiStore";
import logo from "./c1e98d86-67a7-4737-aa29-09ffd50e8ff9 (1)-Photoroom.png";
import {
  IconChartDots3,
  IconPlus,
  IconDotsVertical,
} from "@tabler/icons-react";
import { getAttemptDeclension } from "../utils/declension";
import style from "./style.module.scss";
import { useAuth } from "../modules/auth/hooks/useAuth";
import useAuthStore from "../modules/auth/pages/model/authStore";

export function MainLayout() {
  const [opened, { toggle }] = useDisclosure();

  const { user, fetchUser } = useWhoamiStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string | null>(() => {
    const path = location.pathname.split("/")[1];
    return path || "history";
  });

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    if (path) {
      setActiveTab(path);
    }
  }, [location.pathname]);

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    if (value) {
      navigate(`/${value}`);
    }
  };

  return (
    <AppShell header={{ height: 60 }} padding="30px">
      <AppShell.Header>
        <Group h="100%" px="30" className={style.headerWrapper}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div className={style.logoWrapper}>
            <img src={logo} alt="logo" height={60} />
            <Title order={3} className={style.header}>
              brainCHEK
            </Title>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              style={{ marginLeft: "20px" }}
            >
              <Tabs.List>
                <Tabs.Tab value="history">История отчетов</Tabs.Tab>
                <Tabs.Tab value="analysis">Новый отчет</Tabs.Tab>
                {user?.is_superuser && (
                  <Tabs.Tab value="admin">Управление пользователями</Tabs.Tab>
                )}
              </Tabs.List>
            </Tabs>
          </div>

          <div className={style.userWrapper}>
            <p style={{ paddingRight: "20px" }}>
              {`${user?.full_name} ${
                user?.is_superuser ? "(Администратор)" : ""
              }`}
            </p>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDotsVertical size={20} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  color="red"
                  onClick={() => {
                    useWhoamiStore.getState().resetUser();
                    useAuthStore.getState().logout();
                    navigate("/login");
                  }}
                >
                  Выйти
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Group>
      </AppShell.Header>

      <AppShell.Main className={style.mainLayout}>
        <Outlet /> {/* This is where the nested route components will render */}
      </AppShell.Main>
    </AppShell>
  );
}
