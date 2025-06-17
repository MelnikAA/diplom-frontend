import { useRef } from "react";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import { Group, Text, useMantineTheme } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import type { FileWithPath } from "@mantine/dropzone";
import classes from "./dropzone.module.scss";

interface DropzoneButtonProps {
  onFilesDrop: (files: FileWithPath[]) => void;
  filePreview: string | null;
  selectedFile: FileWithPath | null;
}

export function DropzoneButton({
  onFilesDrop,
  filePreview,
  selectedFile,
}: DropzoneButtonProps) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={onFilesDrop}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
        maxSize={30 * 1024 ** 2}
      >
        {filePreview && selectedFile ? (
          <div className={classes.previewContainer}>
            <img
              src={filePreview}
              alt="Предварительный просмотр"
              className={classes.imagePreview}
            />
            <Text>{selectedFile.name}</Text>
          </div>
        ) : (
          <div style={{ pointerEvents: "none" }}>
            <Group justify="center">
              <Dropzone.Accept>
                <IconDownload
                  size={50}
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload
                  size={50}
                  stroke={1.5}
                  className={classes.icon}
                />
              </Dropzone.Idle>
            </Group>

            <Text ta="center" fw={700} fz="lg" mt="xl">
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>
                Png или Jpeg файл вером менее 50 мг
              </Dropzone.Reject>
              <Dropzone.Idle>Загрузите снимок</Dropzone.Idle>
            </Text>

            <Text className={classes.description}>
              Перетащите сюда файлы для загрузки. Нужны файлы в формате{" "}
              <i>.png</i> или <i>.jpeg</i> размером менее 50 МГ.
            </Text>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
