import { Component, OnInit } from '@angular/core';
import { Cell } from '../../domain-model/cell';
import { Row } from '../../domain-model/row';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  Rows = 10;
  Cols = 10;
  MineDensity = 0.1;

  Map: Array<Row>;

  constructor() {

    this.SetupMap(this.Rows, this.Cols);

  }

  ngOnInit() {
  }

  SetupMap(Rows: number, Cols: number) {

    this.Map = new Array<Row>(Rows);

    for (let i = 0; i < Rows; i++) {
      this.Map[i] = new Row();
      this.Map[i].Cells = new Array<Cell>(Cols);

      for (let n = 0; n < Cols; n++) {
        this.Map[i].Cells[n] = new Cell();
      }
    }
  }

}
