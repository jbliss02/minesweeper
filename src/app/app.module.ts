import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { RouterModule, Routes } from '@angular/router';
import { CellComponent } from './cell/cell.component';
import { CanvasService } from './canvas/canvas.service';


const appRoutes: Routes = [

{
 path: 'canvas',
 component: CanvasComponent,
 data: { title: 'Canvas' }
}];

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    CellComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    CanvasService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
