
import { logger } from '../utils/logger';

interface AddressComponents {
  streetNumber?: string;
  streetName?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

interface GeocodeResult {
  address: string;
  shortAddress: string;
  components: AddressComponents;
}

class GeocodingService {
  private cache = new Map<string, GeocodeResult>();
  private readonly MAPBOX_TOKEN: string;

  constructor(mapboxToken: string) {
    this.MAPBOX_TOKEN = mapboxToken;
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult | null> {
    const cacheKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${this.MAPBOX_TOKEN}&types=address&language=nl`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        return null;
      }

      const feature = data.features[0];
      const placeName = feature.place_name || '';
      
      // Extract address components
      const components: AddressComponents = {};
      feature.context?.forEach((ctx: any) => {
        if (ctx.id.startsWith('postcode')) {
          components.postcode = ctx.text;
        } else if (ctx.id.startsWith('place')) {
          components.city = ctx.text;
        } else if (ctx.id.startsWith('country')) {
          components.country = ctx.text;
        }
      });

      // Extract street info from the main feature
      if (feature.properties?.address) {
        components.streetNumber = feature.properties.address;
      }
      if (feature.text) {
        components.streetName = feature.text;
      }

      // Create short and full address
      const fullAddress = placeName;
      const shortAddress = this.createShortAddress(components, fullAddress);

      const result: GeocodeResult = {
        address: fullAddress,
        shortAddress,
        components
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      logger.error('Reverse geocoding failed', error);
      return null;
    }
  }

  private createShortAddress(components: AddressComponents, fullAddress: string): string {
    // Try to create a short address from components
    const parts = [];
    
    if (components.streetName) {
      let street = components.streetName;
      if (components.streetNumber) {
        street += ` ${components.streetNumber}`;
      }
      parts.push(street);
    }
    
    if (components.city) {
      parts.push(components.city);
    }

    if (parts.length > 0) {
      return parts.join(', ');
    }

    // Fallback to truncated full address
    return fullAddress.length > 40 ? fullAddress.substring(0, 37) + '...' : fullAddress;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export { GeocodingService, type GeocodeResult, type AddressComponents };
