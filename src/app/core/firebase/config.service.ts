import { Service, signal } from '@angular/core';
import type { AI } from 'firebase/ai';
import type { FirebaseApp } from 'firebase/app';

export interface AppRemoteConfig {
  countryTemplateId: string;
  summarizeTemplateId: string;
}

@Service()
export class ConfigService {
  #appConfig = signal<AppRemoteConfig>({
    countryTemplateId: '',
    summarizeTemplateId: '',
  });

  appConfig = this.#appConfig.asReadonly();

  #firebaseApp: FirebaseApp | null = null;
  #ai: AI | null = null;

  get app(): FirebaseApp {
    if (!this.#firebaseApp) {
      throw new Error('Firebase App initialization failed');
    }

    return this.#firebaseApp;
  }

  get aiBackend(): AI {
    if (!this.#ai) {
      throw new Error('AI Backend has not created yet');
    }
    return this.#ai;
  }
}
