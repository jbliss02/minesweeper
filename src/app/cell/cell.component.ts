import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Cell } from '../../domain-model/cell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {

  @Input() Row: number;
  @Input() Col: number;
  @Input() Cell: Cell;

  @Output() OnCellClick: EventEmitter<Cell> = new EventEmitter();
  @Output() OnCellFlag: EventEmitter<Cell> = new EventEmitter();

  MineClass: string;

  constructor() {

      this.MineClass = 'Cell Hidden';
  }

  MineClick(e: any) {

    this.Cell.IsHidden = false;
    this.OnCellClick.emit(this.Cell);
  }

  CellFlag(e: any) {

    this.Cell.IsFlagged = !this.Cell.IsFlagged;
    this.OnCellFlag.emit(this.Cell);
  }

  public GetCellClass(): string {

    if (this.Cell.IsFlagged) {
      return 'Cell Flagged';
    } else if (this.Cell.IsHidden) {
      return 'Cell Hidden';
    } else {
      return 'Cell Visible';
    }

  }

  GetMineText(): string {

    if (this.Cell.HasMine) {
      return 'M';
    } else if (this.Cell.AdjacentMines > 0) {
      return this.Cell.AdjacentMines.toString();
    } else {
      return '';
    }

  }

}
