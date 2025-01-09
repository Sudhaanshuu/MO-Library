export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      seats: {
        Row: {
          id: number;
          row_number: number;
          seat_number: number;
          is_available: boolean;
          last_booked_at: string | null;
        };
        Insert: {
          id?: number;
          row_number: number;
          seat_number: number;
          is_available?: boolean;
          last_booked_at?: string | null;
        };
        Update: {
          id?: number;
          row_number?: number;
          seat_number?: number;
          is_available?: boolean;
          last_booked_at?: string | null;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          seat_id: number;
          booked_at: string;
          expires_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          seat_id: number;
          booked_at?: string;
          expires_at: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          seat_id?: number;
          booked_at?: string;
          expires_at?: string;
          is_active?: boolean;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
}