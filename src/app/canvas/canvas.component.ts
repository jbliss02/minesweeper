import { Component, OnInit, inject, Injectable } from '@angular/core';
import { Row } from '../../domain-model/row';
import { CanvasService } from './canvas.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Cell } from 'src/domain-model/cell';
import { ThrowStmt } from '@angular/compiler';

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
  MinesLeft: number;

  Map: Array<Row>;
  GameOver = false;

  private canvasService: CanvasService;

  constructor(canvasService: CanvasService) {

    this.canvasService = canvasService;
    this.SetupMap();
  }

  ngOnInit() {

    this.DisableRightClickContextMenu();
  }

  SetupMap() {

    this.Map = this.canvasService.GetMap(this.Rows, this.Cols, this.MineDensity);

    /// TODO - Extend Map so is not just an array of rows but object that holds other properties
  }

  RevealAll() {

    this.canvasService.RevealAllCells(this.Map);
  }

  public OnCellClick($event): any {

      if ($event.HasMine !== undefined && $event.HasMine === true) {
        this.DoGameOver();
        return;
      }

      if ($event.AdjacentMines === 0) {
        this.canvasService.ShowAdjacentEmptyCells(this.Map, $event.ID);
      }

  }

  public OnCellFlag($event): any {

    if ($event.IsFlagged) {
      this.MinesLeft--;
    } else {
      this.MinesLeft--;
    }
  }

  public NewGame() {

    this.Map = this.canvasService.GetMap(this.Rows, this.Cols, this.MineDensity);
  }

  private DoGameOver(): void {

    this.GameOver = true;
    this.RevealAll();
    console.log('Bang!');
  }

  private DisableRightClickContextMenu() {

    window.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
  }
}

