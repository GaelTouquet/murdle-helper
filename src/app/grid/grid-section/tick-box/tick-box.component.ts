import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { GridService } from '../../../grid.service';
import { IBoxCoordinates, ICoordinates } from '../../coordinates';
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
  private updateSubscription: Subscription;
  @Input() position: IBoxCoordinates | undefined = undefined;
  constructor(private gridService: GridService) {
    this.colourState = 'unticked';
    this.locked = false;
    this.clearSubscription = Subscription.EMPTY;
    this.lockInSubscription = Subscription.EMPTY;
    this.unlockSubscription = Subscription.EMPTY;
    this.updateSubscription = Subscription.EMPTY;
  }

  private updateGridService() {
    if (this.position) {
      switch (this.colourState) {
        case 'true':
          this.gridService.grid[this.position.section.x][
            this.position.section.y
          ][this.position.box.x][this.position.box.y] = true;
          break;
        case 'false':
          this.gridService.grid[this.position.section.x][
            this.position.section.y
          ][this.position.box.x][this.position.box.y] = false;
          break;
        case 'unticked':
          this.gridService.grid[this.position.section.x][
            this.position.section.y
          ][this.position.box.x][this.position.box.y] = undefined;
          break;
      }
    }
  }

  ngOnInit() {
    this.clearSubscription = this.gridService.clearMessenger.subscribe(() => {
      if (!this.locked) {
        this.colourState = 'unticked';
        this.updateGridService();
      }
    });
    this.lockInSubscription = this.gridService.lockInMessenger.subscribe(() => {
      if (this.colourState != 'unticked') this.locked = true;
    });
    this.unlockSubscription = this.gridService.unlockMessenger.subscribe(() => {
      if (this.locked) this.locked = false;
    });
    this.updateSubscription = this.gridService.updateMessenger.subscribe(
      (grid) => {
        if (this.position) {
          switch (
            grid[this.position.section.x][this.position.section.y][
              this.position.box.x
            ][this.position.box.y]
          ) {
            case true:
              this.colourState = 'true';
              break;
            case false:
              this.colourState = 'false';
              break;
            case undefined:
              this.colourState = 'unticked';
              break;
          }
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.clearSubscription) this.clearSubscription.unsubscribe();
    if (this.lockInSubscription) this.lockInSubscription.unsubscribe();
    if (this.unlockSubscription) this.unlockSubscription.unsubscribe();
    if (this.updateSubscription) this.unlockSubscription.unsubscribe();
  }

  onClickBox(): void {
    if (!this.locked) this.colourState = boxStatePermutations[this.colourState];
    this.updateGridService();
  }
}
