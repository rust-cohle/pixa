import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import './App.css';

import ColorPicker from './component/color-picker/color-picker.tsx';
import DrawingCanvas from './component/drawing-canvas/drawing-canvas.tsx';

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
}));

function App() {
  const classes = useStyles();

  return (
    <div className="App">
     <div class="pixa-container">
        <Grid container className="full-height">
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <ColorPicker />
                </Paper>
              </Grid>
              <Grid item xs={8}>
                <Paper className={classes.paper}>
                  <DrawingCanvas />
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
