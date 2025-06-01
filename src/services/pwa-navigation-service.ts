
import { logger } from '../utils/logger';

class PWANavigationService {
  private isStandalone: boolean;
  private isIOS: boolean;

  constructor() {
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    this.initialize();
  }

  private initialize() {
    if (this.isIOS && this.isStandalone) {
      // Prevent iOS from opening links in Safari
      this.preventExternalNavigation();
      this.optimizeTouchHandling();
    }
  }

  private preventExternalNavigation() {
    // Override default link behavior to stay in PWA
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && this.isInternalLink(link)) {
        // Let React Router handle internal navigation
        return;
      }
      
      if (link && link.href && !this.isInternalLink(link)) {
        // Prevent external links from leaving the PWA
        event.preventDefault();
        this.handleExternalLink(link.href);
      }
    });
  }

  private isInternalLink(link: HTMLAnchorElement): boolean {
    const href = link.getAttribute('href');
    if (!href) return false;
    
    // Check if it's a React Router Link (has data-testid or specific classes)
    if (link.closest('[data-react-router-link]') || 
        href.startsWith('/') || 
        href.startsWith('#') ||
        href === '') {
      return true;
    }
    
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  private handleExternalLink(href: string) {
    // For external links in PWA, we could show a confirmation dialog
    // or open in a minimal browser view if needed
    logger.debug('External link blocked in PWA:', href);
  }

  private optimizeTouchHandling() {
    // Optimize touch events for better native feel
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
    
    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  public isRunningAsApp(): boolean {
    return this.isStandalone;
  }

  public getPlatformInfo() {
    return {
      isStandalone: this.isStandalone,
      isIOS: this.isIOS,
      userAgent: navigator.userAgent
    };
  }
}

export const pwaNavigationService = new PWANavigationService();
