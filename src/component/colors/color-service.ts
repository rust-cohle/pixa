import { Color, IColor } from './model';
import defaultColors from './data/default-colors.json';
import defaultColors2 from './data/default-colors2.json';

const DEFAULT_PICKER_OPTIONS: ColorServiceOptions = {
    colors: defaultColors2
}

export interface ColorServiceOptions {
    colors: IColor[]
}
export class ColorService {
    private _colors: Color[] = [];

    constructor(options: ColorServiceOptions = DEFAULT_PICKER_OPTIONS) {
        this._colors = options.colors.map((colorDescription) => new Color(colorDescription));
    }

    get colors(): Color[] {
        return this._colors;
    }
}
