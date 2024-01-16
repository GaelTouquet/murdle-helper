import { Component } from '@angular/core';
import { GridSectionComponent } from './grid-section/grid-section.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [GridSectionComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {}
