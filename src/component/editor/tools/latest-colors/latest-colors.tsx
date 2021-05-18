import makeStyles from "@material-ui/core/styles/makeStyles";
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import { useEffect, useState } from "react";
import { ColorService } from "../../color-service";

const useStyles = makeStyles((theme) => ({
    flexRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "start",
    },
    currentColor: {
        width: 50,
        height: 50,
        border: "1px solid black",
        marginLeft: 2,
        marginRight: 2,
    },
    previousColorContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    previousColor: {
        width: 25,
        height: 25,
        border: "1px solid black",
        marginLeft: 2,
        marginRight: 2,
    },
}));

interface LatestColorsProp {
    colorService: ColorService
}
const LatestColors = (props: LatestColorsProp) => {
    const classes = useStyles();
    const colorService = props.colorService;

    const [state, setState] = useState({
        selectedColor: colorService.selectedColor,
        previousColor: colorService.previousColor,
    });

    useEffect(() => {
        colorService.selectedColor$()
            .subscribe(() => {
                setState({
                    selectedColor: colorService.selectedColor,
                    previousColor: colorService.previousColor,
                });
            });
    }, []);

    function getCurrentColorStyle(state) {
        return {
            backgroundColor: state.selectedColor.hexa
        }
    }

    function getPreviousColorStyle(state) {
        return {
            backgroundColor: state.previousColor?.hexa ?? state.selectedColor.hexa
        }
    }

    function onSwapColors() {
        if(!state.previousColor) {
            return;
        }

        colorService.swapColors();
    }

    return (
        <div>
            <div>Latest Colors</div>
            <div id="latest-colors-container" className={classes.flexRow}>
                <div className={classes.currentColor} id="selected-color" style={getCurrentColorStyle(state)} />
                <div className={classes.previousColorContainer}>
                    <SwapHoriz titleAccess="Swap current & previous colors" onClick={onSwapColors} />
                    <div className={classes.previousColor} id="previous-color" style={getPreviousColorStyle(state)} />
                </div>

            </div>
        </div>
    );
}

export default LatestColors;
