export const COLORS = [
  "#FF6384", // Red
  "#36A2EB", // Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
  "#FF9F40", // Orange
  "#C9CBCF", // Gray
  "#FF6384", // Pink
];

export const legendItems = [
  { value: "alimentacion", label: "Alimentación", color: COLORS[0] },
  { value: "transporte", label: "Transporte", color: COLORS[1] },
  { value: "salud", label: "Salud", color: COLORS[2] },
  { value: "hogar", label: "Hogar", color: COLORS[3] },
  { value: "finanzas", label: "Finanzas", color: COLORS[4] },
  { value: "educacion", label: "Educación", color: COLORS[5] },
  { value: "personal", label: "Personal", color: COLORS[6] },
  { value: "casuales", label: "Casuales", color: COLORS[7] },
];

export const getCategoryColor = (categoryValue: string) => {
  const item = legendItems.find((item) => item.value === categoryValue);
  return item?.color || "#C9CBCF"; // Default gray if not found
};
