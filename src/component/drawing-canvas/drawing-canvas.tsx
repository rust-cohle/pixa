import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { mergeMap, skipUntil, takeUntil, throttleTime } from 'rxjs/operators';
import { ColorService } from '../editor/color-service';
import { fromKonvaEvent } from './utils';

export interface ICanvasConfig {
    squareSize: number,
    stageSize: {
        width: number,
        height: number,
    }
}

interface CellRects {
    [cellId: string]: Konva.Node
};

interface DrawingCanvasProps {
    canvasConfig: ICanvasConfig;
    colorService: ColorService
}
function DrawingCanvas(props: DrawingCanvasProps): JSX.Element {
    const cellRects: CellRects = {};

    const canvasContainer = useRef(null);

    const colorService: ColorService = props.colorService;

    useEffect(() => {
        const { width, height } = props.canvasConfig.stageSize;
        const stage = new Konva.Stage({
            id: 'stage',
            container: canvasContainer.current.getAttribute('id') as string, // id of container <div>
            width,
            height,
            scale: { x: 1, y: 1 }
        });

        drawCells(props, stage);
        stage.batchDraw();
    });

    function drawCells(props: DrawingCanvasProps, stage: Konva.Stage) {
        const { width, height } = props.canvasConfig.stageSize;
        const { squareSize } = props.canvasConfig;
        const cellsPerLine = Math.floor(width / squareSize);
        const cellsPerColumn = Math.floor(height / squareSize);

        const layer = new Konva.Layer();
        stage.add(layer);
        
        layer.draw();
        setLayerListeners(layer);

        for (let i = 0; i < cellsPerLine; i++) {
            for (let j = 0; j < cellsPerColumn; j++) {
                drawCell(props, layer, { x: i * squareSize, y: j * squareSize })
            }
        }
    }

    function drawCell(props: DrawingCanvasProps, layer: Konva.Layer, position: { x: number, y: number }) {
        const { squareSize } = props.canvasConfig;
        const cellId = getCellId(position);
        const { x, y } = position;

        const rect = new Konva.Rect({
            id: cellId,
            x,
            y,
            width: squareSize,
            height: squareSize,
            fill: '#000',
        })
        cellRects[cellId] = rect;
        layer.add(rect);
        setCellCanvasListeners(rect, cellId);
    }

    function setLayerListeners(layer: Konva.Layer) {
        const layerMouseDown$ = fromKonvaEvent(layer, 'mousedown');
        const layerMouseUp$ = fromKonvaEvent(layer, 'mouseup');
        const layerMouseLeave$ = fromKonvaEvent(layer, 'mouseleave');
        const layerMove$ = fromKonvaEvent(layer, 'mousemove').pipe(throttleTime(5));
        const layerDrag$ = layerMove$.pipe(
            mergeMap(
                () => layerMove$.pipe(
                    skipUntil(layerMouseDown$),
                    takeUntil(layerMouseUp$),
                    takeUntil(layerMouseLeave$)
                )
            )
        );

        layerDrag$.subscribe(ev => {
            const position = { x: ev.target.x(), y: ev.target.y() };
            const cellId = getCellId(position);
            const rect = cellRects[cellId] as Konva.Rect;
            if(!rect) {
                console.warn(`Cell not found: ${cellId}`);
                return;
            }

            changeCellColor(rect);
        })
    }

    function getCellId(pos: {x: number, y: number}): string {
        return `cell-${pos.x}-${pos.y}`;
    }

    function setCellCanvasListeners(rect: Konva.Rect, cellId: string) {
        if (!rect) return;

        rect.on('click', ev => {
            changeCellColor(rect);
        });

        const layerClick$ = fromKonvaEvent(rect, 'click');
        layerClick$.subscribe(ev => {
            rect.setAttr('fill', colorService.selectedColor.hexa);
            (rect.getParent() as Konva.Layer).batchDraw();
        });
    }

    function changeCellColor(rect: Konva.Rect): void {
        if(!rect) {
            return;
        }

        rect.setAttr('fill', colorService.selectedColor.hexa);
        (rect.getParent() as Konva.Layer).batchDraw();
    }

    return <div ref={canvasContainer} id="drawing-canvas" />;
}

export default DrawingCanvas;
