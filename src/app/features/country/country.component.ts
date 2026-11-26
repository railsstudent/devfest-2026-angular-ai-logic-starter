import { AiService } from '@/core/firebase/ai.service';
import { ConfigService } from '@/core/firebase/config.service';
import countryData from '@/public/countries.json';
import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-country',
  styleUrl: './country.component.css',
  templateUrl: './country.component.html',
})
export default class CountryComponent {
  readonly countries = countryData.countries;
  #aiService = inject(AiService);
  #configService = inject(ConfigService);

  countryModel = signal({
    country: '',
  });

  imageUrl = signal('');
  countryTemplateId = computed(() => this.#configService.appConfig().countryTemplateId);

  countryForm = form(
    this.countryModel,
    (schemaPath) => {
      required(schemaPath.country, { message: 'Country is required' });
    },
    {
      submission: {
        action: async () => {
          try {
            this.imageUrl.set('');
            const result = await this.#aiService.generateInlineData({
              templateId: this.countryTemplateId(),
              templateVariables: this.countryModel(),
            });

            this.imageUrl.set(result);
            return undefined;
          } catch (e) {
            console.log(e);
            this.imageUrl.set('');
            return { kind: 'serverError', message: 'Failed to submit form' };
          }
        },
      },
    },
  );
}
