export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          is_active: boolean
          role: 'user' | 'admin'
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          is_active?: boolean
          role?: 'user' | 'admin'
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          is_active?: boolean
          role?: 'user' | 'admin'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 