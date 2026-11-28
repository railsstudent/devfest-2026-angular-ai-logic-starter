import { APP_LINKS } from '@/core';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly links = [
    { link: APP_LINKS.SUMMARIZER, text: 'Summary for YouTube', alt: 'Go to YouTube Form' },
    { link: APP_LINKS.COUNTRY, text: 'Country', alt: 'Go to Country Form' },
  ];
}
