export interface CreateReviewInput {
  studentId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}
