
import { Car, Article, Brand } from './types';

export const THEME_COLOR = '#237837'; 

// Update this to your actual dashboard project URL
export const DASHBOARD_URL = 'https://dashboard.autosource.co.zw';

export const TOP_CATEGORIES = [
  'Coupe', 'Crossover', 'Hatchback', 'Minivan', 'Sedan', 'Sports Car', 'Supercar', 'SUV', 'Truck', 'Van', 'Wagon'
];

export const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'marketplace', label: 'Marketplace', href: '#' },
  { id: 'used', label: 'Used cars', href: '#' },
  { id: 'new', label: 'New cars', href: '#' },
  { id: 'value', label: 'Value your car', href: '#' },
  { id: 'leasing', label: 'Car Rental', href: 'https://raytrentscarrental.com' },
];

export const CAR_TYPES = [
  'Coupe', 'Crossover', 'Hatchback', 'Minivan', 'Sedan', 'Sports Car', 'Supercar', 'SUV', 'Truck', 'Van', 'Wagon'
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Top 5 Most Reliable Used Cars in Zimbabwe',
    category: 'Buying Guide',
    date: 'Oct 12, 2024',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'How to Value Your Car for Trade-in',
    category: 'Selling',
    date: 'Oct 10, 2024',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Electric Vehicles: Is Zimbabwe Ready?',
    category: 'Market News',
    date: 'Oct 05, 2024',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800'
  }
];

export const BRANDS: Brand[] = [
  { id: '1', name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/1200px-Toyota_carlogo.svg.png' },
  { id: '2', name: 'Nissan', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Nissan_logo.png/1200px-Nissan_logo.png' },
  { id: '3', name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/1200px-Ford_logo_flat.svg.png' },
  { id: '4', name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/1200px-Volkswagen_logo_2019.svg.png' },
  { id: '5', name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_logo%2C_2010.svg/2048px-Mercedes-Benz_logo%2C_2010.svg.png' },
  { id: '6', name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png' },
  { id: '7', name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/2560px-Audi-Logo_2016.svg.png' },
  { id: '8', name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/1200px-Honda_Logo.svg.png' },
];

export const MOCK_CARS: Car[] = [
  {
    id: 'lease-1',
    user_id: 'user-raytrents',
    listing_title: '2024 Toyota Land Cruiser Prado',
    make: 'Toyota',
    model: 'Prado',
    body_type: 'SUV',
    year: 2024,
    condition: 'New',
    mileage: 0,
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    currency: 'USD',
    price: 1250,
    description: 'Premium leasing offer from Raytrents Car Rental. Full service and insurance included in the monthly price.',
    location_city: 'Harare',
    location_country: 'Zimbabwe',
    status: 'approved',
    is_paid: true,
    plan_type: 'Lease',
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    main_image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    type: 'Lease'
  }
];
