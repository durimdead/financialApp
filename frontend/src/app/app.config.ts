import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { AppRoutes } from './app.routes';
import { AppRouterConfig } from './app.router-config';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(AppRoutes, withComponentInputBinding(), withRouterConfig(AppRouterConfig))]
};
