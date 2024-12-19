export interface INotification {
  id: string;
  title: string;
  description: string;
  tipo: "info" | "warning" | "error";
  user_id?: string;
  created_At: Date;
}
