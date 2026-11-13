export interface Stall {
  id: number;
  ownerId: number;
  name: string;
  category?: string | null;
  location?: string | null;
  description?: string | null;
  avgRating: number;
  reviewCount: number;
  isPopular: boolean;
}

export interface MenuItem {
  id: number;
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface StallMeta {
  page: number;
  limit: number;
  total: number;
}

export interface StallResponse {
  status: string;
  meta: StallMeta;
  data: Stall[];
}

export interface StallDetailResponse {
  status: string;
  data: Stall;
}

export interface StallMenusResponse {
  status: string;
  data: MenuItem[];
}

export interface StallQueryParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface StallInput {
  name: string;
  category?: string;
  location?: string;
  description?: string;
}
