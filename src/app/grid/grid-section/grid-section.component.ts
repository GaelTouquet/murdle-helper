import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { possibilities } from '../../../parameters';
import { TickBoxComponent } from './tick-box/tick-box.component';

@Component({
  selector: 'app-grid-section',
  standalone: true,
  imports: [TickBoxComponent, CommonModule],
  templateUrl: './grid-section.component.html',
  styleUrl: './grid-section.component.scss',
})
export class GridSectionComponent {
  possibilities: number = possibilities;
}
