import { Component, OnInit } from '@angular/core';
import { Cell } from '../../domain-model/cell';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  Cells: Array<Cell>;

  constructor() {
    this.Cells = new Array<Cell>(5);

    for (let i = 0; i < 5; i++) {
      this.Cells[i] = new Cell();
      this.Cells[i].Col = i;

      if (i % 2 === 0) {
        this.Cells[i].HasMine = true;
      }
    }

  }

  ngOnInit() {
  }

}
