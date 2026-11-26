import { AiService } from '@/core/firebase/ai.service';
import { ConfigService } from '@/core/firebase/config.service';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, pattern, readonly, required } from '@angular/forms/signals';

interface VideoSummary {
  summary: string;
  topic?: string;
  tags: string[];
}

const DEFAULT_VIDEO_SUMMARY: VideoSummary = {
  summary: '',
  topic: '',
  tags: [],
};

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-summarizer',
  styleUrl: './summarizer.component.css',
  templateUrl: './summarizer.component.html',
})
export default class SummarizerComponent {
  #aiService = inject(AiService);
  #configService = inject(ConfigService);

  summarizerModel = signal({
    url: '',
    mime_type: 'video/mp4',
  });

  videoSummary = signal<VideoSummary>(DEFAULT_VIDEO_SUMMARY);

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
        action: async () => {
          this.videoSummary.set(DEFAULT_VIDEO_SUMMARY);
          try {
            const templateId = this.#configService.appConfig().summarizeTemplateId;
            const result = await this.#aiService.generateResponse({
              templateId,
              templateVariables: this.summarizerModel(),
            });

            const videoSummary =
              result && result.type === 'text' ? (JSON.parse(result.text) as VideoSummary) : DEFAULT_VIDEO_SUMMARY;
            this.videoSummary.set(videoSummary);
            return undefined;
          } catch (e) {
            console.log(e);
            this.videoSummary.set(DEFAULT_VIDEO_SUMMARY);
            return { kind: 'serverError', message: 'Failed to submit form' };
          }
        },
      },
    },
  );
}
