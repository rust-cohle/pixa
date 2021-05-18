import makeStyles from "@material-ui/core/styles/makeStyles";
import Brush from '@material-ui/icons/Brush';
import BorderColor from '@material-ui/icons/BorderColor';
import FormatColorFill from '@material-ui/icons/FormatColorFill';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import ClearAll from '@material-ui/icons/ClearAll';

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

const Toolbar = () => {
    const classes = useStyles();
    return (
        <div>
            <div>Toolbar</div>
            <div className={classes.toolbar}>
                <div className={classes.drawingTools}>
                    <Brush className={classes.toolIcon} titleAccess="Brush" />
                    <BorderColor className={classes.toolIcon} titleAccess="Pen" />
                    <FormatColorFill className={classes.toolIcon} titleAccess="Fill" />
                </div>
                <div className={classes.actionTools}>
                    <Undo className={classes.toolIcon} titleAccess="Undo" />
                    <Redo className={classes.toolIcon} titleAccess="Redo" />
                    <ClearAll className={classes.toolIcon} titleAccess="Clear all" />
                </div>                
            </div>
        </div>
    );
}

export default Toolbar;
