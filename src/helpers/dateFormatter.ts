import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";

export function formatDate(fecha: Date | string): string {
  let date: Date;
  if (typeof fecha === "string") {
    date = new Date(fecha);
  } else {
    date = fecha;
  }

  const now = new Date();
  const minutesDifference = differenceInMinutes(now, date);
  const hoursDifference = differenceInHours(now, date);
  const daysDifference = differenceInDays(now, date);

  if (minutesDifference < 60) {
    return (
      "hace " +
      minutesDifference +
      " minuto" +
      (minutesDifference > 1 ? "s" : "")
    );
  } else if (daysDifference < 1 && date.getDate() === now.getDate()) {
    return (
      "hace " + hoursDifference + " hora" + (hoursDifference > 1 ? "s" : "")
    );
  } else if (
    daysDifference === 1 ||
    (daysDifference < 1 && date.getDate() !== now.getDate())
  ) {
    return "ayer";
  } else if (daysDifference <= 3) {
    return daysDifference + " día" + (daysDifference > 1 ? "s" : "") + " atrás";
  } else if (date instanceof Date && !isNaN(date.getTime())) {
    return format(date, "dd/MM/yyyy");
  } else {
    console.error("Fecha inválida:", fecha);
    return "";
  }
}
