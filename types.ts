
export interface Car {
  id: string;
  listing_id?: string;
  user_id: string;
  listing_title: string;
  make: string;
  model: string;
  body_type: string;
  year: number;
  condition: string;
  stock_number?: string;
  vin_number?: string;
  mileage: number;
  transmission: string;
  driver_type?: string;
  engine_size?: string;
  cylinders?: number;
  fuel_type: string;
  doors?: number;
  color?: string;
  seats?: number;
  city_mpg?: number;
  highway_mpg?: number;
  currency: string;
  price: number;
  old_price?: number;
  description: string;
  location_city: string;
  location_country: string;
  location_address?: string;
  status: string;
  is_paid: boolean;
  plan_type: string;
  paid_until?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  vehicle_type?: string;
  main_image_url: string;
  report_url?: string;
  video_url?: string;
  plan_id?: string;
  // Join data
  profiles?: Profile;
  // UI helper properties
  monthly?: number;
  specs?: string[];
  // Added features property to support listing creation and drafts
  features?: string[];
  type?: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  business_name: string | null;
  business_address: string | null;
  business_phone: string | null;
  logo_url: string | null;
  avatar_url: string | null;
  is_dealer: boolean;
  email: string | null;
  // Added role property to Profile interface to support role-based validation checks
  role?: string | null;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  position: number;
}

export interface ListingFeature {
  id: number;
  listing_id: string;
  category: string;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}
