import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';

import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MenubarModule, ButtonModule, InputTextModule, AvatarModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  themeService = inject(ThemeService);
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/',
      },
      {
        label: 'Inspecionar',
        icon: 'pi pi-fw pi-search',
        routerLink: '/utilities/site-inspector',
      },
      {
        label: 'Ferramentas',
        icon: 'pi pi-fw pi-briefcase',
        items: [
          { label: 'Formatador JSON', icon: 'pi pi-fw pi-file-edit' },
          { label: 'Gerador CPF', icon: 'pi pi-fw pi-id-card' },
        ],
      },
    ];
  }
}
