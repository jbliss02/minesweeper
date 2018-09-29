import { Component, OnInit, Input } from '@angular/core';
import { Cell } from '../../domain-model/cell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Input() Row: number;
  @Input() Col: number;
  @Input() Cell: Cell;

  constructor() { }

  ngOnInit() {
  }

  MineClick(e: any) {
    console.log(e.currentTarget.id);
  }

  GetMineText(): string {

    // if (this.Hidden) {
    //   return 'H';
    // } else {
    //   return 'U';
    // }
  }

}
