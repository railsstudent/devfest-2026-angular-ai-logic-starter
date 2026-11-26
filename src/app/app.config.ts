import type { ApplicationConfig } from '@angular/core';
import { inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withAutoCleanupInjectors, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { ConfigService } from './core/firebase/config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withAutoCleanupInjectors()),
    provideAppInitializer(async () => {
      const configService = inject(ConfigService);
      await configService.initialize();
    }),
  ],
};
