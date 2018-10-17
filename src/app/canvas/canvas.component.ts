import { Component, OnInit, inject, Injectable } from '@angular/core';
import { Row } from '../../domain-model/row';
import { CanvasService } from './canvas.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  providers: [CanvasService]
})

export class CanvasComponent implements OnInit {

  Rows = 10;
  Cols = 10;
  MineDensity = 0.22;

  Map: Array<Row>;

  private canvasService: CanvasService;

  constructor(canvasService: CanvasService) {

    this.canvasService = canvasService;
    this.SetupMap();
  }

  ngOnInit() {
  }

  SetupMap() {

    this.Map = this.canvasService.GetMap(this.Rows, this.Cols, this.MineDensity);
  }

  RevealAll() {

    this.Map.forEach(x => x.Cells.forEach(y => {
      y.IsHidden = false;
    }));
  }
}

