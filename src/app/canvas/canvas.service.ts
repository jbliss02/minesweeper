import { Injectable } from '@angular/core';
import { Row } from '../../domain-model/row';
import { Cell } from '../../domain-model/cell';
import { HammerGestureConfig } from '@angular/platform-browser';
import { mapChildrenIntoArray } from '@angular/router/src/url_tree';
import { CloneVisitor } from '@angular/compiler/src/i18n/i18n_ast';


export interface ICanvasService {
    GetMap(Rows: number, Cols: number, MineDensity: number): Array<Row>;
    GetCell (Map: Array<Row>, CellID: number): Cell;
    ShowAdjacentEmptyCells(Map: Array<Row>, CellID: number);
    RevealAllCells(Map: Array<Row>);
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

            if (i === 0) {
                result[i].Cells[n].ID = n;
            } else if (n === 0) {
                result[i].Cells[n].ID = result[i - 1].Cells[result[i - 1].Cells.length - 1].ID + 1;
            } else {
                result[i].Cells[n].ID = result[i - 1].Cells[result[i - 1].Cells.length - 1].ID + n + 1;
            }

            result[i].Cells[n].Col = n;
            result[i].Cells[n].Row = i;
        }
    }

        this.PlantMines(result, MineDensity);
        this.SetAdjacentMines(result);
        return result;
    }

    public GetCell (Map: Array<Row>, CellID: number): Cell {

        let result: Cell;
        Map.forEach(row => {

            const cell = row.Cells.find(x => x.ID === CellID);

            if (cell !== undefined) {
                result = cell;
            }
        });

        return result; // JB - Throw error
    }

    public RevealAllCells(Map: Array<Row>) {

        Map.forEach(x => x.Cells.forEach(y => {
            y.IsHidden = false;
          }));
    }

    private GetCellFromCoordinates (Map: Array<Row>, rowID: number, colID: number): Cell {

        return Map[rowID].Cells[colID];
    }

    public ShowAdjacentEmptyCells(Map: Array<Row>, CellID: number): void {

        const empty = this.GetAdjacentCells(Map, CellID).filter(x => x.HasMine === false && x.AdjacentMines === 0);
        empty.forEach(x => x.IsHidden = false);
    }

    private GetAdjacentCells(Map: Array<Row>, CellID: number): Array<Cell> {

        const result = new Array<Cell>();

        const cell = this.GetCell(Map, CellID);

        // top left
        if (cell.Row > 0 && cell.Col > 0) {
            result.push(this.GetCellFromCoordinates(Map, cell.Row - 1, cell.Col - 1));
        }

        // top
        if (cell.Row > 0) {
            result.push(this.GetCellFromCoordinates(Map, cell.Row - 1, cell.Col));
        }

        // top right
        if (cell.Row > 0 && cell.Col < Map.length) {
            result.push(this.GetCellFromCoordinates(Map, cell.Row - 1, cell.Col + 1));
        }

        // right
        if (cell.Col < Map.length) {
            result.push(this.GetCellFromCoordinates(Map, cell.Row, cell.Col + 1));
        }

        // bottom right
        if (cell.Row < Map[0].Cells.length && cell.Col < Map.length) {
            result.push(this.GetCellFromCoordinates(Map, cell.Row + 1, cell.Col + 1));
        }

        // bottom
        if (cell.Row < Map[0].Cells.length) {
            result.push(this.GetCellFromCoordinates(Map, cell.Row + 1, cell.Col));
        }

        // bottom left
        if (cell.Row < Map[0].Cells.length && cell.Col > 0) {
            result.push(this.GetCellFromCoordinates(Map, cell.Row + 1, cell.Col - 1));
        }

        // left
        if (cell.Col > 0) {
            result.push(this.GetCellFromCoordinates(Map, cell.Row, cell.Col - 1));
        }

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
