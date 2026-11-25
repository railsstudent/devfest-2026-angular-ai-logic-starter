import { Service } from '@angular/core';

export interface AppRemoteConfig {
  countryTemplateId: string;
  summarizeTemplateId: string;
}

@Service()
export class ConfigService {
  #appConfig: AppRemoteConfig = {
    countryTemplateId: '',
    summarizeTemplateId: '',
  };

  get appConfig(): AppRemoteConfig {
    return this.#appConfig;
  }
}
