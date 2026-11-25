import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="surface-card footer-card text-muted">
      <p>&copy; {{ copyrightYear }} DevFest {{ location }} 2026 Workshop.</p>
      <p>Built with Angular, Firebase AI Logic, Gemini, and TailwindCSS 4.</p>
    </footer>
  `,
})
export class FooterComponent {
  copyrightYear = new Date(Date.now()).getFullYear();
  location = 'Yangon';
}
