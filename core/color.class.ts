export type ColorHex = string;
export type ColorRgb = { r: number, g: number, b: number };
export type ColorData = { rgb: ColorRgb, hex: ColorHex };
export type ColorFilters = 'hueRotate' | 'grayscale' | 'sepia' | 'saturate' | 'brightness' | 'contrast' | 'invert'

export default class Color {

    static hexShortPattern : RegExp = /^#([a-f\d])([a-f\d])([a-f\d])$/i;
    static hexPattern : RegExp = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

    static hexExpand(hex : ColorHex) : ColorHex {
        return hex.replace(Color.hexShortPattern, '#$1$1$2$2$3$3').toUpperCase();
    }

    static hexToRgb(hex : ColorHex) : ColorRgb {
        const matches = Color.hexPattern.exec(Color.hexExpand(hex));
        if(!matches) throw new Error(`'${hex}' is invalid hex color.`);
        return {
            r: parseInt(matches[1], 16),
            g: parseInt(matches[2], 16),
            b: parseInt(matches[3], 16)
        }
    }

    static rgbFix(rgb : ColorRgb) : ColorRgb {
        const fix = (num : number) : number => {
            num = num < 0 ? 0 : num;
            num = num > 255 ? 255 : num;
            return Math.round(num);
        }
        return { r: fix(rgb.r), g: fix(rgb.g), b: fix(rgb.b) };
    }

    static rgbToHex(rgb : ColorRgb) : ColorHex {
        rgb = Color.rgbFix(rgb);
        const toHex = (num : number) : string => {
            const hex = num.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }
        return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
    }

    private readonly _input : Readonly<ColorRgb>;
    private _output : ColorRgb

    constructor(hexOrRgb: ColorHex | ColorRgb) {
        this._input = typeof hexOrRgb === 'string'
            ? Color.hexToRgb(hexOrRgb)
            : Color.rgbFix(hexOrRgb);
        this._output = this._input;
    }

    get input() : ColorData {
        return {
            rgb: this._input,
            hex: Color.rgbToHex(this._input)
        }
    }

    get output() : ColorData {
        return {
            rgb: this._output,
            hex: Color.rgbToHex(this._output)
        }
    }

    transform(filter : ColorFilters, adjust : number) : this {

        const multiply = (matrix : [ number, number, number, number, number, number, number, number, number ]) : void => {
            const r = this._output.r * matrix[0] + this._output.g * matrix[1] + this._output.b * matrix[2];
            const g = this._output.r * matrix[3] + this._output.g * matrix[4] + this._output.b * matrix[5];
            const b = this._output.r * matrix[6] + this._output.g * matrix[7] + this._output.b * matrix[8];
            this._output = Color.rgbFix({ r, g, b });
        }

        const linear = (slope : number, intercept : number = 0) : void => {
            const r = this._output.r * slope + intercept * 255;
            const g = this._output.g * slope + intercept * 255;
            const b = this._output.b * slope + intercept * 255;
            this._output = Color.rgbFix({ r, g, b });
        }
        
        const invert = (adjust : number) : void => {
            const r = (adjust + this._output.r / 255 * (1 - 2 * adjust)) * 255;
            const g = (adjust + this._output.g / 255 * (1 - 2 * adjust)) * 255;
            const b = (adjust + this._output.b / 255 * (1 - 2 * adjust)) * 255;
            this._output = Color.rgbFix({ r, g, b });
        }

        switch(filter) {

            case 'hueRotate':
                const angle = adjust / 180 * Math.PI;
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);
                multiply([
                    0.213 + cos * 0.787 - sin * 0.213,
                    0.715 - cos * 0.715 - sin * 0.715,
                    0.072 - cos * 0.072 + sin * 0.928,
                    0.213 - cos * 0.213 + sin * 0.143,
                    0.715 + cos * 0.285 + sin * 0.140,
                    0.072 - cos * 0.072 - sin * 0.283,
                    0.213 - cos * 0.213 - sin * 0.787,
                    0.715 - cos * 0.715 + sin * 0.715,
                    0.072 + cos * 0.928 + sin * 0.072
                ]);
                break;

            case 'grayscale':
                multiply([
                    0.2126 + 0.7874 * (1 - adjust),
                    0.7152 - 0.7152 * (1 - adjust),
                    0.0722 - 0.0722 * (1 - adjust),
                    0.2126 - 0.2126 * (1 - adjust),
                    0.7152 + 0.2848 * (1 - adjust),
                    0.0722 - 0.0722 * (1 - adjust),
                    0.2126 - 0.2126 * (1 - adjust),
                    0.7152 - 0.7152 * (1 - adjust),
                    0.0722 + 0.9278 * (1 - adjust),
                ]);
                break;

            case 'sepia':
                multiply([
                    0.393 + 0.607 * (1 - adjust),
                    0.769 - 0.769 * (1 - adjust),
                    0.189 - 0.189 * (1 - adjust),
                    0.349 - 0.349 * (1 - adjust),
                    0.686 + 0.314 * (1 - adjust),
                    0.168 - 0.168 * (1 - adjust),
                    0.272 - 0.272 * (1 - adjust),
                    0.534 - 0.534 * (1 - adjust),
                    0.131 + 0.869 * (1 - adjust),
                ]);
                break;

            case 'saturate':
                multiply([
                    0.213 + 0.787 * adjust,
                    0.715 - 0.715 * adjust,
                    0.072 - 0.072 * adjust,
                    0.213 - 0.213 * adjust,
                    0.715 + 0.285 * adjust,
                    0.072 - 0.072 * adjust,
                    0.213 - 0.213 * adjust,
                    0.715 - 0.715 * adjust,
                    0.072 + 0.928 * adjust,
                ]);
                break;

            case 'brightness':
                linear(adjust);
                break;

            case 'contrast':
                linear(adjust, -(0.5 * adjust) + 0.5)
                break;

            case 'invert':
                invert(adjust);
                break;

        }

        return this;

    }

}