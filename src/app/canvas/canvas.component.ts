import { Component, OnInit } from '@angular/core';
import { Cell } from '../../domain-model/cell';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  Rows = 10;
  Cols = 10;
  MineDensity = 0.1;

  Cells: Array<Cell>;

  constructor() {

    this.SetupCells(this.Rows, this.Cols);

  }

  ngOnInit() {
  }

  SetupCells(Rows: number, Cols: number) {

    this.Cells = new Array<Cell>(Cols);

    for (let i = 0; i < Cols; i++) {
      this.Cells[i] = new Cell();
      this.Cells[i].Col = i;

      if (i % 2 === 0) {
        this.Cells[i].HasMine = true;
      }
    }
  }

}
