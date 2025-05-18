export enum UserRole {
  CLIENT = "client",
  COUNSELOR = "counselor"
}

export enum CounselorSpecialty {
  GENERAL = "general",
  DEPRESSION = "depression",
  ANXIETY = "anxiety",
  RELATIONSHIPS = "relationships",
  CAREER = "career",
  STRESS = "stress"
}

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed"
}

export enum ScreeningResult {
  PASS = "pass",
  REFER = "refer",
  BLOCK = "block"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface CounselorProfile {
  id: string;
  user_id: string;
  bio: string;
  specialties: CounselorSpecialty[];
  hourly_rate?: number;
  is_professional: boolean;
  available_slots: string[];
}

export interface Appointment {
  id: string;
  client_id: string;
  counselor_id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  meeting_link?: string;
  created_at: string;
  is_professional: boolean;
}

export interface AvailabilitySlot {
  counselor_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export interface InitialScreening {
  id: string;
  user_id: string;
  result: ScreeningResult;
  notes?: string;
  created_at: string;
}

export interface CreateAppointmentRequest {
  client_id: string;
  counselor_id: string;
  start_time: string;
  end_time: string;
  is_professional: boolean;
}

export interface ScreeningRequest {
  user_id: string;
  answers: string[];
}
