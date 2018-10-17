import { Injectable } from '@angular/core';
import { Row } from '../../domain-model/row';
import { Cell } from '../../domain-model/cell';
import { HammerGestureConfig } from '@angular/platform-browser';

export interface ICanvasService {
    GetMap(Rows: number, Cols: number, MineDensity: number): Array<Row>;
}

@Injectable({
    providedIn: 'root'
  })
export class CanvasService implements ICanvasService {

    public GetMap(Rows: number, Cols: number, MineDensity: number): Array<Row> {

        const result = new Array<Row>(Rows);

        for (let i = 0; i < Rows; i++) {
            result[i] = new Row();
            result[i].Cells = new Array<Cell>(Cols);

          for (let n = 0; n < Cols; n++) {
            result[i].Cells[n] = new Cell();
            result[i].Cells[n].ID = i * n;
            }
          }

        this.PlantMines(result, MineDensity);
        return result;
    }

    private PlantMines (Map: Array<Row>, MineDensity: number) {

        const nMines = (Map.length * Map[0].Cells.length) * MineDensity;
        const locations = Array<number>();
        const cells = Map.length * Map[0].Cells.length;

        let allocated = 0;

        while (allocated < nMines) {

            const location = Math.floor(Math.random() * Math.floor(cells));
            allocated = this.PlantMine(Map, locations, location, allocated);
        }
    }

    private PlantMine(Map: Array<Row>, locations: Array<number>, location: number, mineCount: number) {

        if (!locations.includes(location)) {

            const row = Math.floor(location / Map.length);
            const col = Math.floor(location - (row * Map.length));

            Map[row].Cells[col].HasMine = true;
            locations.push(location);
            mineCount++;
        }
        return mineCount;
    }

    private SetAdjacentMines(Map: Array<Row>, locations: Array<number>) {

    }
}
