import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tick-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tick-box.component.html',
  styleUrl: './tick-box.component.scss',
})
export class TickBoxComponent {
  // TODO change this colourState to a cleaner type
  // TODO make this aware of its position in the grid section
  colourState: string = 'unticked';
  onClickBox(): void {
    // TODO code that a bit less nasty
    if (this.colourState == 'unticked') {
      this.colourState = 'false';
      return;
    }

    if (this.colourState == 'true') {
      this.colourState = 'unticked';
      return;
    }
    if (this.colourState == 'false') {
      this.colourState = 'true';
      return;
    }
  }
}
