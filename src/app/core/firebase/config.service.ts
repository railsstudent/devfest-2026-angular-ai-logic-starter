import firebaseConfig from '@/public/firebase.config.json';
import remoteConfigDefault from '@/public/remote-config-defaults.json';
import { DestroyRef, inject, isDevMode, Service, signal } from '@angular/core';
import type { AI } from 'firebase/ai';
import { getAI, GoogleAIBackend } from 'firebase/ai';
import type { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import type { RemoteConfig, Unsubscribe } from 'firebase/remote-config';
import { activate, fetchAndActivate, getRemoteConfig, getString, onConfigUpdate } from 'firebase/remote-config';

export interface AppRemoteConfig {
  countryTemplateId: string;
  summarizeTemplateId: string;
}

const SECONDS = 60;
const MILLISECONDS = 1000;
const ONE_HOUR_IN_MILLISECONDS = SECONDS * SECONDS * MILLISECONDS;

@Service()
export class ConfigService {
  #appConfig = signal<AppRemoteConfig>({
    countryTemplateId: '',
    summarizeTemplateId: '',
  });

  appConfig = this.#appConfig.asReadonly();

  #firebaseApp: FirebaseApp | null = null;
  #ai: AI | null = null;

  #unsubscribe: Unsubscribe | null = null;
  #destroyRef = inject(DestroyRef);

  constructor() {
    this.#destroyRef.onDestroy(() => {
      if (this.#unsubscribe) {
        this.#unsubscribe();
        this.#unsubscribe = null;
      }
    });
  }

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

  async initialize(): Promise<void> {
    // Prevent double initialization
    if (this.#firebaseApp) {
      return;
    }
    this.#firebaseApp = initializeApp(firebaseConfig.app);

    // configure app check debug token
    (globalThis as Record<string, unknown>)['FIREBASE_APPCHECK_DEBUG_TOKEN'] =
      firebaseConfig.appCheckDebugToken || true;

    initializeAppCheck(this.#firebaseApp, {
      provider: new ReCaptchaEnterpriseProvider('dummyKey'),
      isTokenAutoRefreshEnabled: true,
    });

    this.#ai = getAI(this.#firebaseApp, {
      backend: new GoogleAIBackend(),
      useLimitedUseAppCheckTokens: true,
    });

    await this.loadRemoteConfig();
  }

  private async loadRemoteConfig(): Promise<void> {
    try {
      const rc = getRemoteConfig(this.app);
      rc.defaultConfig = remoteConfigDefault;
      rc.settings.minimumFetchIntervalMillis = isDevMode() ? 0 : ONE_HOUR_IN_MILLISECONDS;
      await fetchAndActivate(rc);
      this.#appConfig.set({
        summarizeTemplateId: getString(rc, 'summarizeTemplateId'),
        countryTemplateId: getString(rc, 'countryTemplateId'),
      });
      this.registerRemoteConfigListener(rc);
    } catch (e) {
      console.warn('Remote Config fetch timed out or failed. Using defaults:', e);
    }
  }

  private registerRemoteConfigListener(remoteConfig: RemoteConfig): void {
    if (this.#unsubscribe) {
      return;
    }

    this.#unsubscribe = onConfigUpdate(remoteConfig, {
      next: async (configUpdated) => {
        try {
          console.log(configUpdated.getUpdatedKeys());
          await activate(remoteConfig);
          this.#appConfig.set({
            summarizeTemplateId: getString(remoteConfig, 'summarizeTemplateId'),
            countryTemplateId: getString(remoteConfig, 'countryTemplateId'),
          });
        } catch (e) {
          // swallow error
          console.warn('Error in onConfigUpdate():', e);
        }
      },
      error: (error) => {
        console.log('Config update error:', error);
      },
      complete: () => {
        console.log('Listening stopped.');
      },
    });
  }
}
