import { useEffect, useState } from "react";
import { DropzoneButton } from "../../shared/components/dropzone/dropzone";
import type { FileWithPath } from "@mantine/dropzone";
import style from "./style.module.scss";
import {
  Button,
  Select,
  Textarea,
  LoadingOverlay,
  Anchor,
  Breadcrumbs,
} from "@mantine/core";
import ResultInfo from "../../shared/components/ResultInfo/ResultInfo";
import { useAnalysisStore } from "./model/analysisStore";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useHistoryStore, type Patient } from "../history/pages/model";

const AnalysisPage = () => {
  useEffect(() => {
    document.title = "Анализ снимка | brainCheck";
  }, []);
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, fetchPatient } = useHistoryStore();
  const {
    selectedFile,
    predictionResult,
    isLoading,
    error,
    setSelectedFile,
    uploadFile,
    resetState,
    fetchPredictionById,
  } = useAnalysisStore();

  const [formData, setFormData] = useState({
    patient_id: "",
    notes: "",
  });

  useEffect(() => {
    fetchPatient();
  }, []);

  const [filePreview, setFilePreview] = useState<string | null>(null);

  const patientOptions = patients.map((patient: Patient) => ({
    value: patient.id.toString(),
    label: `${patient.full_name} (${patient.birth_date})`,
  }));

  useEffect(() => {
    let objectUrl: string | null = null;
    if (selectedFile) {
      objectUrl = URL.createObjectURL(selectedFile);
      setFilePreview(objectUrl);
    } else {
      setFilePreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedFile]);

  useEffect(() => {
    if (predictionResult && !id) {
      navigate(`/analysis/${predictionResult.id}`);
    }
  }, [predictionResult, id, navigate]);

  useEffect(() => {
    if (id) {
      fetchPredictionById(id);
    } else {
      resetState();
    }

    // Очищаем состояние при размонтировании компонента
    return () => {
      resetState();
    };
  }, [id, fetchPredictionById, resetState]);

  const handleFileDrop = (files: FileWithPath[]) => {
    if (files.length === 0) {
      setSelectedFile(null);
      return;
    }
    const file = files[0];
    setSelectedFile(file);
  };

  const handleFormChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRequest = async () => {
    if (!selectedFile) {
      return;
    }

    const payload = {
      file: selectedFile,
      patient_id: formData.patient_id
        ? parseInt(formData.patient_id)
        : undefined,
      notes: formData.notes,
    };

    await uploadFile(payload);
  };
  const items = [
    { title: "История отчетов", href: "/history" },
    ...(location.pathname !== "/history"
      ? [{ title: "Новый отчет", href: "/analysis" }]
      : []),
    ...(id ? [{ title: `Отчет ${id}`, href: "" }] : []),
  ].map((item, index) => (
    <Anchor
      key={index}
      onClick={() => {
        if (item.href === "/analysis") {
          resetState();
        }
      }}
    >
      <Link to={item.href}>{item.title}</Link>
    </Anchor>
  ));
  if (id) {
    return (
      <div className={style.wrapper}>
        <Breadcrumbs style={{ marginBottom: "16px" }}>{items}</Breadcrumbs>

        <LoadingOverlay visible={isLoading} />
        {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
        {predictionResult && <ResultInfo prediction={predictionResult} />}
        {predictionResult && (
          <Button
            mt={"32px"}
            onClick={() => {
              resetState();
              navigate("/analysis");
            }}
            loading={isLoading}
            className={style.submitButton}
            size="md"
          >
            Новый отчет
          </Button>
        )}
        {!isLoading && !predictionResult && !error && (
          <p>Анализ с ID "{id}" не найден или произошла ошибка.</p>
        )}
      </div>
    );
  }

  return (
    <div className={style.wrapper}>
      <Breadcrumbs style={{ marginBottom: "16px" }}>{items}</Breadcrumbs>

      <div className={style.inputContainer}>
        <div style={{ flex: "2" }}>
          <DropzoneButton
            onFilesDrop={handleFileDrop}
            filePreview={filePreview}
            selectedFile={selectedFile}
          />
        </div>
        <div className={style.inputWrapper}>
          <Select
            placeholder="Выберите пациента"
            data={patientOptions}
            label="Пациент"
            value={formData.patient_id}
            onChange={(value) => handleFormChange("patient_id", value || "")}
            searchable
            clearable
            nothingFoundMessage="Пациенты не найдены"
          />
          <div className={style.textareaWrapper}>
            <Textarea
              classNames={{ input: style.input, wrapper: style.wrapper }}
              label="Примечание"
              placeholder="Введите заметки, если необходимо"
              value={formData.notes}
              onChange={(e) => handleFormChange("notes", e.currentTarget.value)}
              minRows={4}
              styles={{
                root: {
                  height: "100%",
                },
              }}
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmitRequest}
        disabled={!selectedFile || isLoading}
        loading={isLoading}
        className={style.submitButton}
        size="md"
      >
        Сформировать отчет
      </Button>
      {isLoading && (
        <p className={style.warning}>
          Отчет может формироваться несколько минут. Пожалуйста, не закрывайте
          страницу!
        </p>
      )}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
      {predictionResult && <ResultInfo prediction={predictionResult} />}
    </div>
  );
};

export default AnalysisPage;
