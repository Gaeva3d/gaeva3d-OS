export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      approvals: {
        Row: {
          created_at: string;
          created_by: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          decided_at: string | null;
          decided_by: string | null;
          evidence_path: string | null;
          id: string;
          notes: string | null;
          order_file_id: string | null;
          order_id: string;
          status: Database["public"]["Enums"]["approval_status"];
          updated_at: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          decided_at?: string | null;
          decided_by?: string | null;
          evidence_path?: string | null;
          id?: string;
          notes?: string | null;
          order_file_id?: string | null;
          order_id: string;
          status?: Database["public"]["Enums"]["approval_status"];
          updated_at?: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          decided_at?: string | null;
          decided_by?: string | null;
          evidence_path?: string | null;
          id?: string;
          notes?: string | null;
          order_file_id?: string | null;
          order_id?: string;
          status?: Database["public"]["Enums"]["approval_status"];
          updated_at?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "approvals_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "approvals_decided_by_fkey";
            columns: ["decided_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "approvals_order_file_id_fkey";
            columns: ["order_file_id"];
            isOneToOne: false;
            referencedRelation: "order_files";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "approvals_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          comment: string | null;
          created_at: string;
          id: number;
          new_values: Json | null;
          old_values: Json | null;
          record_id: string | null;
          table_name: string;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          comment?: string | null;
          created_at?: string;
          id?: never;
          new_values?: Json | null;
          old_values?: Json | null;
          record_id?: string | null;
          table_name: string;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          comment?: string | null;
          created_at?: string;
          id?: never;
          new_values?: Json | null;
          old_values?: Json | null;
          record_id?: string | null;
          table_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          city: string | null;
          company_name: string | null;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          email: string | null;
          id: string;
          name: string;
          notes: string | null;
          phone: string;
          state: string | null;
          updated_at: string;
        };
        Insert: {
          city?: string | null;
          company_name?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          phone: string;
          state?: string | null;
          updated_at?: string;
        };
        Update: {
          city?: string | null;
          company_name?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          phone?: string;
          state?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      order_assignments: {
        Row: {
          role_in_order: string;
          assigned_at: string;
          assigned_by: string | null;
          assigned_to: string | null;
          id: string;
          is_current: boolean;
          notes: string | null;
          order_id: string;
          printer_id: string | null;
          unassigned_at: string | null;
        };
        Insert: {
          role_in_order?: string;
          assigned_at?: string;
          assigned_by?: string | null;
          assigned_to?: string | null;
          id?: string;
          is_current?: boolean;
          notes?: string | null;
          order_id: string;
          printer_id?: string | null;
          unassigned_at?: string | null;
        };
        Update: {
          role_in_order?: string;
          assigned_at?: string;
          assigned_by?: string | null;
          assigned_to?: string | null;
          id?: string;
          is_current?: boolean;
          notes?: string | null;
          order_id?: string;
          printer_id?: string | null;
          unassigned_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_assignments_assigned_by_fkey";
            columns: ["assigned_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_assignments_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "team_members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_assignments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_assignments_printer_id_fkey";
            columns: ["printer_id"];
            isOneToOne: false;
            referencedRelation: "printers";
            referencedColumns: ["id"];
          },
        ];
      };
      order_files: {
        Row: {
          bucket_id: string;
          category: Database["public"]["Enums"]["file_category"];
          created_at: string;
          deleted_at: string | null;
          file_name: string;
          id: string;
          mime_type: string | null;
          notes: string | null;
          object_path: string;
          order_id: string;
          order_item_id: string | null;
          size_bytes: number | null;
          uploaded_by: string | null;
          version: number;
        };
        Insert: {
          bucket_id?: string;
          category?: Database["public"]["Enums"]["file_category"];
          created_at?: string;
          deleted_at?: string | null;
          file_name: string;
          id?: string;
          mime_type?: string | null;
          notes?: string | null;
          object_path: string;
          order_id: string;
          order_item_id?: string | null;
          size_bytes?: number | null;
          uploaded_by?: string | null;
          version?: number;
        };
        Update: {
          bucket_id?: string;
          category?: Database["public"]["Enums"]["file_category"];
          created_at?: string;
          deleted_at?: string | null;
          file_name?: string;
          id?: string;
          mime_type?: string | null;
          notes?: string | null;
          object_path?: string;
          order_id?: string;
          order_item_id?: string | null;
          size_bytes?: number | null;
          uploaded_by?: string | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_files_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_files_order_item_id_fkey";
            columns: ["order_item_id"];
            isOneToOne: false;
            referencedRelation: "order_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_files_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          actual_material_grams: number | null;
          actual_minutes: number | null;
          category: Database["public"]["Enums"]["product_category"];
          colors: string[];
          created_at: string;
          deleted_at: string | null;
          dimensions: string | null;
          estimated_material_grams: number | null;
          estimated_minutes: number | null;
          event_date: string | null;
          finishing: string | null;
          id: string;
          material: string | null;
          name: string;
          notes: string | null;
          order_id: string;
          purpose: string | null;
          quantity: number;
          technology: string | null;
          unit_price: number;
          updated_at: string;
        };
        Insert: {
          actual_material_grams?: number | null;
          actual_minutes?: number | null;
          category: Database["public"]["Enums"]["product_category"];
          colors?: string[];
          created_at?: string;
          deleted_at?: string | null;
          dimensions?: string | null;
          estimated_material_grams?: number | null;
          estimated_minutes?: number | null;
          event_date?: string | null;
          finishing?: string | null;
          id?: string;
          material?: string | null;
          name: string;
          notes?: string | null;
          order_id: string;
          purpose?: string | null;
          quantity?: number;
          technology?: string | null;
          unit_price?: number;
          updated_at?: string;
        };
        Update: {
          actual_material_grams?: number | null;
          actual_minutes?: number | null;
          category?: Database["public"]["Enums"]["product_category"];
          colors?: string[];
          created_at?: string;
          deleted_at?: string | null;
          dimensions?: string | null;
          estimated_material_grams?: number | null;
          estimated_minutes?: number | null;
          event_date?: string | null;
          finishing?: string | null;
          id?: string;
          material?: string | null;
          name?: string;
          notes?: string | null;
          order_id?: string;
          purpose?: string | null;
          quantity?: number;
          technology?: string | null;
          unit_price?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          shipping_address: string | null;
          shipping_method: string | null;
          carrier: string | null;
          tracking_code: string | null;
          shipped_at: string | null;
          assigned_to: string | null;
          balance_value: number | null;
          block_reason: string | null;
          brand_use_authorized: boolean;
          briefing_complete: boolean;
          briefing_description: string | null;
          category: Database["public"]["Enums"]["product_category"];
          code: string;
          commercial_notes: string | null;
          created_at: string;
          created_by: string | null;
          customer_id: string;
          deleted_at: string | null;
          deposit_value: number;
          estimated_material_grams: number | null;
          estimated_minutes: number | null;
          event_date: string | null;
          id: string;
          initial_printer_id: string | null;
          internal_notes: string | null;
          mandatory_requirements: string | null;
          payment_status: Database["public"]["Enums"]["payment_status"];
          priority: Database["public"]["Enums"]["priority_level"];
          project_name: string;
          promised_at: string;
          status: Database["public"]["Enums"]["order_status"];
          total_value: number;
          updated_at: string;
          updated_by: string | null;
          urgency_reason: string | null;
        };
        Insert: {
          shipping_address?: string | null;
          shipping_method?: string | null;
          carrier?: string | null;
          tracking_code?: string | null;
          shipped_at?: string | null;
          assigned_to?: string | null;
          balance_value?: number | null;
          block_reason?: string | null;
          brand_use_authorized?: boolean;
          briefing_complete?: boolean;
          briefing_description?: string | null;
          category: Database["public"]["Enums"]["product_category"];
          code?: string;
          commercial_notes?: string | null;
          created_at?: string;
          created_by?: string | null;
          customer_id: string;
          deleted_at?: string | null;
          deposit_value?: number;
          estimated_material_grams?: number | null;
          estimated_minutes?: number | null;
          event_date?: string | null;
          id?: string;
          initial_printer_id?: string | null;
          internal_notes?: string | null;
          mandatory_requirements?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          priority?: Database["public"]["Enums"]["priority_level"];
          project_name: string;
          promised_at: string;
          status?: Database["public"]["Enums"]["order_status"];
          total_value?: number;
          updated_at?: string;
          updated_by?: string | null;
          urgency_reason?: string | null;
        };
        Update: {
          shipping_address?: string | null;
          shipping_method?: string | null;
          carrier?: string | null;
          tracking_code?: string | null;
          shipped_at?: string | null;
          assigned_to?: string | null;
          balance_value?: number | null;
          block_reason?: string | null;
          brand_use_authorized?: boolean;
          briefing_complete?: boolean;
          briefing_description?: string | null;
          category?: Database["public"]["Enums"]["product_category"];
          code?: string;
          commercial_notes?: string | null;
          created_at?: string;
          created_by?: string | null;
          customer_id?: string;
          deleted_at?: string | null;
          deposit_value?: number;
          estimated_material_grams?: number | null;
          estimated_minutes?: number | null;
          event_date?: string | null;
          id?: string;
          initial_printer_id?: string | null;
          internal_notes?: string | null;
          mandatory_requirements?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          priority?: Database["public"]["Enums"]["priority_level"];
          project_name?: string;
          promised_at?: string;
          status?: Database["public"]["Enums"]["order_status"];
          total_value?: number;
          updated_at?: string;
          updated_by?: string | null;
          urgency_reason?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "team_members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_initial_printer_id_fkey";
            columns: ["initial_printer_id"];
            isOneToOne: false;
            referencedRelation: "printers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      printers: {
        Row: {
          created_at: string;
          current_material: string | null;
          current_order_id: string | null;
          deleted_at: string | null;
          id: string;
          model: string | null;
          name: string;
          notes: string | null;
          planned_hours: number;
          status: Database["public"]["Enums"]["printer_status"];
          technology: Database["public"]["Enums"]["printer_technology"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          current_material?: string | null;
          current_order_id?: string | null;
          deleted_at?: string | null;
          id?: string;
          model?: string | null;
          name: string;
          notes?: string | null;
          planned_hours?: number;
          status?: Database["public"]["Enums"]["printer_status"];
          technology: Database["public"]["Enums"]["printer_technology"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          current_material?: string | null;
          current_order_id?: string | null;
          deleted_at?: string | null;
          id?: string;
          model?: string | null;
          name?: string;
          notes?: string | null;
          planned_hours?: number;
          status?: Database["public"]["Enums"]["printer_status"];
          technology?: Database["public"]["Enums"]["printer_technology"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "printers_current_order_id_fkey";
            columns: ["current_order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      production_events: {
        Row: {
          created_at: string;
          created_by: string | null;
          duration_minutes: number | null;
          event_type: Database["public"]["Enums"]["production_event_type"];
          failure_reason: string | null;
          id: string;
          is_reprint: boolean;
          material_grams: number | null;
          new_status: Database["public"]["Enums"]["production_job_status"] | null;
          notes: string | null;
          order_id: string;
          previous_status: Database["public"]["Enums"]["production_job_status"] | null;
          production_job_id: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          duration_minutes?: number | null;
          event_type: Database["public"]["Enums"]["production_event_type"];
          failure_reason?: string | null;
          id?: string;
          is_reprint?: boolean;
          material_grams?: number | null;
          new_status?: Database["public"]["Enums"]["production_job_status"] | null;
          notes?: string | null;
          order_id: string;
          previous_status?: Database["public"]["Enums"]["production_job_status"] | null;
          production_job_id?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          duration_minutes?: number | null;
          event_type?: Database["public"]["Enums"]["production_event_type"];
          failure_reason?: string | null;
          id?: string;
          is_reprint?: boolean;
          material_grams?: number | null;
          new_status?: Database["public"]["Enums"]["production_job_status"] | null;
          notes?: string | null;
          order_id?: string;
          previous_status?: Database["public"]["Enums"]["production_job_status"] | null;
          production_job_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "production_events_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "production_events_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "production_events_production_job_id_fkey";
            columns: ["production_job_id"];
            isOneToOne: false;
            referencedRelation: "production_jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      production_jobs: {
        Row: {
          actual_material_grams: number | null;
          actual_minutes: number | null;
          assigned_to: string | null;
          attempt_number: number;
          created_at: string;
          created_by: string | null;
          estimated_material_grams: number | null;
          estimated_minutes: number | null;
          failure_reason: string | null;
          finished_at: string | null;
          id: string;
          notes: string | null;
          order_id: string;
          order_item_id: string | null;
          planned_end_at: string | null;
          planned_start_at: string | null;
          printer_id: string | null;
          queue_position: number | null;
          reprint_of_id: string | null;
          started_at: string | null;
          status: Database["public"]["Enums"]["production_job_status"];
          updated_at: string;
        };
        Insert: {
          actual_material_grams?: number | null;
          actual_minutes?: number | null;
          assigned_to?: string | null;
          attempt_number?: number;
          created_at?: string;
          created_by?: string | null;
          estimated_material_grams?: number | null;
          estimated_minutes?: number | null;
          failure_reason?: string | null;
          finished_at?: string | null;
          id?: string;
          notes?: string | null;
          order_id: string;
          order_item_id?: string | null;
          planned_end_at?: string | null;
          planned_start_at?: string | null;
          printer_id?: string | null;
          queue_position?: number | null;
          reprint_of_id?: string | null;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["production_job_status"];
          updated_at?: string;
        };
        Update: {
          actual_material_grams?: number | null;
          actual_minutes?: number | null;
          assigned_to?: string | null;
          attempt_number?: number;
          created_at?: string;
          created_by?: string | null;
          estimated_material_grams?: number | null;
          estimated_minutes?: number | null;
          failure_reason?: string | null;
          finished_at?: string | null;
          id?: string;
          notes?: string | null;
          order_id?: string;
          order_item_id?: string | null;
          planned_end_at?: string | null;
          planned_start_at?: string | null;
          printer_id?: string | null;
          queue_position?: number | null;
          reprint_of_id?: string | null;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["production_job_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "production_jobs_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "team_members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "production_jobs_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "production_jobs_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "production_jobs_order_item_id_fkey";
            columns: ["order_item_id"];
            isOneToOne: false;
            referencedRelation: "order_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "production_jobs_printer_id_fkey";
            columns: ["printer_id"];
            isOneToOne: false;
            referencedRelation: "printers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "production_jobs_reprint_of_id_fkey";
            columns: ["reprint_of_id"];
            isOneToOne: false;
            referencedRelation: "production_jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_path: string | null;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          is_active: boolean;
          phone: string | null;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string;
        };
        Insert: {
          avatar_path?: string | null;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id: string;
          is_active?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Update: {
          avatar_path?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          access_role: Database["public"]["Enums"]["app_role"];
          avatar_path: string | null;
          capacity_limit: number;
          created_at: string;
          deleted_at: string | null;
          email: string | null;
          id: string;
          is_active: boolean;
          job_title: string;
          name: string;
          notes: string | null;
          phone: string | null;
          specialties: string[];
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          access_role?: Database["public"]["Enums"]["app_role"];
          avatar_path?: string | null;
          capacity_limit?: number;
          created_at?: string;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          job_title: string;
          name: string;
          notes?: string | null;
          phone?: string | null;
          specialties?: string[];
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          access_role?: Database["public"]["Enums"]["app_role"];
          avatar_path?: string | null;
          capacity_limit?: number;
          created_at?: string;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          job_title?: string;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          specialties?: string[];
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      order_operational_summary: {
        Row: Database["public"]["Tables"]["orders"]["Row"] & {
          quantity: number;
          customer_name: string;
          customer_phone: string;
          city: string | null;
          state: string | null;
          seller_name: string | null;
          owner_name: string | null;
          designer_id: string | null;
          designer_name: string | null;
          stage: string;
          stage_entered_at: string;
          revision_count: number;
          approval_version: number | null;
          approval_status: Database["public"]["Enums"]["approval_status"] | null;
          approval_sent_at: string | null;
          job_status: Database["public"]["Enums"]["production_job_status"] | null;
          print_failure_reason: string | null;
          modeling_started_at: string | null;
          thumbnail_path: string | null;
          thumbnail_bucket: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      link_team_access: {
        Args: { p_member_id: string; p_user_id: string };
        Returns: Json;
      };
      prepare_team_access: {
        Args: {
          p_capacity?: number;
          p_email: string;
          p_job_title?: string;
          p_member_id?: string;
          p_name?: string;
          p_role?: Database["public"]["Enums"]["app_role"];
        };
        Returns: Json;
      };
      operate_order: {
        Args: {
          p_order_id: string;
          p_action: string;
          p_expected_updated_at: string;
          p_payload?: Json;
        };
        Returns: Json;
      };
      order_history: {
        Args: { p_order_id: string; p_before_id?: number; p_limit?: number };
        Returns: Database["public"]["Tables"]["audit_logs"]["Row"][];
      };
      generate_order_code: { Args: never; Returns: string };
    };
    Enums: {
      app_role: "admin" | "commercial" | "production" | "viewer" | "designer";
      approval_status: "pending" | "approved" | "changes_requested" | "rejected";
      file_category:
        | "reference"
        | "briefing"
        | "model"
        | "approval"
        | "production"
        | "quality"
        | "shipping"
        | "other";
      order_status:
        | "received"
        | "briefing_pending"
        | "modeling"
        | "internal_review"
        | "awaiting_customer_approval"
        | "approved_for_production"
        | "print_queue"
        | "printing"
        | "finishing"
        | "quality_control"
        | "packaging"
        | "shipping"
        | "completed"
        | "blocked"
        | "cancelled";
      payment_status:
        "invoiced" | "pending" | "partial" | "paid" | "overdue" | "refunded" | "cancelled";
      printer_status: "available" | "printing" | "maintenance" | "offline";
      printer_technology: "fdm" | "resin" | "other";
      priority_level: "normal" | "high" | "urgent" | "critical";
      product_category:
        | "corporate"
        | "keychain"
        | "statuette"
        | "corporate_mascot"
        | "trophy"
        | "corporate_keychain"
        | "custom_pet"
        | "custom_piece"
        | "other";
      production_event_type:
        | "started"
        | "paused"
        | "resumed"
        | "completed"
        | "failed"
        | "reprint"
        | "note"
        | "material_update";
      production_job_status: "queued" | "running" | "paused" | "failed" | "completed" | "cancelled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "commercial", "production", "viewer", "designer"],
      approval_status: ["pending", "approved", "changes_requested", "rejected"],
      file_category: [
        "reference",
        "briefing",
        "model",
        "approval",
        "production",
        "quality",
        "shipping",
        "other",
      ],
      order_status: [
        "received",
        "briefing_pending",
        "modeling",
        "internal_review",
        "awaiting_customer_approval",
        "approved_for_production",
        "print_queue",
        "printing",
        "finishing",
        "quality_control",
        "packaging",
        "shipping",
        "completed",
        "blocked",
        "cancelled",
      ],
      payment_status: [
        "invoiced",
        "pending",
        "partial",
        "paid",
        "overdue",
        "refunded",
        "cancelled",
      ],
      printer_status: ["available", "printing", "maintenance", "offline"],
      printer_technology: ["fdm", "resin", "other"],
      priority_level: ["normal", "high", "urgent", "critical"],
      product_category: [
        "corporate",
        "keychain",
        "statuette",
        "corporate_mascot",
        "trophy",
        "corporate_keychain",
        "custom_pet",
        "custom_piece",
        "other",
      ],
      production_event_type: [
        "started",
        "paused",
        "resumed",
        "completed",
        "failed",
        "reprint",
        "note",
        "material_update",
      ],
      production_job_status: ["queued", "running", "paused", "failed", "completed", "cancelled"],
    },
  },
} as const;
