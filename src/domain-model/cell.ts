export class Cell {
    public ID: number;
    public Row: number;
    public Col: number;
    public HasMine: boolean;
    public IsHidden = true;
    public AdjacentMines = 0;
}
