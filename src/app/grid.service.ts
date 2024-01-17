import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  constructor() {}
  clearMessenger: Subject<void> = new Subject();
  public clearGrid() {
    this.clearMessenger.next();
  }
  lockInMessenger: Subject<void> = new Subject();
  public lockIn() {
    this.lockInMessenger.next();
  }
  unlockMessenger: Subject<void> = new Subject();
  public unlock() {
    this.unlockMessenger.next();
  }
}
