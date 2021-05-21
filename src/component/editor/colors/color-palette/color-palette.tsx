import { makeStyles } from "@material-ui/core";
import { useState } from "react";
import { ColorService } from "../../color-service";

const useStyles = makeStyles(() => ({
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    colorsLine: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "start",
        flexWrap: "nowrap",
    },
    availableColor: {
        width: 15,
        height: 15,
        borderRadius: "50%",
        border: "1px solid #ddd"
    }
}));

interface ColorPaletteProps {
    colorService: ColorService
}
function ColorPalette(props: ColorPaletteProps): JSX.Element {
    const classes = useStyles();
    const colorService = props.colorService;

    const [state, setState] = useState({
        selectedColor: colorService.selectedColor
    });

    const colorElements = props.colorService.colors
        .filter(color => color.isValid)
        .reduce((acc, color, i) => {
            if (i % 7 === 0) {
                acc.push([]);
            }
            const last = acc[acc.length - 1];
            last.push(color);
            return acc;
        }, [])
        .map((colorsLine, i) => {
            return colorsLine.map((color, j) => {
                return (
                    <div key={`line-${i+1}-color-${j+1}`}
                        className={classes.availableColor}
                        style={{ backgroundColor: color.rgbCSS }}
                        title={color.name}
                        onClick={onColorSelected.bind(null, color)}
                    />
                )
            });
        })
        .map((colorsLineElements, i) => {
            return (
                <div key={`line-${i+1}`} className={classes.colorsLine}>
                    {colorsLineElements}
                </div>
            );
        })

    function onColorSelected(color) {
        colorService.selectedColor = color;
        setState({
            selectedColor: colorService.selectedColor
        });

    }

    return (
        <div id="color-palette" className={classes.flexColumn}>
            Palette
            <div className={classes.flexColumn}>
                {colorElements}
            </div>
        </div>
    );
}

export default ColorPalette;
