export class Cell {
    public ID: number;
    public Row: number;
    public Col: number;
    public HasMine = false;
    public IsHidden = true;
    public AdjacentMines = 0;
    public IsFlagged = false;
}
