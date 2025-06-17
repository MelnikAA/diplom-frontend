import React from "react";
import style from "./ResultInfo.module.scss";
import type { Prediction } from "../../../modules/analysisPage/predictionModel";
import { DateTime } from "luxon";
import { CopyButton, ActionIcon, Tooltip, Button, Group } from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";

interface ResultInfoProps {
  prediction: Prediction;
}

const ResultInfo = ({ prediction }: ResultInfoProps) => {
  const dt = DateTime.fromISO(prediction.created_at, { setZone: true });
  const formattedDate = dt.toFormat("dd.MM.yyyy");
  const formattedTime = dt.toFormat("HH:mm");
  const formatBirthDate = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat("dd.MM.yyyy");
  };

  // Создаем полный отчет для копирования
  const fullReport = `
Результат распознавания
Дата: ${formattedDate} ${formattedTime}

Описание: ${prediction.description}
Выводы: ${prediction.conclusions}
Рекомендации: ${prediction.recommendations}
${prediction.notes ? `Примечания: ${prediction.notes}\n` : ""}
Уверенность модели: ${(prediction.confidence * 100).toFixed(0)}%
Наличие опухоли: ${prediction.has_tumor ? "Да" : "Нет"}
  `.trim();

  return (
    <div className={style.resultInfoContainer}>
      {prediction.image_id && (
        <div className={style.imageContainer}>
          <img
            src={`${import.meta.env.VITE_BACK_ADDRESS}api/v1/images/${
              prediction.image_id
            }/view`}
            alt="Original Image"
            className={style.resultImage}
          />
        </div>
      )}
      <div className={style.resultInfo}>
        <div className={style.headerDateWrapper}>
          <h2>
            Результат распознавания
            <CopyButton value={fullReport} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Скопировано" : "Копировать весь отчет"}
                  withArrow
                  position="right"
                >
                  <ActionIcon
                    color={copied ? "teal" : "gray"}
                    variant="subtle"
                    onClick={copy}
                    style={{ marginLeft: 8 }}
                  >
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </h2>
          <div className={style.patientWrapper}>
            <p className={style.patient}>
              {prediction.patient &&
                `Пациент: ${prediction.patient?.full_name} (${formatBirthDate(
                  prediction.patient.birth_date
                )})`}
            </p>
            <p className={style.patient}>
              {prediction.owner && `Врач: ${prediction.owner?.full_name}`}
            </p>
            <p className={style.dateTime}>
              {formattedDate}
              {"     "}
              {formattedTime}
            </p>
          </div>
        </div>

        <Group justify="flex-end" mb="sm"></Group>

        <div className={style.infoBlock}>
          <div className={style.copyableSection}>
            <p>
              <strong>Описание:</strong> {prediction.description}
              <CopyButton value={prediction.description} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Скопировано" : "Копировать"}
                    withArrow
                    position="right"
                  >
                    <ActionIcon
                      color={copied ? "teal" : "gray"}
                      variant="subtle"
                      onClick={copy}
                      style={{ marginLeft: 8 }}
                    >
                      {copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </p>
          </div>

          <div className={style.copyableSection}>
            <p>
              <strong>Выводы:</strong> {prediction.conclusions}
              <CopyButton value={prediction.conclusions} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Скопировано" : "Копировать"}
                    withArrow
                    position="right"
                  >
                    <ActionIcon
                      color={copied ? "teal" : "gray"}
                      variant="subtle"
                      onClick={copy}
                      style={{ marginLeft: 8 }}
                    >
                      {copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </p>
          </div>

          <div className={style.copyableSection}>
            <p>
              <strong>Рекомендации:</strong> {prediction.recommendations}
              <CopyButton value={prediction.recommendations} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Скопировано" : "Копировать"}
                    withArrow
                    position="right"
                  >
                    <ActionIcon
                      color={copied ? "teal" : "gray"}
                      variant="subtle"
                      onClick={copy}
                      style={{ marginLeft: 8 }}
                    >
                      {copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </p>
          </div>

          {prediction.notes && (
            <div className={style.copyableSection}>
              <p>
                <strong>Примечания врача:</strong> {prediction.notes}
                <CopyButton value={prediction.notes} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Скопировано" : "Копировать"}
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        variant="subtle"
                        onClick={copy}
                        style={{ marginLeft: 8 }}
                      >
                        {copied ? (
                          <IconCheck size={16} />
                        ) : (
                          <IconCopy size={16} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </p>
            </div>
          )}

          <p>
            <strong>Уверенность модели:</strong>{" "}
            {(prediction.confidence * 100).toFixed(0)}%
          </p>
          <p>
            <strong>Наличие опухоли:</strong>{" "}
            {prediction.has_tumor ? "Да" : "Нет"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultInfo;
