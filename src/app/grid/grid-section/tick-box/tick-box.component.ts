import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { GridService } from '../../../grid.service';
import { BoxState, boxStatePermutations } from './boxStates';

@Component({
  selector: 'app-tick-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tick-box.component.html',
  styleUrl: './tick-box.component.scss',
})
export class TickBoxComponent {
  // TODO make this aware of its position in the grid section
  public locked: boolean;
  public colourState: BoxState;
  private clearSubscription: Subscription;
  private lockInSubscription: Subscription;
  private unlockSubscription: Subscription;
  constructor(private gridService: GridService) {
    this.colourState = 'unticked';
    this.locked = false;
    this.clearSubscription = Subscription.EMPTY;
    this.lockInSubscription = Subscription.EMPTY;
    this.unlockSubscription = Subscription.EMPTY;
  }
  ngOnInit() {
    this.clearSubscription = this.gridService.clearMessenger.subscribe(() => {
      if (this.locked) this.locked = false;
      this.colourState = 'unticked';
    });
    this.lockInSubscription = this.gridService.lockInMessenger.subscribe(() => {
      if (this.colourState != 'unticked') this.locked = true;
    });
    this.unlockSubscription = this.gridService.unlockMessenger.subscribe(() => {
      if (this.locked) this.locked = false;
    });
  }
  ngOnDestroy() {
    if (this.clearSubscription) this.clearSubscription.unsubscribe();
  }
  onClickBox(): void {
    if (!this.locked) this.colourState = boxStatePermutations[this.colourState];
  }
}
