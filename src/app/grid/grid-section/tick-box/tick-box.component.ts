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
    if (this.colourState == 'unticked') {
      this.colourState = 'true';
      console.log('clicked!');
      return;
    }

    if (this.colourState == 'true') {
      this.colourState = 'false';
      console.log('clicked!');
      return;
    }
    if (this.colourState == 'false') {
      this.colourState = 'unticked';
      console.log('clicked!');
      return;
    }
  }
}
