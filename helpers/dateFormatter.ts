import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";

export function formatDate(fecha: Date): string {
  const now = new Date();
  const minutesDifference = differenceInMinutes(now, fecha);
  const hoursDifference = differenceInHours(now, fecha);
  const daysDifference = differenceInDays(now, fecha);

  if (minutesDifference < 60) {
    return (
      "hace " +
      minutesDifference +
      " minuto" +
      (minutesDifference > 1 ? "s" : "")
    );
  } else if (daysDifference < 1 && fecha.getDate() === now.getDate()) {
    return (
      "hace " + hoursDifference + " hora" + (hoursDifference > 1 ? "s" : "")
    );
  } else if (
    daysDifference === 1 ||
    (daysDifference < 1 && fecha.getDate() !== now.getDate())
  ) {
    return "ayer";
  } else if (daysDifference <= 3) {
    return daysDifference + " día" + (daysDifference > 1 ? "s" : "") + " atrás";
  } else if (fecha instanceof Date && !isNaN(fecha.getTime())) {
    return format(fecha, "dd/MM/yyyy");
  } else {
    console.error("Fecha inválida:", fecha);
    return "";
  }
}
