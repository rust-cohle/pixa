import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import './App.css';

import Editor from './component/editor/editor';
import DrawingCanvas, { CanvasConfig } from './component/drawing-canvas/drawing-canvas';
import { ColorService } from './component/editor/color-service';
import { DrawingService } from './component/drawing-canvas/drawing-service';

const defaultCanvasConfig: CanvasConfig = {
  squareSize: 10,
  stageSize: {
    width: 300,
    height: 300,
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 800,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  }
}));

function App() {
  const classes = useStyles();

  const colorService = new ColorService();
  const drawingService = new DrawingService();

  return (
    <div className="App">
     <div className="pixa-container">
        <Grid container className="full-height">
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Editor colorService={colorService} drawingService={drawingService} />
                </Paper>
              </Grid>
              <Grid item xs={8}>
                <Paper className={classes.paper}>
                  <DrawingCanvas
                    canvasConfig={defaultCanvasConfig}
                    colorService={colorService}
                    drawingService={drawingService}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
     </div>
    </div>
  );
}

export default App;
