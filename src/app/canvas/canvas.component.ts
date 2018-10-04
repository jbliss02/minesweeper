import { Component, OnInit, inject, Injectable } from '@angular/core';
import { Row } from '../../domain-model/row';
import { CanvasService } from './canvas.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  providers: [CanvasService]
})

export class CanvasComponent implements OnInit {

  Rows = 10;
  Cols = 10;
  MineDensity = 0.1;

  Map: Array<Row>;

  private canvasService: CanvasService;

  constructor(canvasService: CanvasService) {
    this.canvasService = canvasService;
    this.SetupMap(this.Rows, this.Cols);

  }

  ngOnInit() {
  }

  SetupMap(Rows: number, Cols: number) {

    this.Map = this.canvasService.GetMap(this.Rows, this.Cols);
  }

}
