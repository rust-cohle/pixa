import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({}));

interface ColorPickerProps {}
function ColorPicker(props: ColorPickerProps): JSX.Element {
    console.log(props);
    return <div>Picker</div>
}

export default ColorPicker;
