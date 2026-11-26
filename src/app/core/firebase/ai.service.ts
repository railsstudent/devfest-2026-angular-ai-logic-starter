import { inject, Service } from '@angular/core';
import type { Content, GenerativeContentBlob, TemplateGenerativeModel, TemplateRequest } from 'firebase/ai';
import { ConfigService } from './config.service';

@Service()
export class AiService {
  // eslint-disable-next-line no-unused-private-class-members
  #configService = inject(ConfigService);
  // eslint-disable-next-line no-unused-private-class-members
  #templateModel: TemplateGenerativeModel | null = null;

  // TODO:  implement TemplateGenerativeModel to generate results
  async generateResponse(request: TemplateRequest): Promise<Content | undefined> {
    console.log('Request', request);
    return Promise.resolve(undefined);
  }

  async generateInlineData(request: TemplateRequest): Promise<GenerativeContentBlob | undefined> {
    console.log('Request', request);
    return Promise.resolve(undefined);
  }
}
