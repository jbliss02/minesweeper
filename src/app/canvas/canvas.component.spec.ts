import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasComponent } from './canvas.component';
import { CanvasService, ICanvasService } from './canvas.service';
import { Row } from '../../domain-model/row';
import { ArrayType } from '@angular/compiler';

describe('CanvasService', () => {

  describe('GetMap', () => {

      let canvasService: ICanvasService;
      let nCol: number;
      let nRow: number;
      let row: Row;
      let testMap: Array<Row>;

      beforeEach(() => {
        this.canvasService = new CanvasService();
        this.nCol = 11;
        this.nRow = 12;
        this.testMap = new Array<Row>(this.nRow);
        this.row = new Row();
      });

      it('should return array', () => {

        expect(this.canvasService.GetMap(this.nRow, this.nCol)).toBeTruthy();
        expect(this.canvasService.GetMap(this.nRow, this.nCol)).toEqual(jasmine.any(Array));
        expect(this.canvasService.GetMap(this.nRow, this.nCol)).toContain(jasmine.objectContaining(this.row));
      });
  });

});
