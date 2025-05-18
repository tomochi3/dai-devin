import { 
  User, CounselorProfile, Appointment, AvailabilitySlot, 
  InitialScreening, CreateAppointmentRequest, ScreeningRequest,
  ScreeningResult
} from '../types';
import { 
  mockUsers, mockCounselors, mockAvailabilitySlots, 
  mockAppointments, mockScreeningResults, mockStore 
} from './mockData';

const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getUsers = async (): Promise<User[]> => {
  await mockDelay();
  return mockUsers;
};

export const getUser = async (userId: string): Promise<User> => {
  await mockDelay();
  const user = mockUsers.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const createUser = async (user: Omit<User, 'id' | 'created_at'>): Promise<User> => {
  await mockDelay();
  const newUser: User = {
    ...user as any,
    id: Math.random().toString(36).substring(2, 15),
    created_at: new Date().toISOString()
  };
  mockUsers.push(newUser);
  return newUser;
};

export const getCounselors = async (): Promise<CounselorProfile[]> => {
  await mockDelay();
  return mockCounselors;
};

export const getCounselor = async (counselorId: string): Promise<CounselorProfile> => {
  await mockDelay();
  const counselor = mockCounselors.find(c => c.id === counselorId);
  if (!counselor) {
    throw new Error('Counselor not found');
  }
  return counselor;
};

export const getCounselorAvailability = async (
  counselorId: string,
  startDate?: string,
  endDate?: string
): Promise<AvailabilitySlot[]> => {
  await mockDelay();
  let slots = mockAvailabilitySlots.filter(slot => slot.counselor_id === counselorId && !slot.is_booked);
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    slots = slots.filter(slot => {
      const slotDate = new Date(slot.start_time);
      return slotDate >= start && slotDate <= end;
    });
  }
  
  return slots;
};

export const createAppointment = async (
  appointment: CreateAppointmentRequest
): Promise<Appointment> => {
  await mockDelay();
  
  const slot = mockAvailabilitySlots.find(
    slot => 
      slot.counselor_id === appointment.counselor_id && 
      slot.start_time === appointment.start_time &&
      !slot.is_booked
  );
  
  if (!slot) {
    throw new Error('Slot not available');
  }
  
  return mockStore.bookAppointment(slot, appointment.client_id);
};

export const getAppointment = async (appointmentId: string): Promise<Appointment> => {
  await mockDelay();
  const appointment = mockAppointments.find(a => a.id === appointmentId);
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  return appointment;
};

export const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
  await mockDelay();
  return mockAppointments.filter(a => a.client_id === userId);
};

export const getAvailableSlots = async (
  startDate?: string,
  endDate?: string
): Promise<AvailabilitySlot[]> => {
  await mockDelay();
  let slots = mockAvailabilitySlots.filter(slot => !slot.is_booked);
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    slots = slots.filter(slot => {
      const slotDate = new Date(slot.start_time);
      return slotDate >= start && slotDate <= end;
    });
  }
  
  return slots;
};

export const performScreening = async (
  screening: ScreeningRequest
): Promise<InitialScreening> => {
  await mockDelay();
  
  const result: InitialScreening = {
    id: Math.random().toString(36).substring(2, 15),
    user_id: screening.user_id,
    result: ScreeningResult.PASS,
    notes: 'スクリーニング完了。カウンセリングサービスをご利用いただけます。',
    created_at: new Date().toISOString()
  };
  
  mockScreeningResults.push(result);
  return result;
};

export const getScreeningResult = async (userId: string): Promise<InitialScreening> => {
  await mockDelay();
  const result = mockScreeningResults.find(r => r.user_id === userId);
  if (!result) {
    throw new Error('Screening result not found');
  }
  return result;
};

export const startImmediateCall = async (counselorId: string): Promise<Appointment> => {
  await mockDelay();
  return mockStore.startImmediateCall(counselorId);
};
