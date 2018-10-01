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

  constructor() { }

  MineClick(e: any) {
    this.Cell.IsHidden = false;
  }

  GetMineText(): string {

    if (this.Cell.IsHidden) {
      return 'H';
    }

    if (this.Cell.HasMine) {
      return 'M';
    }

    return 'E';
  }

}
