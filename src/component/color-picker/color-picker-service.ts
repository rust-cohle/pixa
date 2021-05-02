import defaultColors from './default-colors.json';

export interface IColor {
    name: string;
    hexa: string;
}
export class Color {
    private readonly HEXA_REGEX = /^#?[0-9abcdef]{6}$/g;

    constructor(private _color: IColor) {}

    get color(): IColor {
        return this._color;
    }

    get name(): string {
        return this._color.name;
    }

    get hexa(): string {
        return this._color.hexa;
    }

    get rgb(): [number, number, number] | null {
        let hexa = this.hexa.toLowerCase();
        if (!this.HEXA_REGEX.test(hexa)) {
            return null;
        }

        // remove hashtag if any
        if(hexa[0] === '#') {
            hexa = hexa.substr(1);
        }

        const red = hexa.substr(0, 2);
        const green = hexa.substr(2, 2);
        const blue = hexa.substr(4, 2);

        // Parse each primary color into decimal (0 to 255)
        return [parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16)]
    }
}

const DEFAULT_PICKER_OPTIONS: ColorPickerServiceOptions = {
    colors: defaultColors
}

export interface ColorPickerServiceOptions {
    colors: IColor[]
}
export class ColorPickerService {
    private _colors: Color[] = [];

    constructor(options: ColorPickerServiceOptions = DEFAULT_PICKER_OPTIONS) {
        this._colors = options.colors.map((colorDescription) => new Color(colorDescription));
    }

    get colors(): Color[] {
        return this._colors;
    }
}