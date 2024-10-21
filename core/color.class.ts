import keysMap from "object-as-array/keysMap";
import toArray from "object-as-array/toArray";

export type ColorHex = string;
export type ColorRgb = { r: number, g: number, b: number };
export type ColorHsl = { h: number, s: number, l: number };
export type ColorData = { rgb: ColorRgb, hex: ColorHex, hsl: ColorHsl };
export type ColorFilters = 'hueRotate' | 'grayscale' | 'sepia' | 'saturate' | 'brightness' | 'contrast' | 'invert';

/**
 * Class Color
 * @see https://stackoverflow.com/questions/42966641/how-to-transform-black-into-any-given-color-using-only-css-filters/43960991#43960991
 * @see https://www.w3.org/TR/filter-effects/#FilterPrimitivesOverview
 * @author Guilherme Neves
 */
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
        return keysMap(rgb, v => fix(v));
    }

    static rgbToHex(rgb : ColorRgb) : ColorHex {
        rgb = Color.rgbFix(rgb);
        const toHex = (num : number) : string => {
            const hex = num.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }
        return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
    }

    static rgbToHsl(rgb : ColorRgb, round : boolean = false, hueAngle : boolean = false) : ColorHsl {
        const avail : ColorRgb = keysMap(rgb, v => v / 255);
        const max : number = Math.max(...toArray(avail, 'value'));
        const min : number = Math.min(...toArray(avail, 'value'));
        const hsl : ColorHsl = { h: 0, s: 0, l: (max + min) / 2 };
        if(max !== min) {
            const d = max - min;
            hsl.s = hsl.l > 0.5 ? d / (2 - max - min) : d / (max + min);
            hsl.h = (max === avail.r) ? (avail.g - avail.b) / d + (avail.g < avail.b ? 6 : 0) :
                    (max === avail.g) ? (avail.b - avail.r) / d + 2 :
                    (max === avail.b) ? (avail.r - avail.g) / d + 4 : hsl.h;
            hsl.h /= 6;
        }
        if(hueAngle) hsl.h = (hsl.h * 360) / 100;
        return keysMap(hsl, v => round ? Math.round(v * 100) : v * 100);
    }

    private readonly _input : Readonly<ColorRgb>;
    private _output : ColorRgb

    constructor(hexOrRgb: ColorHex | ColorRgb) {
        this._output = this._input = typeof hexOrRgb === 'string'
            ? Color.hexToRgb(hexOrRgb)
            : Color.rgbFix(hexOrRgb);
    }

    get input() : ColorData {
        return {
            rgb: this._input,
            hex: Color.rgbToHex(this._input),
            hsl: Color.rgbToHsl(this._input, true, true)
        }
    }

    get output() : ColorData {
        return {
            rgb: this._output,
            hex: Color.rgbToHex(this._output),
            hsl: Color.rgbToHsl(this._output, true, true)
        }
    }

    transform(filter : ColorFilters, adjust : number) : this {

        switch(filter) {

            case 'hueRotate':
                const angle = adjust / 180 * Math.PI;
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);
                this._multiply([
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
                this._multiply([
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
                this._multiply([
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
                this._multiply([
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
                this._linear(adjust);
                break;

            case 'contrast':
                this._linear(adjust, -(0.5 * adjust) + 0.5)
                break;

            case 'invert':
                this._invert(adjust);
                break;

        }

        return this;

    }

    batch(transforms : Array<[ ColorFilters, number ]>) : this {
        transforms.forEach(([ filter, adjust ]) => this.transform(filter, adjust));
        return this;
    }

    reset() : void {
        this._output = this._input;
    }

    private _multiply(matrix : [ number, number, number, number, number, number, number, number, number ]) : void {
        const r = this._output.r * matrix[0] + this._output.g * matrix[1] + this._output.b * matrix[2];
        const g = this._output.r * matrix[3] + this._output.g * matrix[4] + this._output.b * matrix[5];
        const b = this._output.r * matrix[6] + this._output.g * matrix[7] + this._output.b * matrix[8];
        this._output = Color.rgbFix({ r, g, b });
    }

    private _linear (slope : number, intercept : number = 0) : void {
        const r = this._output.r * slope + intercept * 255;
        const g = this._output.g * slope + intercept * 255;
        const b = this._output.b * slope + intercept * 255;
        this._output = Color.rgbFix({ r, g, b });
    }
    
    private _invert (adjust : number) : void {
        const r = (adjust + this._output.r / 255 * (1 - 2 * adjust)) * 255;
        const g = (adjust + this._output.g / 255 * (1 - 2 * adjust)) * 255;
        const b = (adjust + this._output.b / 255 * (1 - 2 * adjust)) * 255;
        this._output = Color.rgbFix({ r, g, b });
    }

}