export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      balance_adjustments: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          id: number
          label: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: number
          label?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: number
          label?: string | null
          user_id?: string
        }
        Relationships: []
      }
      debts: {
        Row: {
          amount: number
          created_at: string
          creditor: string | null
          id: number
          name: string
          notes: string | null
          original_amount: number | null
          status: Database["public"]["Enums"]["debt_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          creditor?: string | null
          id?: number
          name: string
          notes?: string | null
          original_amount?: number | null
          status?: Database["public"]["Enums"]["debt_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          creditor?: string | null
          id?: number
          name?: string
          notes?: string | null
          original_amount?: number | null
          status?: Database["public"]["Enums"]["debt_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          currency: string | null
          date: string | null
          description: string | null
          id: number
          id_category: number | null
          number: number | null
          periodicity: boolean | null
          user_id: string
        }
        Insert: {
          amount: number
          currency?: string | null
          date?: string | null
          description?: string | null
          id?: number
          id_category?: number | null
          number?: number | null
          periodicity?: boolean | null
          user_id: string
        }
        Update: {
          amount?: number
          currency?: string | null
          date?: string | null
          description?: string | null
          id?: number
          id_category?: number | null
          number?: number | null
          periodicity?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_id_category_categories_id_fk"
            columns: ["id_category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      incomes: {
        Row: {
          amount: number
          created_At: string
          description: string
          id: number
          id_debt: number | null
          user_id: string
        }
        Insert: {
          amount: number
          created_At?: string
          description: string
          id?: number
          id_debt?: number | null
          user_id: string
        }
        Update: {
          amount?: number
          created_At?: string
          description?: string
          id?: number
          id_debt?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incomes_id_debt_fkey"
            columns: ["id_debt"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      purge_old_transactions: {
        Args: { p_older_than_days: number; p_type: string; p_user_id: string }
        Returns: {
          purged_expenses: number
          purged_incomes: number
          success: boolean
        }[]
      }
    }
    Enums: {
      debt_status: "active" | "paid" | "overdue" | "partial"
      notification_type: "info" | "warning" | "errpr"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      debt_status: ["active", "paid", "overdue", "partial"],
      notification_type: ["info", "warning", "errpr"],
    },
  },
} as const
