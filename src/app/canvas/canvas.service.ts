import { Injectable } from '@angular/core';
import { Row } from '../../domain-model/row';
import { Cell } from '../../domain-model/cell';
import { GameArea } from 'src/domain-model/game-area';

export interface ICanvasService {
    GetNewGameArea(Rows: number, Cols: number, MineDensity: number): GameArea;
    GetCell (GameArea: GameArea, CellID: number): Cell;
    ShowAdjacentEmptyCells(GameMap: GameArea, CellID: number);
    RevealAllCells(GameMap: GameArea);
}

@Injectable({
    providedIn: 'root'
  })
export class CanvasService implements ICanvasService {

    public GetNewGameArea(Rows: number, Cols: number, MineDensity: number): GameArea {

        const result = new GameArea();
        result.Rows = new Array<Row>(Rows);

        for (let i = 0; i < Rows; i++) {

            result.Rows[i] = new Row();
            result.Rows[i].Cells = new Array<Cell>(Cols);

            for (let n = 0; n < Cols; n++) {

                result.Rows[i].Cells[n] = new Cell();

                if (i === 0) {
                    result.Rows[i].Cells[n].ID = n;
                } else if (n === 0) {
                    result.Rows[i].Cells[n].ID = result.Rows[i - 1].Cells[result.Rows[i - 1].Cells.length - 1].ID + 1;
                } else {
                    result.Rows[i].Cells[n].ID = result.Rows[i - 1].Cells[result.Rows[i - 1].Cells.length - 1].ID + n + 1;
                }

                result.Rows[i].Cells[n].Col = n;
                result.Rows[i].Cells[n].Row = i;
            }
        }

        result.NumberMines = (result.Rows.length * result.Rows[0].Cells.length) * MineDensity;
        this.PlantMines(result, result.NumberMines);
        this.SetAdjacentMines(result);
        return result;
    }

    public GetCell (GameMap: GameArea, CellID: number): Cell {

        let result: Cell;
        GameMap.Rows.forEach(row => {

            const cell = row.Cells.find(x => x.ID === CellID);

            if (cell !== undefined) {
                result = cell;
            }
        });

        return result; // JB - Throw error
    }

    public RevealAllCells(GameMap: GameArea) {

        GameMap.Rows.forEach(x => x.Cells.forEach(y => {
            y.IsHidden = false;
          }));
    }

    private GetCellFromCoordinates (GameMap: GameArea, rowID: number, colID: number): Cell {

        return GameMap.Rows[rowID].Cells[colID];
    }

    public ShowAdjacentEmptyCells(GameMap: GameArea, CellID: number): void {

        // tslint:disable-next-line:max-line-length
        let empty = this.GetAdjacentCells(GameMap, CellID).filter(x => x.HasMine === false && x.IsFlagged === false && x.AdjacentMines === 0);

        do {
            empty.forEach(x => {
                x.IsHidden = false;
            });

            empty = empty.concat(this.GetAdjacentCellsFromArray(GameMap, empty));

        } while (empty.some(x => x.IsHidden === true));

    }

    private GetAdjacentCellsFromArray(GameMap: GameArea, Cells: Array<Cell>): Array<Cell> {

        let emptyCells = new Array<Cell>();

        Cells.forEach(x => {

            const em =  this.GetAdjacentCells(GameMap, x.ID);
            emptyCells = emptyCells.concat(em);

        });

        // TODO: Remove duplicates
        return emptyCells.filter(x => x.HasMine === false && x.IsFlagged === false && x.AdjacentMines === 0 && x.IsHidden === true);
    }

    private GetAdjacentCells(GameMap: GameArea, CellID: number): Array<Cell> {

        const rows = new Array<Cell>();

        const cell = this.GetCell(GameMap, CellID);

        // top left
        if (cell.Row > 0 && cell.Col > 0) {
            rows.push(this.GetCellFromCoordinates(GameMap, cell.Row - 1, cell.Col - 1));
        }

        // top
        if (cell.Row > 0) {
            rows.push(this.GetCellFromCoordinates(GameMap, cell.Row - 1, cell.Col));
        }

        // top right
        if (cell.Row > 0 && cell.Col < GameMap.Rows[0].Cells.length - 1) {
            rows.push(this.GetCellFromCoordinates(GameMap, cell.Row - 1, cell.Col + 1));
        }

        // right
        if (cell.Col < GameMap.Rows[0].Cells.length - 1) {
            rows.push(this.GetCellFromCoordinates(GameMap, cell.Row, cell.Col + 1));
        }

        // bottom right
        if (cell.Row < GameMap.Rows.length - 1 && cell.Col < GameMap.Rows[0].Cells.length - 1) {
            rows.push(this.GetCellFromCoordinates(GameMap, cell.Row + 1, cell.Col + 1));
        }

        // bottom
        if (cell.Row < GameMap.Rows[0].Cells.length - 1) {
            rows.push(this.GetCellFromCoordinates(GameMap, cell.Row + 1, cell.Col));
        }

        // bottom left
        if (cell.Row < GameMap.Rows[0].Cells.length - 1 && cell.Col > 0) {
            rows.push(this.GetCellFromCoordinates(GameMap, cell.Row + 1, cell.Col - 1));
        }

        // left
        if (cell.Col > 0) {
            rows.push(this.GetCellFromCoordinates(GameMap, cell.Row, cell.Col - 1));
        }

        return rows;
    }

