import { getPerformance } from 'firebase/performance';
import { app } from '../lib/firebase';

export function initializePerformanceMonitoring() {
  if (process.env.NODE_ENV === 'production') {
    const perf = getPerformance(app);
    
    // Monitor page load performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          console.log('Navigation Timing:', {
            dnsLookup: entry.domainLookupEnd - entry.domainLookupStart,
            tcpConnection: entry.connectEnd - entry.connectStart,
            firstByte: entry.responseStart - entry.requestStart,
            domLoad: entry.domContentLoadedEventEnd - entry.navigationStart,
            windowLoad: entry.loadEventEnd - entry.navigationStart,
          });
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
    return perf;
  }
  return null;
}