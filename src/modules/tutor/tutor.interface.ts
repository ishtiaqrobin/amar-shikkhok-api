export interface CreateTutorInput {
  userId: string;
  bio?: string;
  expertise: string[];
  hourlyRate: number;
  experience: number;
  education?: string;
  categoryIds: string[];
}

export interface GetTutorsParams {
  search?: string;
  category?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface UpdateTutorInput {
  bio?: string;
  expertise?: string[];
  hourlyRate?: number;
  experience?: number;
  education?: string;
  rating?: number;
  totalReviews?: number;
  totalSessions?: number;
  categoryIds?: string[];
}

export interface CreateAvailabilityInput {
  tutorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}

export interface UpdateAvailabilityInput {
  dayOfWeek: number;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
}
