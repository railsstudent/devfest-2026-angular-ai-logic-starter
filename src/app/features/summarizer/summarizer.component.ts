import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, pattern, readonly, required } from '@angular/forms/signals';

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-summarizer',
  styleUrl: './summarizer.component.css',
  templateUrl: './summarizer.component.html',
})
export default class SummarizerComponent {
  summarizerModel = signal({
    url: '',
    mime_type: 'video/mp4',
  });

  summarizerForm = form(
    this.summarizerModel,
    (schemaPath) => {
      required(schemaPath.url, { message: 'Url is required' });
      pattern(
        schemaPath.url,
        /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?.*v=|shorts\/|embed\/|v\/)|youtu\.be\/)[\w-]{11}([?&].*)?$/,
        {
          message: 'The url is not a valid YouTube URL',
        },
      );
      required(schemaPath.mime_type, { message: 'Mime type is required' });
      readonly(schemaPath.mime_type);
    },
    {
      submission: {
        action: () => {
          console.log('submitted', this.summarizerModel());
          return Promise.resolve(undefined);
        },
      },
    },
  );
}
