import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InspectorService } from '../../services/inspector/inspector.service';
import { KnobModule } from 'primeng/knob';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonModule, KnobModule, TagModule],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss',
})
export class InspectorComponent {
  private inspectorService = inject(InspectorService);

  targetUrl: string = '';
  loading = signal(false);
  result = signal<any>(null);

  async inspect() {
    if (!this.targetUrl) return;

    this.loading.set(true);
    this.result.set(null);

    try {
      const data = await this.inspectorService.inspectUrl(this.targetUrl);

      this.result.set(data);
    } catch (error: any) {
      console.error(error);
      this.result.set({ error: 'Falha na inspeção', details: error.message });
    } finally {
      this.loading.set(false);
    }
  }
}
