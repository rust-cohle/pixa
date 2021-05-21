import Konva from "konva";
import { Subject, Observable } from "rxjs";
import { Color } from "../editor/model/color";
import { Position } from "./model/position";

export interface DrawingAction {
    actionId: number;
    cellIds: string[]
}

export interface CellHistory {
    [actionId: string]: {
        appliedColor: Color;
        previousColor: Color;
    }
}

export interface CellsHistory {
    [cellId: string]: CellHistory;
}

export type DrawingHistory = {
    actions: DrawingAction[],
    cellsHistory: CellsHistory
}

/**
 * DrawingHistory:
 *  actions: [
 *      {actionId: 1, cellIds: ["cell1", "cell2", "cell3", "cell4"]},
 *      {actionId: 2, cellIds: ["cell1", "cell2"]},
 *      {actionId: 3, cellIds: ["cell1", "cell3"]}
 *  ],
 *  cellsHistory: {
 *      cell1: [{appliedColor: 1, previousColor: 1}, {appliedColor: 2, previousColor: 1}, {appliedColor: 3, previousColor: 2}],
 *      cell2: [{appliedColor: 1, previousColor: 1}, {appliedColor: 2, previousColor: 1}],
 *      cell3: [{appliedColor: 1, previousColor: 1}, {appliedColor: 3, previousColor: 1}],
 *      cell4: [{appliedColor: 1, previousColor: 1}]
 *  }
 */
export class DrawingService {
    private drawingHistory: DrawingHistory = {
        actions: [],
        cellsHistory: {} 
    };
    
    private _positionInHistory: number = -1;

    private _actionCount: number = 1;

    private _undoAction$: Subject<DrawingAction> = new Subject();

    private _redoAction$: Subject<DrawingAction> = new Subject();

    constructor() { }

    get undoAction$(): Observable<DrawingAction> {
        return this._undoAction$.asObservable();
    }

    get redoAction$(): Observable<DrawingAction> {
        return this._redoAction$.asObservable();
    }

    get history(): DrawingHistory {
        return this.drawingHistory;
    }

    get positionInHistory(): number {
        return this._positionInHistory;
    }

    newDrawingAction(): DrawingAction {
        this._positionInHistory++;
        
        const drawingAction: DrawingAction = {
            actionId: this._positionInHistory,
            cellIds: []
        };

        this.drawingHistory.actions.push(drawingAction);
        return drawingAction;
    }
    
    updateCell(rect: Konva.Rect, color: Color): void {
        const latestAction: DrawingAction = this.drawingHistory.actions[this.drawingHistory.actions.length - 1];
        if (!latestAction) {
            return;
        }

        const position = { x: rect.x(), y: rect.y() };
        const cellId = this.getCellId(position);
        const { cellIds, actionId } = latestAction;

        // Update latest action with this cell
        cellIds.push(cellId);

        // Update the cell history to record new color
        if(!this.drawingHistory.cellsHistory[cellId]) {
            this.drawingHistory.cellsHistory[cellId] = {};
        }

        const cellHistory = this.drawingHistory.cellsHistory[cellId];
        const currentColor = rect.getAttr('fill');

        cellHistory[actionId] = {
            appliedColor: color,
            previousColor: currentColor ? new Color({hexa: currentColor}) : color
        }
    }

    getCellId(pos: Position): string {
        return `cell-${pos.x}-${pos.y}`;
    }

    undo(): void {
        if (this._positionInHistory === 0) {
            return;
        }

        this._undoAction$.next(this.drawingHistory.actions[this._positionInHistory]);
        this._positionInHistory--;
    }
    
    redo(): void {
        if (this._positionInHistory === this.drawingHistory.actions.length - 1) {
            return;
        }
        
        this._redoAction$.next(this.drawingHistory.actions[this._positionInHistory + 1]);
        this._positionInHistory++;
    }
}