    private PlantMines (GameMap: GameArea, nMines: number) {

        const locations = Array<number>();
        const cells = GameMap.Rows.length * GameMap.Rows[0].Cells.length;

        let allocated = 0;

        while (allocated < nMines) {

            const location = Math.floor(Math.random() * Math.floor(cells));
            allocated = this.PlantMine(GameMap, locations, location, allocated);
        }
    }

    private PlantMine(GameMap: GameArea, locations: Array<number>, location: number, mineCount: number) {

        if (!locations.includes(location)) {

            const row = Math.floor(location / GameMap.Rows.length);
            const col = Math.floor(location - (row * GameMap.Rows.length));

            GameMap.Rows[row].Cells[col].HasMine = true;
            locations.push(location);
            mineCount++;
        }
        return mineCount;
    }

    private SetAdjacentMines(GameMap: GameArea) {

        for (let row = 0; row < GameMap.Rows.length; row++) {

            for (let cell = 0; cell < GameMap.Rows[row].Cells.length; cell++) {

                if (GameMap.Rows[row].Cells[cell].HasMine) {
                    continue;
                }

                this.SetMinesToLeft(GameMap, row, cell);
                this.SetMinesToRight(GameMap, row, cell);
                this.SetMinesToBottom(GameMap, row, cell);
                this.SetMinesToTop(GameMap, row, cell);
                this.SetMinesToTopRight(GameMap, row, cell);
                this.SetMinesToTopLeft(GameMap, row, cell);
                this.SetMinesToBottomRight(GameMap, row, cell);
                this.SetMinesToBottomLeft(GameMap, row, cell);
            }
        }

    }

    private SetMinesToLeft(GameMap: GameArea, row: number, cell: number) {

        if (cell === 0) {
            return;
        }

        if (GameMap.Rows[row].Cells[cell - 1].HasMine) {
            GameMap.Rows[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToRight(GameMap: GameArea, row: number, cell: number) {

        if (cell === GameMap.Rows[row].Cells.length - 1) {
            return;
        }

        if (GameMap.Rows[row].Cells[cell + 1].HasMine) {
            GameMap.Rows[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToBottom(GameMap: GameArea, row: number, cell: number) {

        if (row === GameMap.Rows.length - 1) {
            return;
        }

        if (GameMap.Rows[row + 1].Cells[cell].HasMine) {
            GameMap.Rows[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToTop(GameMap: GameArea, row: number, cell: number) {

        if (row === 0) {
            return;
        }

        if (GameMap.Rows[row - 1].Cells[cell].HasMine) {
            GameMap.Rows[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToTopRight(GameMap: GameArea, row: number, cell: number) {

        if (row === 0 || cell === GameMap.Rows[row].Cells.length - 1) {
            return;
        }

        if (GameMap.Rows[row - 1].Cells[cell + 1].HasMine) {
            GameMap.Rows[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToTopLeft(GameMap: GameArea, row: number, cell: number) {

        if (row === 0 || cell === 0) {
            return;
        }

        if (GameMap.Rows[row - 1].Cells[cell - 1].HasMine) {
            GameMap.Rows[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToBottomRight(GameMap: GameArea, row: number, cell: number) {

        if (row === GameMap.Rows.length - 1 || cell === GameMap.Rows[row].Cells.length - 1) {
            return;
        }

        if (GameMap.Rows[row + 1].Cells[cell + 1].HasMine) {
            GameMap.Rows[row].Cells[cell].AdjacentMines++;
        }
    }

    private SetMinesToBottomLeft(GameMap: GameArea, row: number, cell: number) {

        if (row === GameMap.Rows.length - 1 || cell === 0) {
            return;
        }

        if (GameMap.Rows[row + 1].Cells[cell - 1].HasMine) {
            GameMap.Rows[row].Cells[cell].AdjacentMines++;
        }
    }
}
