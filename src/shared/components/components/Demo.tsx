import { useEffect, useState } from "react";
import { InputBase, Popover, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import style from "./Date.module.scss";
import { IMaskInput } from "react-imask";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { IconCalendarWeek } from "@tabler/icons-react";

type DateInputProps = {
  value: Date | null;
  onChange: (value: Date | null) => void;
  placeholder: string;
  minDate?: Date;
  maxDate?: Date;
  isMobile?: boolean;
};

const locale = "ru";

export function DateInput({
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
  isMobile,
}: DateInputProps) {
  const [opened, setOpened] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Обработчик изменения значения в маске
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);

    if (newValue.length !== 10) return;

    try {
      const [day, month, year] = newValue.split(".").map(Number);
      let parsedDate: Date | null = null;
      if (day && month && year) {
        parsedDate = new Date(year, month - 1, day);
      }
      if (
        parsedDate &&
        !isNaN(parsedDate.getTime()) &&
        (!minDate || parsedDate >= minDate) &&
        (!maxDate || parsedDate <= maxDate)
      ) {
        onChange(parsedDate);
      }
    } catch {
      // ignore
    }
  };

  // Обработчик выбора даты из календаря
  const handleDateChange = (value: string) => {
    // value может быть пустой строкой, если дата очищена
    if (!value) {
      onChange(null);
      setInputValue("");
      setOpened(false);
      return;
    }
    // value в формате "YYYY-MM-DD" или "DD.MM.YYYY" — зависит от вашей маски/locale
    // Для "YYYY-MM-DD":
    const [year, month, day] = value.split("-").map(Number);
    const parsedDate = new Date(year, month - 1, day);
    if (!isNaN(parsedDate.getTime())) {
      onChange(parsedDate);
      setInputValue(dayjs(parsedDate).locale(locale).format("DD.MM.YYYY"));
    }
    setOpened(false);
  };

  useEffect(() => {
    if (value) {
      const formattedDate = dayjs(value).locale(locale).format("DD.MM.YYYY");
      setInputValue(formattedDate);
    } else {
      setInputValue("");
    }
  }, [value]);

  return (
    <>
      {isMobile ? (
        <div className={style.wrapper}>
          <DatePicker
            value={value}
            onChange={handleDateChange}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            size="md"
            monthsListFormat="MMM"
            yearsListFormat="YYYY"
            classNames={{
              levelsGroup: style.levelsGroup,
              month: style.month,
              calendarHeader: style.calendarHeader,
            }}
          />
        </div>
      ) : (
        <Popover
          opened={opened}
          onClose={() => setOpened(false)}
          position="bottom-start"
          withArrow
        >
          <Popover.Target>
            <div className={style.inputWrapper}>
              <InputBase
                component={IMaskInput}
                mask="00.00.0000"
                value={inputValue}
                onClick={() => setOpened((o) => !o)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                leftSection={<IconCalendarWeek />}
                onAccept={handleInputChange}
                classNames={{
                  input: isFocused ? style.inputFocused : style.input,
                  section: style.section,
                }}
              />
              <Text
                className={`${style.placeholder} ${
                  inputValue || isFocused ? style["placeholder-active"] : ""
                }`}
              >
                {placeholder}
              </Text>
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <DatePicker
              value={value}
              onChange={handleDateChange}
              minDate={minDate}
              maxDate={maxDate}
              locale={locale}
              monthsListFormat="MMM"
              yearsListFormat="YYYY"
            />
          </Popover.Dropdown>
        </Popover>
      )}
    </>
  );
}
