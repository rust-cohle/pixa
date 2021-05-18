import makeStyles from "@material-ui/core/styles/makeStyles";
import ColorPalette from "../color-palette/color-palette";
import ColorPicker from "../color-picker/color-picker";
import { ColorService } from "../color-service";

const useStyles = makeStyles((theme) => ({
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    }
}));

interface ColorPanelProps {
    colorService: ColorService
}
const ColorPanel = (props: ColorPanelProps) => {
    const classes = useStyles();

    return (
        <div className={classes.flexColumn}>
            <ColorPalette colorService={props.colorService} />
            <ColorPicker />
        </div>
    );
}

export default ColorPanel;