export interface INotification {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "error";
  user_id?: string;
  created_at: Date;
}
