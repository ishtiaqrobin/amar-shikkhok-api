export interface CreateBookingInput {
  studentId: string;
  tutorId: string;
  subject: string;
  sessionDate: Date | string;
  startTime: string;
  endTime: string;
  notes?: string;
  totalPrice: number;
}
