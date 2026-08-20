import { format } from "date-fns";

export function formatDate(fecha: Date | string): string {
  const date = typeof fecha === "string" ? new Date(fecha) : fecha;

  if (date instanceof Date && !isNaN(date.getTime())) {
    return format(date, "dd/MM/yyyy");
  }

  console.error("Fecha inválida:", fecha);
  return "";
}