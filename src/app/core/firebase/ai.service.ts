import { inject, Service } from '@angular/core';
import type { Part, TemplateGenerativeModel, TemplateRequest } from 'firebase/ai';
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

  async generateResponse(request: TemplateRequest): Promise<Part | undefined> {
    const result = await this.getTemplateModel().generateContent(request);
    const response = result.response;

    const firstContent = (response.candidates || []).find((c) => c.content.parts.length > 0);
    if (firstContent?.content) {
      const firstPart = firstContent?.content.parts.find((part) => part.type === 'text' && !!part.text);
      return firstPart;
    }

    return undefined;
  }

  async generateInlineData(request: TemplateRequest): Promise<string> {
    const result = await this.getTemplateModel().generateContent(request);
    const response = result.response;

    const parts = response.inlineDataParts();
    if (!parts) {
      return '';
    }

    const imagePart = parts.find((part) => !!part);
    return imagePart ? `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` : '';
  }
}
