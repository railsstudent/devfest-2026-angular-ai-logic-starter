import { inject, Service } from '@angular/core';
import type { Content, GenerativeContentBlob, TemplateGenerativeModel, TemplateRequest } from 'firebase/ai';
import { getTemplateGenerativeModel } from 'firebase/ai';
import { ConfigService } from './config.service';

@Service()
export class AiService {
  #firebaseService = inject(ConfigService);
  #templateModel: TemplateGenerativeModel | null = null;

  private getTemplateModel(): TemplateGenerativeModel {
    if (!this.#templateModel) {
      this.#templateModel = getTemplateGenerativeModel(this.#firebaseService.aiBackend);
    }
    return this.#templateModel;
  }

  async generateResponse(request: TemplateRequest): Promise<Content | undefined> {
    const result = await this.getTemplateModel().generateContent(request);
    const response = result.response;

    const firstContent = (response.candidates || []).find((c) => c.content.parts.length > 0);
    return firstContent?.content;
  }

  async generateInlineData(request: TemplateRequest): Promise<GenerativeContentBlob | undefined> {
    const result = await this.getTemplateModel().generateContent(request);
    const response = result.response;

    const parts = response.inlineDataParts();
    if (!parts) {
      return undefined;
    }

    const imagePart = parts.find((part) => !!part);
    return imagePart?.inlineData;
  }
}
