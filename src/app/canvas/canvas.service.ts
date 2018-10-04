import { Injectable } from '@angular/core';
import { Row } from '../../domain-model/row';
import { Cell } from '../../domain-model/cell';

export interface ICanvasService {
    GetMap(Rows: number, Cols: number): Array<Row>;
}

@Injectable({
    providedIn: 'root'
  })
export class CanvasService implements ICanvasService {

    public GetMap(Rows: number, Cols: number): Array<Row> {

        const result = new Array<Row>(Rows);

        for (let i = 0; i < Rows; i++) {
            result[i] = new Row();
            result[i].Cells = new Array<Cell>(Cols);

          for (let n = 0; n < Cols; n++) {
            result[i].Cells[n] = new Cell();
          }
        }

        return result;
    }
}
