import { Component } from '@angular/core';
import { TickBoxComponent } from './tick-box/tick-box.component';

@Component({
  selector: 'app-grid-section',
  standalone: true,
  imports: [TickBoxComponent],
  templateUrl: './grid-section.component.html',
  styleUrl: './grid-section.component.scss',
})
export class GridSectionComponent {}
