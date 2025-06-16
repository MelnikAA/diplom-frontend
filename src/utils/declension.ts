export function getAttemptDeclension(count: number | null | undefined): string {
  if (count === null || count === undefined) {
    return "попыток"; // или другое значение по умолчанию, если число неизвестно
  }

  if (count % 10 === 1 && count % 100 !== 11) {
    return "попытка";
  } else if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  ) {
    return "попытки";
  } else {
    return "попыток";
  }
}
