import { Component, Input } from '@angular/core';
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

  MineClass: string;

  constructor() {

      this.MineClass = 'Cell Hidden';
  }

  MineClick(e: any) {
    this.Cell.IsHidden = false;
    this.SetCellClass();
  }

  SetCellClass() {

    if (this.Cell.IsHidden) {
      this.MineClass = 'Cell Hidden';
    } else {
      this.MineClass = 'Cell Visible';
    }

  }

  GetMineText(): string {

    if (this.Cell.IsHidden) {
      return 'H';
    }

    if (this.Cell.HasMine) {
      return 'M';
    }

    return '';
  }

}
