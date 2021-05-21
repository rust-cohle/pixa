import { Color, IColor } from './model';
// import defaultColors from './data/default-colors.json';
import defaultColors2 from './data/default-colors2.json';
import { BehaviorSubject, Observable } from 'rxjs';

const DEFAULT_PICKER_OPTIONS: ColorServiceOptions = {
    colors: defaultColors2
}

export interface ColorServiceOptions {
    colors: IColor[]
}
export class ColorService {
    private _colors: Color[] = [];

    private _colorsHistory: Color[] = [];

    private _selectedColor: Color;

    private _selectedColor$: BehaviorSubject<Color>;

    constructor(options: ColorServiceOptions = DEFAULT_PICKER_OPTIONS) {
        this._colors = options.colors.map((colorDescription) => new Color(colorDescription));
        const defaultColor = this._colors[0];

        this._selectedColor$ = new BehaviorSubject<Color>(defaultColor);
        this.selectedColor = defaultColor;
    }

    get colors(): Color[] {
        return this._colors;
    }

    get selectedColor(): Color {
        return this._selectedColor;
    }

    get previousColor(): Color {
        return this._colorsHistory[1];
    }

    set previousColor(color: Color) {
        this._colorsHistory[1] = color;
    }

    set selectedColor(color: Color) {
        this._selectedColor = color;
        this._colorsHistory.unshift(color);
        this._selectedColor$.next(color);
    }

    selectedColor$(): Observable<Color> {
        return this._selectedColor$.asObservable();
    }

    swapColors(): void {
        const previousColorBackup = this.previousColor;
        this.previousColor = this.selectedColor;
        this.selectedColor = previousColorBackup;
    }
}
