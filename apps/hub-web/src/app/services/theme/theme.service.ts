import { DOCUMENT, Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkMode = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      this.switchTheme('dark-theme');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark-theme' : 'light-theme';
    this.switchTheme(theme);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  switchTheme(theme: string) {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = 'assets/themes/' + theme + '.css';
    }
  }
}
