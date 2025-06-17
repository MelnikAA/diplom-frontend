import React, { useEffect, useState } from "react";
import { useUsersStore } from "./model";
import {
  Table,
  Text,
  Paper,
  Title,
  Button,
  Group,
  Modal,
  Anchor,
  Alert,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AddUserModal from "../../../shared/components/AddUserModal/AddUserModal";
import type { User } from "./api";
import { resetUserPassword } from "./api";
import { IconAlertCircle } from "@tabler/icons-react";

const AdminDashboard: React.FC = () => {
  useEffect(() => {
    document.title = "Панель администратора | brainCheck";
  }, []);

  const {
    users,

    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsersStore();
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [
    resetPasswordModalOpened,
    { open: openResetPasswordModal, close: closeResetPasswordModal },
  ] = useDisclosure(false);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null
  );
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUserConfirm = async (userData: {
    email: string;
    full_name: string;
    is_superuser?: boolean;
  }) => {
    try {
      await createUser(userData);
      closeAddModal();
    } catch (err) {
      console.error("Ошибка при создании пользователя:", err);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    openEditModal();
  };

  const handleEditUserConfirm = async (userData: {
    email: string;
    full_name: string;
  }) => {
    if (selectedUser) {
      try {
        await updateUser(selectedUser.id, userData); // Используем функцию updateUser из стора
        closeEditModal(); // Закрыть модальное окно после успешного сохранения
        setSelectedUser(null);
      } catch (err) {
        console.error("Ошибка при обновлении пользователя:", err);
        // Здесь можно добавить отображение ошибки для пользователя
      }
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        setIsDeleting(true);
        await deleteUser(userToDelete.id);
        closeDeleteModal();
        setUserToDelete(null);
      } catch (err) {
        console.error("Ошибка при удалении пользователя:", err);
        setDeleteError(
          "Ошибка при удалении пользователя. Пожалуйста, попробуйте позже."
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleResetPasswordClick = (user: User) => {
    setUserToResetPassword(user);
    openResetPasswordModal();
  };

  const handleResetPasswordConfirm = async () => {
    if (userToResetPassword) {
      try {
        setIsResettingPassword(true);
        await resetUserPassword(userToResetPassword.id);
        await fetchUsers();
        closeResetPasswordModal();
        setUserToResetPassword(null);
        // Можно добавить уведомление об успешном сбросе пароля
      } catch (err) {
        console.error("Ошибка при сбросе пароля:", err);
        setResetPasswordError(
          "Ошибка при сбросе пароля. Пожалуйста, попробуйте позже."
        );
      } finally {
        setIsResettingPassword(false);
      }
    }
  };

  if (error) {
    return <Text color="red">Ошибка: {error}</Text>;
  }

  return (
    <Paper shadow="sm" radius="lg" p="xl" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={2}>Управление пользователями</Title>
        <Button onClick={openAddModal}>Добавить пользователя</Button>
      </Group>
      {users.length === 0 ? (
        <Text>Пользователи не найдены.</Text>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Полное имя</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Админ</Table.Th>
              <Table.Th>Активирован</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Anchor href={`/history?owner_id=${user.id}`}>
                    {user.full_name}
                  </Anchor>
                </Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.is_superuser ? "Да" : "Нет"}</Table.Td>
                <Table.Td>{user.is_active ? "Да" : "Нет"}</Table.Td>
                <Table.Td>
                  <Group>
                    <Button size="xs" onClick={() => handleEditClick(user)}>
                      Редактировать
                    </Button>
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => handleResetPasswordClick(user)}
                    >
                      Сбросить пароль
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleDeleteClick(user)}
                    >
                      Удалить
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <AddUserModal
        opened={addModalOpened}
        onClose={closeAddModal}
        onConfirm={handleAddUserConfirm}
        title="Добавить нового пользователя"
      />

      {selectedUser && (
        <AddUserModal
          opened={editModalOpened}
          onClose={closeEditModal}
          onConfirm={handleEditUserConfirm}
          title="Редактировать пользователя"
          initialUserData={{
            email: selectedUser.email,
            full_name: selectedUser.full_name,
            is_superuser: selectedUser.is_superuser,
          }}
        />
      )}

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Подтверждение удаления"
      >
        {deleteError && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            color="red"
            title="Ошибка"
            mb="md"
          >
            {deleteError}
          </Alert>
        )}
        <Text>
          Вы уверены, что хотите удалить пользователя{" "}
          <strong>{userToDelete?.full_name}</strong>?
        </Text>
        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            onClick={closeDeleteModal}
            disabled={isDeleting}
          >
            Отмена
          </Button>
          <Button
            color="red"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            leftSection={isDeleting ? <Loader size="sm" /> : null}
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={resetPasswordModalOpened}
        onClose={closeResetPasswordModal}
        title="Подтверждение сброса пароля"
      >
        {resetPasswordError && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            color="red"
            title="Ошибка"
            mb="md"
          >
            {resetPasswordError}
          </Alert>
        )}
        <Text>
          Вы уверены, что хотите сбросить пароль пользователя{" "}
          <strong>{userToResetPassword?.full_name}</strong>?
        </Text>
        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            onClick={closeResetPasswordModal}
            disabled={isResettingPassword}
          >
            Отмена
          </Button>
          <Button
            color="blue"
            onClick={handleResetPasswordConfirm}
            disabled={isResettingPassword}
            leftSection={isResettingPassword ? <Loader size="sm" /> : null}
          >
            {isResettingPassword ? "Сброс пароля..." : "Сбросить пароль"}
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
};

export default AdminDashboard;
