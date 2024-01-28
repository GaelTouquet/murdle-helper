import { booleanAttribute, Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { complexity, possibilities } from '../parameters';
import { IBoxCoordinates, ICoordinates } from './grid/coordinates';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  grid: (boolean | undefined)[][][][] = new Array();
  constructor() {
    let bla: undefined[] = [];
    let blu: undefined[][] = [];
    let bli: undefined[][][] = [];

    for (let sectionx = 0; sectionx < complexity; sectionx++) {
      bli = [];
      for (let sectiony = 0; sectiony < complexity - sectionx; sectiony++) {
        blu = [];
        for (let x = 0; x < possibilities; x++) {
          bla = [];
          for (let y = 0; y < possibilities; y++) {
            bla.push(undefined);
          }
          blu.push(bla);
        }
        bli.push(blu);
      }
      this.grid.push(bli);
    }
  }
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
  updateMessenger: Subject<(boolean | undefined)[][][][]> = new Subject();
  private updateGrid() {
    this.updateMessenger.next(this.grid);
  }

  private getBoxValue(
    gridBeingSolved: (boolean | undefined)[][][][],
    coord: IBoxCoordinates
  ): boolean | undefined {
    return gridBeingSolved[coord.section.x][coord.section.y][coord.box.x][
      coord.box.y
    ];
  }

  private setBoxValue(
    gridBeingSolved: (boolean | undefined)[][][][],
    coord: IBoxCoordinates,
    val: boolean | undefined
  ): void {
    gridBeingSolved[coord.section.x][coord.section.y][coord.box.x][
      coord.box.y
    ] = val;
  }

  // todo make a func that takes 2 grid coordinates and goes both ways to spread using a pivot coordinates
  private align(
    gridBeingSolved: (boolean | undefined)[][][][],
    coordsA: IBoxCoordinates,
    coordsB: IBoxCoordinates
  ): boolean | undefined {
    const valA: boolean | undefined = this.getBoxValue(
      gridBeingSolved,
      coordsA
    );
    const valB: boolean | undefined = this.getBoxValue(
      gridBeingSolved,
      coordsB
    );
    if (valA == valB) return false;
    if (valA == undefined) {
      this.setBoxValue(gridBeingSolved, coordsA, valB);
      return true;
    }
    if (valB == undefined) {
      this.setBoxValue(gridBeingSolved, coordsB, valA);
      return true;
    }
    return undefined;
  }

  private spread(
    gridBeingSolved: (boolean | undefined)[][][][],
    pivotCoordinates: IBoxCoordinates,
    sectionCoordsA: ICoordinates,
    sectionCoordsB: ICoordinates
  ): boolean | undefined {
    let modified: boolean = false;
    let coordsDown: IBoxCoordinates;
    let coordsAcross: IBoxCoordinates;
    for (let i = 0; i < possibilities; i++) {
      if (sectionCoordsA.x < sectionCoordsB.x) {
        coordsDown = {
          section: sectionCoordsA,
          box: {
            x: pivotCoordinates.box.x,
            y: i,
          },
        };
        coordsAcross = {
          section: sectionCoordsB,
          box: {
            x: i,
            y: pivotCoordinates.box.y,
          },
        };
      } else {
        coordsDown = {
          section: sectionCoordsB,
          box: {
            x: pivotCoordinates.box.x,
            y: i,
          },
        };
        coordsAcross = {
          section: sectionCoordsA,
          box: {
            x: i,
            y: pivotCoordinates.box.y,
          },
        };
      }
      switch (this.align(gridBeingSolved, coordsDown, coordsAcross)) {
        case true:
          modified = true;
          break;
        case undefined:
          return undefined;
      }
    }
    return modified;
  }

  private concur(
    gridBeingSolved: (boolean | undefined)[][][][],
    pivotCoordinates: IBoxCoordinates,
    sectionCoordsA: ICoordinates,
    sectionCoordsB: ICoordinates
  ): boolean {
    let coordsDown: IBoxCoordinates;
    let coordsAcross: IBoxCoordinates;
    for (let i = 0; i < possibilities; i++) {
      if (sectionCoordsA.x < sectionCoordsB.x) {
        coordsDown = {
          section: sectionCoordsA,
          box: {
            x: pivotCoordinates.box.x,
            y: i,
          },
        };
        coordsAcross = {
          section: sectionCoordsB,
          box: {
            x: i,
            y: pivotCoordinates.box.y,
          },
        };
      } else {
        coordsDown = {
          section: sectionCoordsB,
          box: {
            x: pivotCoordinates.box.x,
            y: i,
          },
        };
        coordsAcross = {
          section: sectionCoordsA,
          box: {
            x: i,
            y: pivotCoordinates.box.y,
          },
        };
      }
      const valDown = this.getBoxValue(gridBeingSolved, coordsDown);
      const valAcross = this.getBoxValue(gridBeingSolved, coordsAcross);
      if (valDown == valAcross && valDown == true) {
        this.setBoxValue(gridBeingSolved, pivotCoordinates, true);
        return true;
      }
    }
    return false;
  }

  public solve(
    eliminate: boolean = true,
    fromElimination: boolean = true,
    spread: boolean = true,
    concurrency: boolean = true
  ) {
    let gridBeingSolved: (boolean | undefined)[][][][] = { ...this.grid };
    let change: boolean = true;
    let studiedCoordinates: IBoxCoordinates;

    while (change) {
      change = false;
      for (let sectionx = 0; sectionx < complexity; sectionx++) {
        for (let sectiony = 0; sectiony < complexity - sectionx; sectiony++) {
          for (let x = 0; x < possibilities; x++) {
            for (let y = 0; y < possibilities; y++) {
              studiedCoordinates = {
                section: {
                  x: sectionx,
                  y: sectiony,
                },
                box: {
                  x: x,
                  y: y,
                },
              };

              switch (this.getBoxValue(gridBeingSolved, studiedCoordinates)) {
                case true:
                  {
                    if (eliminate) {
                      for (let i = 0; i < possibilities; i++) {
                        if (i != x) {
                          switch (gridBeingSolved[sectionx][sectiony][i][y]) {
                            case true:
                              console.log(
                                `bug because ${sectionx} ${sectiony} ${x} ${y} is true and ${sectionx} ${sectiony} ${i} ${y} is too!`
                              );
                              return;
                            case undefined:
                              gridBeingSolved[sectionx][sectiony][i][y] = false;
                              change = true;
                          }
                        }
                        if (i != y) {
                          switch (gridBeingSolved[sectionx][sectiony][x][i]) {
                            case true:
                              console.log(
                                `bug because ${sectionx} ${sectiony} ${x} ${y} is true and ${sectionx} ${sectiony} ${x} ${i} is too!`
                              );
                              return;
                            case undefined:
                              gridBeingSolved[sectionx][sectiony][x][i] = false;
                              change = true;
                          }
                        }
                      }
                    }

                    // basic spread from other section
                    if (spread) {
                      if (complexity == 2) {
                        if (sectionx == 0 && sectiony == 0) {
                          switch (
                            this.spread(
                              gridBeingSolved,
                              studiedCoordinates,
                              { x: 1, y: 0 },
                              { x: 0, y: 1 }
                            )
                          ) {
                            case true:
                              change = true;
                              break;
                            case undefined:
                              return;
                          }
                        }
                      }
                      if (complexity == 3) {
                        if (sectionx == 0 && sectiony == 1) {
                          switch (
                            this.spread(
                              gridBeingSolved,
                              studiedCoordinates,
                              { x: 0, y: 2 },
                              { x: 1, y: 1 }
                            )
                          ) {
                            case true:
                              change = true;
                              break;
                            case undefined:
                              return;
                          }
                        }
                        if (sectionx == 1 && sectiony == 0) {
                          switch (
                            this.spread(
                              gridBeingSolved,
                              studiedCoordinates,
                              { x: 2, y: 0 },
                              { x: 1, y: 1 }
                            )
                          ) {
                            case true:
                              change = true;
                              break;
                            case undefined:
                              return;
                          }
                        }

                        if (sectionx == 0 && sectiony == 0) {
                          switch (
                            this.spread(
                              gridBeingSolved,
                              studiedCoordinates,
                              { x: 2, y: 0 },
                              { x: 0, y: 1 }
                            )
                          ) {
                            case true:
                              change = true;
                              break;
                            case undefined:
                              return;
                          }
                          switch (
                            this.spread(
                              gridBeingSolved,
                              studiedCoordinates,
                              { x: 1, y: 0 },
                              { x: 0, y: 2 }
                            )
                          ) {
                            case true:
                              change = true;
                              break;
                            case undefined:
                              return;
                          }
                        }
                      }
                    }
                  }
                  break;

                case undefined:
                  {
                    //check row
                    if (fromElimination) {
                      let count: number = 0;
                      for (let i = 0; i < possibilities; i++) {
                        if (
                          i != x &&
                          gridBeingSolved[sectionx][sectiony][i][y] == false
                        ) {
                          count += 1;
                        }
                      }
                      if (count == possibilities - 1) {
                        gridBeingSolved[sectionx][sectiony][x][y] = true;
                        change = true;
                      }

                      //check column
                      count = 0;
                      for (let i = 0; i < possibilities; i++) {
                        if (
                          i != y &&
                          gridBeingSolved[sectionx][sectiony][x][i] == false
                        ) {
                          count += 1;
                        }
                      }
                      if (count == possibilities - 1) {
                        gridBeingSolved[sectionx][sectiony][x][y] = true;
                        change = true;
                      }
                    }

                    //check concurrency
                    if (concurrency) {
                      if (complexity == 2) {
                        if (sectionx == 0 && sectiony == 0) {
                          if (
                            this.concur(
                              gridBeingSolved,
                              studiedCoordinates,
                              { x: 1, y: 0 },
                              { x: 0, y: 1 }
                            )
                          )
                            change = true;
                        }
                      }
                      if (complexity == 3) {
                        if (sectionx == 0 && sectiony == 1) {
                          if (
                            this.concur(
                              gridBeingSolved,
                              studiedCoordinates,
                              { x: 0, y: 2 },
                              { x: 1, y: 1 }
                            )
                          )
                            change = true;
                        }
                        if (sectionx == 1 && sectiony == 0) {
                          if (
                            this.concur(
                              gridBeingSolved,
                              studiedCoordinates,
                              { x: 2, y: 0 },
                              { x: 1, y: 1 }
                            )
                          )
                            change = true;
                        }

                        if (sectionx == 0 && sectiony == 0) {
                          if (
                            this.concur(
                              gridBeingSolved,
                              studiedCoordinates,
                              { x: 2, y: 0 },
                              { x: 0, y: 1 }
                            )
                          )
                            change = true;
                          if (
                            this.concur(
                              gridBeingSolved,
                              studiedCoordinates,
                              { x: 1, y: 0 },
                              { x: 0, y: 2 }
                            )
                          )
                            change = true;
                        }
                      }
                    }
                  }

                  break;
              }
            }
          }
        }
      }
    }
    console.log('solved');
    this.grid = gridBeingSolved;
    this.updateGrid();
  }
}
