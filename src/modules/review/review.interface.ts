export interface CreateReviewInput {
  userId: string;
  bio?: string;
  expertise: string[];
  hourlyRate: number;
  experience: number;
  education?: string;
  categoryIds: string[];
}

export interface GetReviewParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

export interface UpdateReviewInput {
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
