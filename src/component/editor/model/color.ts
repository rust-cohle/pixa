export interface IColor {
    name?: string;
    sequenceId?: string;
    hexa?: string;
    rgb?: number[];
}
export class Color {
    private readonly HEXA_REGEX = /^#?[0-9abcdef]{6}$/;

    constructor(private _color: IColor) { }

    get color(): IColor {
        return this._color;
    }

    get name(): string {
        return this._color.name;
    }

    get hexa(): string {
        if (this.isValidHexa) {
            return this._color.hexa;
        }

        if (this.isValidRgb) {
            return this.computeHexa(this._color.rgb);
        }

        return null;
    }

    get rgb(): number[] {
        if (this.isValidRgb) {
            return this._color.rgb;
        }

        if (this.isValidHexa) {
            return this.computeRgb(this._color.hexa);
        }

        return null;
    }

    get rgbCSS(): string {
        const rgb = this.rgb;
        if (!rgb) {
            return null;
        }

        const [r, g, b] = rgb;
        return `rgb(${r}, ${g}, ${b})`;
    }

    get isValid(): boolean {
        return this.isValidHexa || this.isValidRgb;
    }

    get isValidHexa(): boolean {
        const hexa = (this._color.hexa || '').toLowerCase();
        return !!hexa && this.HEXA_REGEX.test(hexa);
    }

    get isValidRgb(): boolean {
        return this._color.rgb instanceof Array &&
            this._color.rgb.length === 3 &&
            this._color.rgb.every(coord => typeof coord === 'number' && coord >= 0 && coord < 256);
    }

    private computeRgb(hexa: string): number[] {
        // remove hashtag if any
        if (hexa[0] === '#') {
            hexa = hexa.substr(1);
        }

        const red = hexa.substr(0, 2);
        const green = hexa.substr(2, 2);
        const blue = hexa.substr(4, 2);

        // Parse each primary color into decimal (0 to 255)
        return [parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16)]
    }

    private computeHexa(rgb: number[]): string {
        let r = this.rgbCoordToHexa(rgb[0]);
        let g = this.rgbCoordToHexa(rgb[1]);
        let b = this.rgbCoordToHexa(rgb[2]);
        return `#${r}${g}${b}`
    }

    private rgbCoordToHexa(coord: number): string {
        const hexa: string = Number(coord).toString(16);
        if (hexa.length === 1) {
            return '0' + hexa;
        }

        return hexa;
    }
}