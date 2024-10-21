import reduce from "object-as-array/reduce";
import Color, { ColorData } from "./color.class";

export type CSSFilterData = {
    target: ColorData,
    result: ColorData,
    loss: number,
    values: Filters,
    filter: string,
    css: string
}

export type CSSFilterInfo = {
    loss : number,
    values: number[]
}

export type Filters = {
    invert: number,
    sepia: number,
    saturate: number,
    hueRotate: number,
    brightness: number,
    contrast: number
}

export default class CSSFilter {

    private _target   : Color;
    private _result   : Color;
    private _filters ?: Filters;

    constructor(target : Color) {
        this._target = target;
        this._result = new Color('#000000');
    }

    private _solve(blackbase : boolean = true) : Filters {

        const result = this._solveNarrow(this._solveWide());

        const fmt = (value : number, multiplier = 1) => {
            return Math.round(value * multiplier);
        }

        const filter : string = [
            blackbase ? 'brightness(0) saturate(100%)' : '',
            `invert(${fmt(result.values[0])}%)`,
            `sepia(${fmt(result.values[1])}%)`,
            `saturate(${fmt(result.values[2])}%)`,
            `hue-rotate(${fmt(result.values[3], 3.6)}deg)`,
            `brightness(${fmt(result.values[4])}%)`,
            `contrast(${fmt(result.values[5])}%)`
        ].join(' ')

        return {
            target: this._target.output,
            result: this._result.output,
            loss: Math.round(result.loss),
            values: {
                invert: result.values[0] / 100 ,
                sepia: result.values[1] / 100 ,
                saturate: result.values[2] / 100 ,
                hueRotate: result.values[3] * 3.6 ,
                brightness: result.values[4] / 100 ,
                contrast: result.values[5] / 100 ,
            },
            filter,
            css: 'filter: ' + filter + ';',
        };
    }

    private _loss(filters : Filters) : number {
        
        this._result.reset();

        this._result.batch([
            [ 'invert', filters.invert / 100 ],
            [ 'sepia', filters.sepia / 100 ],
            [ 'saturate', filters.saturate / 100 ],
            [ 'hueRotate', filters.hueRotate * 3.6 ],
            [ 'brightness', filters.brightness / 100 ],
            [ 'contrast', filters.contrast / 100 ],
        ]);
    
        const result = this._result.output;
        const target = this._target.output;
    
        return (
            reduce(result.rgb, (t, _, k) => t + Math.abs(result.rgb[k] - target.rgb[k]), 0) +
            reduce(result.hsl, (t, _, k) => t + Math.abs(result.hsl[k] - target.hsl[k]), 0)
        );

    }

    private _spsa(A : number, a : number[], c : number, values : number[], iters : number) : CSSFilterInfo {
        
        const alpha : number = 1;
        const gamma : number = 0.16666666666666666;
    
        let best : number[] = [];
        let bestLoss : number = Infinity;

        const deltas : number[] = new Array(6);
        const highArgs : number[] = new Array(6);
        const lowArgs : number[] = new Array(6);

        const fix = (value : number, idx : number) => {

            let max = 100;

            if (idx === 2 /* saturate */) max = 7500;
            else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) max = 200;
      
            if (idx === 3 /* hue-rotate */) {
                if (value > max) value %= max;
                else if (value < 0) value = max + value % max;
            } else if (value < 0) value = 0;
            else if (value > max) value = max;
            
            return value;

        }
    
        for (let k = 0; k < iters; k++) {

            const ck = c / Math.pow(k + 1, gamma);

            for (let i = 0; i < 6; i++) {
                deltas[i] = Math.random() > 0.5 ? 1 : -1;
                highArgs[i] = values[i] + ck * deltas[i];
                lowArgs[i] = values[i] - ck * deltas[i];
            }
    
            const lossDiff = this._loss(highArgs) - this._loss(lowArgs);

            for (let i = 0; i < 6; i++) {
                const g = lossDiff / (2 * ck) * deltas[i];
                const ak = a[i] / Math.pow(A + k + 1, alpha);
                values[i] = fix(values[i] - ak * g, i);
            }
    
            const loss = this._loss(values);

            if (loss < bestLoss) {
                best = values.slice(0);
                bestLoss = loss;
            }

        }

        return { values: best, loss: bestLoss };
    
    }

    private _solveNarrow({ loss, values } : CSSFilterInfo) {
        const A1 = loss + 1;
        const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
        return this._spsa(loss, a, 2, values, 500);
    }

    private _solveWide() : CSSFilterInfo {

        const A = 5;
        const c = 15;
        const a = [60, 180, 18000, 600, 1.2, 1.2];
    
        let best : CSSFilterInfo = { loss: Infinity, values: [] };

        for (let i = 0; best.loss > 25 && i < 3; i++) {
            const initial = [50, 20, 3750, 50, 100, 100];
            const result = this._spsa(A, a, c, initial, 1000);
            if (result.loss < best.loss) {
                best = result;
            }
        }

        return best;
    }
    
}