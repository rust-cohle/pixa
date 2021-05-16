import Konva from 'konva';
import { useEffect, useRef } from 'react';

export interface ICanvasConfig {
    squareSize: number,
    stageSize: {
        width: number,
        height: number,
    }
}

interface DrawingCanvasProps {
    canvasConfig: ICanvasConfig
}
function DrawingCanvas(props: DrawingCanvasProps): JSX.Element {
    const canvasContainer = useRef(null);

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

    return (
        <div ref={canvasContainer} id="drawing-canvas">
        </div>
    );
}

function setCanvasListeners(layer: Konva.Layer) {
    if (!layer) return;
    layer.on('click', (evt) => {
        const results = layer.getChildren(node => {
            return node.getAttr('id') === 'squarex';
        }) as Konva.Collection<Konva.Rect>;
        const rect = results[0];
        rect.setAttr('fill', '#ff0000');
        layer.batchDraw();
    });

    layer.on('mousemove', (evt) => {
        console.log(evt);
    });
}

function drawCells(props, stage) {
    const { width, height } = props.canvasConfig.stageSize;
    const { squareSize } = props.canvasConfig;
    const cellsPerLine = Math.floor(width/squareSize);
    const cellsPerColumn = Math.floor(height/squareSize);

    for(let i = 0; i < cellsPerLine; i++) {
        for(let j = 0; j < cellsPerColumn; j++) {
            drawCell(props, stage, {x: i*squareSize, y: j*squareSize})
        }
    }
}

function drawCell(props, stage, position: {x: number, y: number}) {
    const { squareSize } = props.canvasConfig;
    const layer = new Konva.Layer();
    stage.add(layer);
    const rect = new Konva.Rect({
        id: 'squarex',
        x: position.x,
        y: position.y,
        width: squareSize,
        height: squareSize,
        fill: '#000',
    })
    layer.add(rect);
    layer.draw();
    setCanvasListeners(layer);
}

export default DrawingCanvas;
