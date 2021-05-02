import { makeStyles } from "@material-ui/core";
import { red } from "bn.js";
import { ColorPickerService } from "./color-picker-service";

const useStyles = makeStyles((theme) => ({
    availableColors: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        flexWrap: "wrap",
    },
    availableColor: {
        width: 15,
        height: 15,
        borderRadius: "50%",
        border: "1px solid #ddd"
    }
}));

interface ColorPickerProps {
    colorPicker: ColorPickerService
}
function ColorPicker(props: ColorPickerProps): JSX.Element {
    const classes = useStyles();

    const colorElements = props.colorPicker.colors.map((color, index) => {
        return (
            <div key={index} className={classes.availableColor} style={{backgroundColor: color.hexa}}>

            </div>
        )
    });

    return (
        <div className="color-picker">
            <div className={classes.availableColors}>
                {colorElements}
            </div>
        </div>
    );
}

export default ColorPicker;
