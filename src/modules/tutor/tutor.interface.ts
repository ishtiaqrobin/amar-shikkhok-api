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
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}
