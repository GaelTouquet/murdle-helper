import { Component } from '@angular/core';
import { GridService } from '../grid.service';

@Component({
  selector: 'app-grid-form',
  standalone: true,
  imports: [],
  templateUrl: './grid-form.component.html',
  styleUrl: './grid-form.component.scss',
})
export class GridFormComponent {
  constructor(private gridService: GridService) {}
  public clearGrid() {
    this.gridService.clearGrid();
  }
  public lockIn() {
    this.gridService.lockIn();
  }
  public unlock() {
    this.gridService.unlock();
  }
  public solve(
    eliminate: boolean = true,
    fromElimination: boolean = true,
    spread: boolean = true,
    concurrency: boolean = true
  ) {
    this.gridService.solve(eliminate, fromElimination, spread, concurrency);
  }
}
