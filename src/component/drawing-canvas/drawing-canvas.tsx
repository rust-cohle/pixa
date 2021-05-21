import Konva from "konva";
import { useEffect, useRef } from "react";
import { of } from "rxjs";
import {
    concatMap,
    distinctUntilChanged,
    map,
    skipUntil,
    takeUntil,
    tap,
    throttleTime,
} from "rxjs/operators";
import { ColorService } from "../editor/color-service";
import { Color } from "../editor/model/color";
import { DrawingAction, DrawingService } from "./drawing-service";
import { Position } from "./model/position";
import { fromKonvaEvent } from "./utils";

export interface CanvasConfig {
    squareSize: number;
    stageSize: {
        width: number;
        height: number;
    };
}

interface CellRects {
    [cellId: string]: Konva.Node;
}

interface DrawingCanvasProps {
    canvasConfig: CanvasConfig;
    drawingService: DrawingService;
    colorService: ColorService;
}
function DrawingCanvas(props: DrawingCanvasProps): JSX.Element {
    const cellRects: CellRects = {};
    const canvasContainer = useRef(null);
    const colorService: ColorService = props.colorService;
    const drawingService: DrawingService = props.drawingService;

    useEffect(() => {
        drawingService.undoAction$.subscribe((drawingAction: DrawingAction) => {
            const cells = drawingAction.cellIds.map(cellId => ({
                rect: cellRects[cellId] as Konva.Rect,
                color: drawingService.history.cellsHistory[cellId][drawingAction.actionId].previousColor
            }));

            cells
            .filter(({color}) => !!color)
            .forEach(({rect, color}) => {
                changeCellColor(rect, color, false)
            });
        });

        drawingService.redoAction$.subscribe((drawingAction: DrawingAction) => {
            const cells = drawingAction.cellIds.map(cellId => ({
                rect: cellRects[cellId] as Konva.Rect,
                color: drawingService.history.cellsHistory[cellId][drawingAction.actionId].appliedColor
            }));

            cells.forEach(({rect, color}) => changeCellColor(rect, color, false));
        });

        const { width, height } = props.canvasConfig.stageSize;
        const stage = new Konva.Stage({
            id: "stage",
            container: canvasContainer.current.getAttribute("id") as string, // id of container <div>
            width,
            height,
            scale: { x: 1, y: 1 },
        });

        initGrid(props, stage);
        stage.batchDraw();
    }, []);

    function initGrid(props: DrawingCanvasProps, stage: Konva.Stage): void {
        const { width, height } = props.canvasConfig.stageSize;
        const { squareSize } = props.canvasConfig;
        const cellsPerLine = Math.floor(width / squareSize);
        const cellsPerColumn = Math.floor(height / squareSize);

        const layer = new Konva.Layer();
        stage.add(layer);

        layer.draw();
        setLayerListeners(layer);

        drawingService.newDrawingAction();
        for (let i = 0; i < cellsPerLine; i++) {
            for (let j = 0; j < cellsPerColumn; j++) {
                drawCell(
                    props,
                    layer,
                    { x: i * squareSize, y: j * squareSize }
                );
            }
        }
    }

    function drawCell(
        props: DrawingCanvasProps,
        layer: Konva.Layer,
        position: Position
    ) {
        const { squareSize } = props.canvasConfig;
        const cellId = drawingService.getCellId(position);
        const { x, y } = position;

        const rect = new Konva.Rect({
            id: cellId,
            x,
            y,
            width: squareSize,
            height: squareSize
        });

        cellRects[cellId] = rect;
        layer.add(rect);
        changeCellColor(rect, colorService.selectedColor);
        setCellCanvasListeners(rect);
    }

    function setLayerListeners(layer: Konva.Layer) {
        const layerMouseDown$ = fromKonvaEvent(layer, "mousedown");
        const layerMouseUp$ = fromKonvaEvent(layer, "mouseup");
        const layerMouseLeave$ = fromKonvaEvent(layer, "mouseleave");
        const layerMove$ = fromKonvaEvent(layer, "mousemove").pipe(
            throttleTime(5)
        );
        const layerDrag$ = layerMove$.pipe(
            concatMap(() =>
                layerMove$.pipe(
                    // Ignore the mousemove unless the user does a mousedown
                    skipUntil(layerMouseDown$),
                    // Create a drawing action first time user does a mousedown
                    concatMap((value, index) =>
                        index === 0 ?
                            of(value).pipe(
                                tap(() => drawingService.newDrawingAction())
                            ) :
                            of(value)
                    ),
                    // Stop inner stream whenever user does a mouseup or a mouseleave
                    takeUntil(layerMouseUp$),
                    takeUntil(layerMouseLeave$),
                    // Map the event to a cell ID
                    map(ev => {
                        const position = { x: ev.target.x(), y: ev.target.y() };
                        return drawingService.getCellId(position);
                    }),
                    // Ignore duplicates
                    distinctUntilChanged(),
                )
            )
        );

        layerDrag$.subscribe((cellId) => {
            const rect = cellRects[cellId] as Konva.Rect;
            if (!rect) {
                console.warn(`Cell not found: ${cellId}`);
                return;
            }

            changeCellColor(rect, colorService.selectedColor);
        });
    }

    function setCellCanvasListeners(rect: Konva.Rect) {
        if (!rect) return;

        rect.on("click", () => {
            drawingService.newDrawingAction();
            changeCellColor(rect, colorService.selectedColor);
        });

        const layerClick$ = fromKonvaEvent(rect, "click");
        layerClick$.subscribe(() => {
            rect.setAttr("fill", colorService.selectedColor.hexa);
            (rect.getParent() as Konva.Layer).batchDraw();
        });
    }

    function changeCellColor(rect: Konva.Rect, color: Color, isUserAction = true): void {
        if (!rect) {
            return;
        }

        if(isUserAction) {
            drawingService.updateCell(rect, color);
        }
        rect.setAttr("fill", color.hexa);
        (rect.getParent() as Konva.Layer).batchDraw();
    }

    return <div ref={canvasContainer} id="drawing-canvas" />;
}

export default DrawingCanvas;
