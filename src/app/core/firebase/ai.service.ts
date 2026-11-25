import { Service } from '@angular/core';

export interface TemplateInput {
  id: string;
  param: Record<string, unknown>;
}

@Service()
export class AiService {
  // TODO:  implement TemplateGenerativeModel to generate results
  generateResponse(input: TemplateInput): void {
    console.log('input', input);
  }
}
