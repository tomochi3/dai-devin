import { 
  User, CounselorProfile, Appointment, AvailabilitySlot, 
  InitialScreening, CounselorSpecialty, AppointmentStatus, UserRole,
  ScreeningResult
} from '../types';

const generateDates = (daysAhead: number = 7) => {
  const dates: Date[] = [];
  const now = new Date();
  
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

const generateTimeSlots = (date: Date, count: number = 8) => {
  const slots: Date[] = [];
  const startHour = 9;
  
  for (let i = 0; i < count; i++) {
    const slot = new Date(date);
    slot.setHours(startHour + Math.floor(i / 2), (i % 2) * 30, 0, 0);
    slots.push(slot);
  }
  
  return slots;
};

const generateId = () => Math.random().toString(36).substring(2, 15);

export const mockUsers: User[] = [
  {
    id: '1',
    name: '佐藤 健太',
    email: 'kenta@example.com',
    role: UserRole.CLIENT,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: '山田 花子',
    email: 'hanako@example.com',
    role: UserRole.CLIENT,
    created_at: new Date().toISOString()
  }
];

export const mockCounselors: CounselorProfile[] = [
  {
    id: '101',
    user_id: '901',
    bio: '田中 心理士 - 10年以上の臨床経験があります。心理カウンセリングのスペシャリストです。',
    specialties: [CounselorSpecialty.DEPRESSION, CounselorSpecialty.ANXIETY],
    hourly_rate: 5000,
    is_professional: true,
    available_slots: []
  },
  {
    id: '102',
    user_id: '902',
    bio: '鈴木 カウンセラー - 家族関係の問題解決をサポートします。',
    specialties: [CounselorSpecialty.RELATIONSHIPS, CounselorSpecialty.STRESS],
    hourly_rate: 4500,
    is_professional: true,
    available_slots: []
  },
  {
    id: '103',
    user_id: '903',
    bio: '高橋 ピアサポーター - 同じ経験を持つ仲間としてあなたの話を聞きます。',
    specialties: [CounselorSpecialty.GENERAL, CounselorSpecialty.CAREER],
    hourly_rate: 0,
    is_professional: false,
    available_slots: []
  },
  {
    id: '104',
    user_id: '904',
    bio: '伊藤 メンタルコーチ - ポジティブな思考法と目標達成をサポートします。',
    specialties: [CounselorSpecialty.CAREER, CounselorSpecialty.STRESS],
    hourly_rate: 4800,
    is_professional: true,
    available_slots: []
  },
  {
    id: '105',
    user_id: '905',
    bio: '佐々木 サポーター - 日常生活での不安や悩みに寄り添います。',
    specialties: [CounselorSpecialty.GENERAL, CounselorSpecialty.ANXIETY],
    hourly_rate: 0,
    is_professional: false,
    available_slots: []
  }
];

export let mockAvailabilitySlots: AvailabilitySlot[] = [];

const dates = generateDates(7);
dates.forEach((date) => {
  const timeSlots = generateTimeSlots(date);
  
  mockCounselors.forEach((counselor) => {
    const availableSlots = timeSlots.filter(() => Math.random() > 0.6);
    
    availableSlots.forEach((slot) => {
      const endSlot = new Date(slot);
      endSlot.setHours(endSlot.getHours() + 1);
      
      const availabilitySlot: AvailabilitySlot = {
        counselor_id: counselor.id,
        start_time: slot.toISOString(),
        end_time: endSlot.toISOString(),
        is_booked: false
      };
      
      mockAvailabilitySlots.push(availabilitySlot);
    });
  });
});

export let mockAppointments: Appointment[] = [];

export const mockScreeningResults: InitialScreening[] = [
  {
    id: '201',
    user_id: '1',
    result: ScreeningResult.PASS,
    notes: '健康的な精神状態が確認されました。',
    created_at: new Date().toISOString()
  }
];

export const mockStore = {
  bookAppointment: (slot: AvailabilitySlot, clientId: string = '1'): Appointment => {
    const slotIndex = mockAvailabilitySlots.findIndex(
      s => s.counselor_id === slot.counselor_id && s.start_time === slot.start_time
    );
    
    if (slotIndex >= 0) {
      mockAvailabilitySlots[slotIndex].is_booked = true;
    }
    
    const appointment: Appointment = {
      id: generateId(),
      client_id: clientId,
      counselor_id: slot.counselor_id,
      start_time: slot.start_time,
      end_time: slot.end_time,
      status: AppointmentStatus.CONFIRMED,
      meeting_link: `https://meet.google.com/mock-${generateId()}`,
      created_at: new Date().toISOString(),
      is_professional: mockCounselors.find(c => c.id === slot.counselor_id)?.is_professional || false
    };
    
    mockAppointments.push(appointment);
    return appointment;
  },
  
  startImmediateCall: (counselorId: string, clientId: string = '1'): Appointment => {
    const now = new Date();
    const endTime = new Date(now);
    endTime.setHours(endTime.getHours() + 1);
    
    const appointment: Appointment = {
      id: generateId(),
      client_id: clientId,
      counselor_id: counselorId,
      start_time: now.toISOString(),
      end_time: endTime.toISOString(),
      status: AppointmentStatus.CONFIRMED,
      meeting_link: `https://meet.google.com/mock-${generateId()}`,
      created_at: new Date().toISOString(),
      is_professional: mockCounselors.find(c => c.id === counselorId)?.is_professional || false
    };
    
    mockAppointments.push(appointment);
    return appointment;
  }
};
