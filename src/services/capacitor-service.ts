
import { Capacitor } from '@capacitor/core';
import { logger } from '../utils/logger';

class CapacitorService {
  /**
   * Check if running on a native platform
   */
  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Check if running on mobile (native or web mobile)
   */
  isMobile(): boolean {
    return Capacitor.isNativePlatform() || this.isMobileWeb();
  }

  /**
   * Check if running on mobile web
   */
  private isMobileWeb(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Get platform name
   */
  getPlatform(): string {
    return Capacitor.getPlatform();
  }

  /**
   * Check if specific platform
   */
  isIOS(): boolean {
    return Capacitor.getPlatform() === 'ios';
  }

  isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android';
  }

  isWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
  }

  /**
   * Log platform info for debugging
   */
  logPlatformInfo(): void {
    logger.debug('Platform info', {
      platform: this.getPlatform(),
      isNative: this.isNative(),
      isMobile: this.isMobile(),
      userAgent: navigator.userAgent
    });
  }
}

export const capacitorService = new CapacitorService();
