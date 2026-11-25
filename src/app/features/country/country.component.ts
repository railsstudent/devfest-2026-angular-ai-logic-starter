import countryData from '@/public/countries.json';
import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-country',
  styleUrl: './country.component.css',
  templateUrl: './country.component.html',
})
export default class CountryComponent {
  readonly countries = countryData.countries;

  countryModel = signal({
    country: '',
  });

  countryForm = form(
    this.countryModel,
    (schemaPath) => {
      required(schemaPath.country, { message: 'Country is required' });
    },
    {
      submission: {
        action: () => {
          console.log('submitted', this.countryModel());
          return Promise.resolve(undefined);
        },
      },
    },
  );
}
