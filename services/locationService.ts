interface Coordinates {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(error.message));
      }
    );
  });
};

export const getRegionFromCoordinates = async (latitude: number, longitude: number): Promise<string | null> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    
    // Nominatim provides address details, we prioritize country, then state, then city.
    return data.address?.country || data.address?.state || data.address?.city || 'your region';
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    // Return a fallback so the app can still function
    return 'your amazing region';
  }
};
