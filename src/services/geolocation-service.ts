
import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';
import { capacitorService } from './capacitor-service';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

class GeolocationService {
  private watchId: string | null = null;
  private lastKnownLocation: LocationCoordinates | null = null;

  async getCurrentLocation(options?: LocationOptions): Promise<LocationCoordinates> {
    try {
      console.log('Getting current location...');

      if (!capacitorService.isNative() && !navigator.geolocation) {
        throw new Error('Geolocation not supported');
      }

      const positionOptions: PositionOptions = {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 60000
      };

      let position: Position;

      if (capacitorService.isNative()) {
        // Use Capacitor Geolocation for native apps
        const permissions = await Geolocation.requestPermissions();
        if (permissions.location === 'denied') {
          throw new Error('Location permission denied');
        }
        position = await Geolocation.getCurrentPosition(positionOptions);
      } else {
        // Fallback to web geolocation
        position = await this.getWebLocation(positionOptions);
      }

      const coordinates: LocationCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude || undefined,
        heading: position.coords.heading || undefined,
        speed: position.coords.speed || undefined,
        timestamp: position.timestamp
      };

      this.lastKnownLocation = coordinates;
      console.log('Location obtained:', coordinates);

      return coordinates;
    } catch (error) {
      console.error('Failed to get location:', error);
      
      // Return last known location if available
      if (this.lastKnownLocation) {
        console.log('Returning last known location');
        return this.lastKnownLocation;
      }
      
      throw error;
    }
  }

  private getWebLocation(options: PositionOptions): Promise<Position> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coords: position.coords,
            timestamp: position.timestamp
          } as Position);
        },
        (error) => reject(error),
        options
      );
    });
  }

  async startLocationTracking(
    callback: (location: LocationCoordinates) => void,
    options?: LocationOptions
  ): Promise<void> {
    try {
      console.log('Starting location tracking...');

      if (this.watchId) {
        await this.stopLocationTracking();
      }

      const positionOptions: PositionOptions = {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 5000
      };

      if (capacitorService.isNative()) {
        // Check permissions first
        const permissions = await Geolocation.requestPermissions();
        if (permissions.location === 'denied') {
          throw new Error('Location permission denied');
        }

        this.watchId = await Geolocation.watchPosition(positionOptions, (position, err) => {
          if (err) {
            console.error('Location tracking error:', err);
            return;
          }

          if (position) {
            const coordinates: LocationCoordinates = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude || undefined,
              heading: position.coords.heading || undefined,
              speed: position.coords.speed || undefined,
              timestamp: position.timestamp
            };

            this.lastKnownLocation = coordinates;
            callback(coordinates);
          }
        });
      } else {
        // Web geolocation fallback
        this.watchId = navigator.geolocation.watchPosition(
          (position) => {
            const coordinates: LocationCoordinates = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude || undefined,
              heading: position.coords.heading || undefined,
              speed: position.coords.speed || undefined,
              timestamp: position.timestamp
            };

            this.lastKnownLocation = coordinates;
            callback(coordinates);
          },
          (error) => console.error('Web location tracking error:', error),
          positionOptions
        ).toString();
      }

      console.log('Location tracking started with ID:', this.watchId);
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      throw error;
    }
  }

  async stopLocationTracking(): Promise<void> {
    if (!this.watchId) return;

    try {
      console.log('Stopping location tracking...');

      if (capacitorService.isNative()) {
        await Geolocation.clearWatch({ id: this.watchId });
      } else {
        navigator.geolocation.clearWatch(parseInt(this.watchId));
      }

      this.watchId = null;
      console.log('Location tracking stopped');
    } catch (error) {
      console.error('Failed to stop location tracking:', error);
    }
  }

  getLastKnownLocation(): LocationCoordinates | null {
    return this.lastKnownLocation;
  }

  async checkLocationPermissions(): Promise<boolean> {
    try {
      if (capacitorService.isNative()) {
        const permissions = await Geolocation.checkPermissions();
        return permissions.location === 'granted';
      } else {
        // For web, we can't check permissions beforehand
        return 'geolocation' in navigator;
      }
    } catch (error) {
      console.error('Failed to check location permissions:', error);
      return false;
    }
  }

  async requestLocationPermissions(): Promise<boolean> {
    try {
      if (capacitorService.isNative()) {
        const permissions = await Geolocation.requestPermissions();
        return permissions.location === 'granted';
      } else {
        // For web, permission is requested when accessing location
        return 'geolocation' in navigator;
      }
    } catch (error) {
      console.error('Failed to request location permissions:', error);
      return false;
    }
  }
}

export const geolocationService = new GeolocationService();
