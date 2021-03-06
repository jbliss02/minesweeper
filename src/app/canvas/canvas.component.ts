import { Component, OnInit, inject, Injectable } from '@angular/core';
import { Row } from '../../domain-model/row';
import { CanvasService } from './canvas.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Cell } from 'src/domain-model/cell';
import { ThrowStmt } from '@angular/compiler';
import { GameArea } from 'src/domain-model/game-area';

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

  GameMap: GameArea;
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

    this.GameMap = this.canvasService.GetNewGameArea(this.Rows, this.Cols, this.MineDensity);
  }

  RevealAll() {

    this.canvasService.RevealAllCells(this.GameMap);
  }

  public OnCellClick($event): any {

      if ($event.HasMine !== undefined && $event.HasMine === true) {
        this.DoGameOver();
        return;
      }

      if ($event.AdjacentMines === 0) {
        this.canvasService.ShowAdjacentEmptyCells(this.GameMap, $event.ID);
      }

  }

  public OnCellFlag($event): any {

    if ($event.IsFlagged) {
      this.GameMap.MinesFlagged++;
    } else {
      this.GameMap.MinesFlagged--;
    }
  }

  public NewGame() {

    this.GameMap = this.canvasService.GetNewGameArea(this.Rows, this.Cols, this.MineDensity);
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

