import makeStyles from "@material-ui/core/styles/makeStyles";
import ColorPalette from "./colors/color-palette/color-palette";
import ColorPicker from "./colors/color-picker/color-picker";
import { ColorService } from "./color-service";
import LatestColors from "./tools/latest-colors/latest-colors";
import Toolbar from "./tools/toolbar/toolbar";
import { DrawingService } from "../drawing-canvas/drawing-service";

const useStyles = makeStyles((theme) => ({
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    }
}));

interface EditorProps {
    colorService: ColorService,
    drawingService: DrawingService,
}
const Editor = (props: EditorProps) => {
    const classes = useStyles();

    return (
        <div className={classes.flexColumn}>
            <Toolbar drawingService={props.drawingService} />
            <ColorPalette colorService={props.colorService} />
            <LatestColors colorService={props.colorService} />
            <ColorPicker />
        </div>
    );
}

export default Editor;