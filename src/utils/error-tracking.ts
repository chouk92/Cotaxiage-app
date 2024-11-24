interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: Date;
  userAgent: string;
  path: string;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorReport[] = [];

  private constructor() {
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  private handleError(event: ErrorEvent) {
    this.logError({
      message: event.message,
      stack: event.error?.stack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      path: window.location.pathname
    });
  }

  private handlePromiseRejection(event: PromiseRejectionEvent) {
    this.logError({
      message: event.reason?.message || 'Promise rejection',
      stack: event.reason?.stack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      path: window.location.pathname
    });
  }

  private logError(error: ErrorReport) {
    this.errors.push(error);
    console.error('Application Error:', error);
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Implement error reporting service integration
    }
  }

  getErrors(): ErrorReport[] {
    return this.errors;
  }

  clearErrors(): void {
    this.errors = [];
  }
}