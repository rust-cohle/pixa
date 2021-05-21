import makeStyles from "@material-ui/core/styles/makeStyles";
import Brush from '@material-ui/icons/Brush';
import BorderColor from '@material-ui/icons/BorderColor';
import FormatColorFill from '@material-ui/icons/FormatColorFill';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import ClearAll from '@material-ui/icons/ClearAll';
import { DrawingService } from "../../../drawing-canvas/drawing-service";

const useStyles = makeStyles((theme) => ({
    toolbar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    drawingTools: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    },
    actionTools: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    },
    toolIcon: {
        paddingLeft: 2,
        paddingRight: 2,
    }
}));

interface ToolbarProps {
    drawingService: DrawingService;
}
const Toolbar = (props: ToolbarProps) => {
    const classes = useStyles();

    const drawingService = props.drawingService;

    function onLogHistory(ev) {
        ev.preventDefault();

        console.log(drawingService.history);
    }

    function onUndo(): void {
        drawingService.undo();
    }
    
    function onRedo(): void {
        drawingService.redo();
    }

    return (
        <div>
            <div>Toolbar</div>
            <a href="/" onClick={onLogHistory}>Log history</a>
            <div className={classes.toolbar}>
                <div className={classes.drawingTools}>
                    <Brush className={classes.toolIcon} titleAccess="Brush" />
                    <BorderColor className={classes.toolIcon} titleAccess="Pen" />
                    <FormatColorFill className={classes.toolIcon} titleAccess="Fill" />
                </div>
                <div className={classes.actionTools}>
                    <Undo onClick={onUndo} className={classes.toolIcon} titleAccess="Undo" />
                    <Redo onClick={onRedo} className={classes.toolIcon} titleAccess="Redo" />
                    <ClearAll className={classes.toolIcon} titleAccess="Clear all" />
                </div>                
            </div>
        </div>
    );
}

export default Toolbar;
