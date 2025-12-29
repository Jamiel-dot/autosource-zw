
export const WISHLIST_STORAGE_KEY = 'autosource_wishlist';

export const getWishlist = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const toggleWishlist = (carId: string): boolean => {
  const current = getWishlist();
  const index = current.indexOf(carId);
  let isAdded = false;

  if (index > -1) {
    current.splice(index, 1);
    isAdded = false;
  } else {
    current.push(carId);
    isAdded = true;
  }

  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event('wishlist-updated'));
  return isAdded;
};

export const isInWishlist = (carId: string): boolean => {
  return getWishlist().includes(carId);
};

export const clearWishlist = () => {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event('wishlist-updated'));
};
