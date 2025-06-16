import React, { useEffect, useState } from "react";
import { useHistoryStore, type Patient } from "./model/index";
import type { Prediction } from "../../analysisPage/predictionModel";
import {
  Button,
  Table,
  Group,
  Text,
  Pagination,
  Select,
  Box,
  TextInput,
  Paper,
} from "@mantine/core";
import { Image } from "@mantine/core";

import { DateTime } from "luxon";
import { useUsersStore } from "../../admin/pages/model";
import type { User } from "../../admin/pages/api";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import { DateInput, DatePicker } from "@mantine/dates";
import { useWhoamiStore } from "../../../layouts/model/whoamiStore";
import { IconExternalLink } from "@tabler/icons-react";
import { ru } from "date-fns/locale";

const HistoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const {
    predictions = [],
    total,
    page,
    size,
    pages,
    isLoading,
    error,
    filters,
    patients,
    fetchPredictions,
    fetchPatient,
    setPage,
    setSize,
    setFilters,
  } = useHistoryStore();
  const {
    users,

    fetchUsers,
  } = useUsersStore();
  const ownerIdFromUrl = searchParams.get("owner_id") || "";
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const { user } = useWhoamiStore();

  useEffect(() => {
    fetchPredictions();
  }, [page, size, filters, fetchPredictions]);
  useEffect(() => {
    fetchPatient();
    user?.is_superuser && fetchUsers();
  }, []);

  useEffect(() => {
    if (ownerIdFromUrl && filters.owner_id !== ownerIdFromUrl) {
      setFilters({ ...filters, owner_id: ownerIdFromUrl });
    }
  }, [ownerIdFromUrl]);

  useEffect(() => {
    setFilters({
      ...filters,
      created_from: dateFrom ? dateFrom.slice(0, 10) : undefined,
      created_to: dateTo ? dateTo.slice(0, 10) : undefined,
    });

    setSearchParams({
      ...Object.fromEntries(searchParams),
      created_from: dateFrom ? dateFrom.slice(0, 10) : "",
      created_to: dateTo ? dateTo.slice(0, 10) : "",
    });
    // eslint-disable-next-line
  }, [dateFrom, dateTo]);

  useEffect(() => {
    const from = searchParams.get("created_from");
    const to = searchParams.get("created_to");
    if (from) setDateFrom(from);
    if (to) setDateTo(to);
    // eslint-disable-next-line
  }, []);

  const patientOptions = patients.map((patient: Patient) => ({
    value: patient.id.toString(),
    label: `${patient.full_name} (${patient.birth_date})`,
  }));
  const usersOptions = users.map((user: User) => ({
    value: user.id.toString(),
    label: `${user.full_name}`,
  }));

  const rows = predictions?.map((prediction: Prediction) => {
    const createdAt = DateTime.fromISO(prediction.created_at, {
      setZone: true,
    });
    const formattedDate = createdAt.toFormat("dd.MM.yyyy");
    const formattedTime = createdAt.toFormat("HH:mm");

    return (
      <Table.Tr key={prediction.id}>
        <Table.Td>
          {formattedDate} {formattedTime}
        </Table.Td>
        <Table.Td>{prediction.has_tumor ? "Да" : "Нет"}</Table.Td>
        <Table.Td>{(prediction.confidence * 100).toFixed(0)}%</Table.Td>
        <Table.Td>
          {prediction.patient && `${prediction.patient?.full_name}`}
        </Table.Td>
        {user?.is_superuser && (
          <Table.Td>{`${prediction.owner?.full_name}`}</Table.Td>
        )}
        <Table.Td>
          <Image
            w="auto"
            fit="contain"
            radius="md"
            src={`${import.meta.env.VITE_BACK_ADDRESS}api/v1/images/${
              prediction.image_id
            }/view`}
            alt="Изображение"
            height={100}
          />
        </Table.Td>
        <Table.Td>
          <Link to={`/analysis/${prediction.id}`}>
            <Button
              variant="transparent"
              size="xs"
              rightSection={<IconExternalLink />}
            >
              Подробнее
            </Button>
          </Link>
        </Table.Td>
      </Table.Tr>
    );
  });

  const handleOwnerChange = (newOwnerId: string) => {
    setFilters({ ...filters, owner_id: newOwnerId });
    setSearchParams({
      ...Object.fromEntries(searchParams),
      owner_id: newOwnerId,
    });
  };

  return (
    <Box>
      <Group mb="md">
        <Select
          placeholder="Выберите пациента"
          data={patientOptions}
          value={filters.patient_id?.toString() || null}
          onChange={(value) =>
            setFilters({
              patient_id: value ? value : undefined,
            })
          }
          label="Фильтр по пациенту"
          searchable
          clearable
          nothingFoundMessage="Пациенты не найдены"
        />
        {user?.is_superuser && (
          <Select
            placeholder="Выберите врача"
            data={usersOptions}
            value={filters.owner_id || null}
            onChange={(value) => handleOwnerChange(value || "")}
            label="Фильтр по врачу"
            searchable
            clearable
            nothingFoundMessage="Врачи не найдены"
          />
        )}

        <Select
          clearable
          placeholder="Наличие опухоли"
          data={[
            { value: "true", label: "Да" },
            { value: "false", label: "Нет" },
          ]}
          value={
            filters.has_tumor !== undefined
              ? filters.has_tumor.toString()
              : null
          }
          onChange={(value) =>
            setFilters({
              has_tumor:
                value === "true" ? true : value === "false" ? false : undefined,
            })
          }
          label="Фильтр по опухоли"
        />
        <div style={{ display: "flex", gap: "16px", minWidth: "200px" }}>
          <DateInput
            value={dateFrom}
            onChange={setDateFrom}
            label="Дата с"
            maxDate={dateTo || undefined}
            placeholder="Дата с"
            clearable
            locale="ru"
            valueFormat="DD.MM.YYYY"
          />
          <DateInput
            clearable
            value={dateTo}
            onChange={setDateTo}
            label="Дата по"
            minDate={dateFrom || undefined}
            placeholder="Дата по"
            locale="ru"
            valueFormat="DD.MM.YYYY"
          />
        </div>

        {/*<Button onClick={resetFilters}>Сбросить фильтры</Button> */}
      </Group>

      {isLoading && <Text>Загрузка истории отчетов...</Text>}
      {error && <Text color="red">Ошибка: {error}</Text>}

      {!isLoading && !error && predictions.length === 0 && (
        <Text>Нет данных для отображения.</Text>
      )}

      {!isLoading && predictions.length > 0 && (
        <>
          <Paper shadow="sm" radius="lg" p="xl" withBorder>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Дата и Время</Table.Th>
                  <Table.Th>Опухоль</Table.Th>
                  <Table.Th>Уверенность модели</Table.Th>
                  <Table.Th>Пациент</Table.Th>
                  {user?.is_superuser && <Table.Th>Врач</Table.Th>}
                  <Table.Th>Изображение</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Paper>

          <Group justify="space-between" mt="md">
            <Pagination total={pages} value={page} onChange={setPage} />
            <Select
              value={size.toString()}
              onChange={(value) => setSize(parseInt(value || "10"))}
              data={["10", "25", "50", "100"]}
              label="Элементов на странице"
            />
          </Group>
        </>
      )}
    </Box>
  );
};

export default HistoryPage;
