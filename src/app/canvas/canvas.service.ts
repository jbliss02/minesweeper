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
        this.SetAdjacentMines(result);
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

    private SetAdjacentMines(Map: Array<Row>) {

        for (let row = 0; row < Map.length; row++) {

            for (let cell = 0; cell < Map[row].Cells.length; cell++) {

                if (Map[row].Cells[cell].HasMine) {
                    continue;
                }

                this.SetMinesToLeft(Map, row, cell);
                this.SetMinesToRight(Map, row, cell);
                this.SetMinesToBottom(Map, row, cell);
                this.SetMinesToTop(Map, row, cell);
                this.SetMinesToTopRight(Map, row, cell);
                this.SetMinesToTopLeft(Map, row, cell);
                this.SetMinesToBottomRight(Map, row, cell);
                this.SetMinesToBottomLeft(Map, row, cell);
            }
        }

    }

    private SetMinesToLeft(Map: Array<Row>, row: number, cell: number) {

        if (cell === 0) {
            return;
        }

        if (Map[row].Cells[cell - 1].HasMine) {
            Map[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToRight(Map: Array<Row>, row: number, cell: number) {

        if (cell === Map[row].Cells.length - 1) {
            return;
        }

        if (Map[row].Cells[cell + 1].HasMine) {
            Map[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToBottom(Map: Array<Row>, row: number, cell: number) {

        if (row === Map.length - 1) {
            return;
        }

        if (Map[row + 1].Cells[cell].HasMine) {
            Map[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToTop(Map: Array<Row>, row: number, cell: number) {

        if (row === 0) {
            return;
        }

        if (Map[row - 1].Cells[cell].HasMine) {
            Map[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToTopRight(Map: Array<Row>, row: number, cell: number) {

        if (row === 0 || cell === Map[row].Cells.length - 1) {
            return;
        }

        if (Map[row - 1].Cells[cell + 1].HasMine) {
            Map[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToTopLeft(Map: Array<Row>, row: number, cell: number) {

        if (row === 0 || cell === 0) {
            return;
        }

        if (Map[row - 1].Cells[cell - 1].HasMine) {
            Map[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToBottomRight(Map: Array<Row>, row: number, cell: number) {

        if (row === Map.length - 1 || cell === Map[row].Cells.length - 1) {
            return;
        }

        if (Map[row + 1].Cells[cell + 1].HasMine) {
            Map[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToBottomLeft(Map: Array<Row>, row: number, cell: number) {

        if (row === Map.length - 1 || cell === 0) {
            return;
        }

        if (Map[row + 1].Cells[cell - 1].HasMine) {
            Map[row].Cells[cell].AdjacentMines++;
        }
    }
}
