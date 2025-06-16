import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Group,
  TextInput,
  Stack,
  Switch,
  Loader,
  Alert,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface AddUserModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: (userData: {
    email: string;
    full_name: string;
    is_superuser?: boolean;
  }) => Promise<void>;
  title?: string;
  initialUserData?: {
    email: string;
    full_name: string;
    is_superuser?: boolean;
  };
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  opened,
  onClose,
  onConfirm,
  title = "Подтверждение",
  initialUserData,
}) => {
  const [email, setEmail] = useState(initialUserData?.email || "");
  const [fullName, setFullName] = useState(initialUserData?.full_name || "");
  const [isSuperuser, setIsSuperuser] = useState(
    initialUserData?.is_superuser || false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(initialUserData?.email || "");
    setFullName(initialUserData?.full_name || "");
    setIsSuperuser(initialUserData?.is_superuser || false);
    setError(null);
  }, [initialUserData, opened]);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onConfirm({
        email,
        full_name: fullName,
        is_superuser: isSuperuser,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла ошибка при сохранении"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <Stack>
        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            color="red"
            title="Ошибка"
          >
            {error}
          </Alert>
        )}
        <TextInput
          label="Email"
          placeholder="Введите email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          required
          disabled={isLoading}
        />
        <TextInput
          label="Полное имя"
          placeholder="Введите полное имя"
          value={fullName}
          onChange={(event) => setFullName(event.currentTarget.value)}
          required
          disabled={isLoading}
        />
        <Switch
          label="Администратор"
          checked={isSuperuser}
          onChange={(event) => setIsSuperuser(event.currentTarget.checked)}
          disabled={isLoading}
        />
      </Stack>
      <Group justify="flex-end" mt="md">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!email || !fullName || isLoading}
          leftSection={isLoading ? <Loader size="sm" /> : null}
        >
          {isLoading ? "Сохранение..." : "Сохранить"}
        </Button>
      </Group>
    </Modal>
  );
};

export default AddUserModal;
