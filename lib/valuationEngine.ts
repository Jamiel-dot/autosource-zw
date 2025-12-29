import { supabase } from './supabase';

export const getAIValuation = async (input: ValuationInput): Promise<ValuationResult> => {
  // 1. Fetch base price (fuzzy matching, resilient)
  const { data, error } = await supabase.rpc('get_base_price', {
    p_make: input.make,
    p_model: input.model,
    p_year: input.year,
    p_vehicle_type: 'car',
    p_fuel_type: input.fuelType || null
  });

  if (error) {
    console.warn('Valuation RPC warning:', error.message);
  }

  // Conservative fallback (Zimbabwe reality)
  const result = data?.[0] ?? {
    base_price: 6000,
    comparables_count: 0,
    confidence: 20
  };

  const medianPrice = Number(result.base_price);
  const comparablesCount = result.comparables_count;
  const confidence = result.confidence;

  // 2. Conservative adjustment logic
  let adjustmentMultiplier = 0.9; // start below market
  const influencers: string[] = [];

  // Mileage normalization (17,500km/year)
  const age = Math.max(1, new Date().getFullYear() - input.year);
  const expectedMileage = age * 17500;
  const mileageVariance = (expectedMileage - input.mileage) / 10000;

  // Soft mileage impact: ±0.5% per 10k km
  const mileageAdj = mileageVariance * 0.005;
  adjustmentMultiplier += mileageAdj;

  if (Math.abs(mileageAdj) > 0.02) {
    influencers.push(
      mileageAdj > 0
        ? 'Below average mileage'
        : 'Higher mileage for age'
    );
  }

  // New vs Used (small premium only)
  if (input.car_status === 'New') {
    adjustmentMultiplier *= 1.08;
    influencers.push('Unregistered vehicle premium');
  } else {
    adjustmentMultiplier *= 0.93;
    influencers.push('Used vehicle pricing');
  }

  // Brand strength (very small effect)
  const powerBrands = ['Toyota', 'Nissan', 'Mazda', 'Honda'];
  if (powerBrands.includes(input.make)) {
    adjustmentMultiplier *= 1.02;
    influencers.push(`${input.make} strong local demand`);
  }

  // HARD SAFETY CAPS (prevents inflation)
  adjustmentMultiplier = Math.min(adjustmentMultiplier, 1.15);
  adjustmentMultiplier = Math.max(adjustmentMultiplier, 0.6);

  // 3. Final valuation ranges
  const adjustedMidpoint = medianPrice * adjustmentMultiplier;

  // Tight Zimbabwe market bands
  const min = adjustedMidpoint * 0.9;
  const max = adjustedMidpoint * 1.03;

  // Allow cheap cars
  const safeMin = Math.max(min, 2500);

  const fastSale = safeMin * 0.9;
  const dealerPrice = max;

  // 4. Human-friendly summary
  const summary =
    comparablesCount > 0
      ? `Estimate based on ${comparablesCount} similar vehicles using Zimbabwe market data and feature-based matching.`
      : `This is not an exact estimate. You know your car best, so feel free to set the price or value that reflects your vehicle accurately.`;

  return {
    estimated_market_value_min: Math.round(safeMin / 100) * 100,
    estimated_market_value_max: Math.round(max / 100) * 100,
    fast_sale_price: Math.round(fastSale / 100) * 100,
    dealer_listing_price: Math.round(dealerPrice / 100) * 100,
    key_influencers: influencers.slice(0, 2),
    summary,
    confidence_score: confidence
  };
};
