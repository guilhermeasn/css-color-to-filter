import reduce from "object-as-array/reduce";
import Color, { ColorData, ColorHex, ColorRgb } from "./color.class";

export type CtfLoss = number;

export type CtfValues = {
    invert: number, sepia: number, saturate: number,
    hueRotate: number, brightness: number, contrast: number
}

export type CtfInfo = {
    loss: CtfLoss,
    values: CtfValues
}

export default class ColorToFilter {

    static readonly keys : Array<keyof CtfValues> = [
        'invert', 'sepia', 'saturate',
        'hueRotate', 'brightness', 'contrast'
    ];

    static fix(filter: keyof CtfValues, value : number) : number {
        
        let max : number;

        switch(filter) {
            case 'saturate': max = 7500; break;
            case 'brightness': case 'contrast': max = 200; break;
            default: max = 100;
        }

        return value > max ? max : value < 0 ? 0 : value;

    }

    private _target: Color;
    private _result: Color;
    private _infos: CtfInfo;

    constructor(target : ColorHex | ColorRgb) {
        this._target = new Color(target);
        this._result = new Color('#000000');
        this._infos = this._calculate();
    }

    get target() : ColorData {
        return this._target.output;
    }

    get result() : ColorData {
        return this._result.output;
    }

    get loss() : number {
        return this._infos.loss;
    }

    get values() : CtfValues {
        return this._infos.values;
    }

    recalculate() : this {
        this._infos = this._calculate();
        return this;
    }

    CSS(complete : boolean = true, preserveOrigin : boolean = false, opacity : number = NaN) : string {
        opacity = opacity > 100 ? 100 : opacity < 0 ? 0 : opacity;
        return [
            complete ? 'filter:' : '',
            preserveOrigin ? 'brightness(0) saturate(100%)' : '',
            `invert(${ Math.round(this.values.invert) }%)`,
            `sepia(${ Math.round(this.values.invert) }%)`,
            `saturate(${ Math.round(this.values.invert) }%)`,
            `hue-rotate(${ Math.round(this.values.invert) }deg)`,
            `brightness(${ Math.round(this.values.invert) }%)`,
            `contrast(${ Math.round(this.values.invert) }%)`,
            isNaN(opacity) ? '' : `opacity(${ Math.round(opacity) }%)`,
            complete ? ';' : ''
        ].join(' ').replace(/\s{1,}/, ' ').trim();
    }

    private _calculate() : CtfInfo {
        
        let best : CtfInfo = {
            loss: Infinity, values: {
                invert: NaN, sepia: NaN, saturate: NaN,
                hueRotate: NaN, brightness: NaN, contrast: NaN
            }
        }
        
        const initialValues : CtfValues = {
            invert: 50, sepia: 20, saturate: 3750,
            hueRotate: 50, brightness: 100, contrast: 100
        }

        const rateValues : CtfValues = {
            invert: 60, sepia: 180, saturate: 18000,
            hueRotate: 600, brightness: 1.2, contrast: 1.2
        }

        for (let i = 0; best.loss > 25 && i < 5; i++) {
            const result = this._spsa(initialValues, rateValues, 5, 15, 1000);
            if (result.loss < best.loss) best = result;
        }

        const adjust : number = best.loss + 1;

        const tuning : CtfValues = {
            invert: 0.25 * adjust, sepia: 0.25 * adjust, saturate: adjust,
            hueRotate: 0.25 * adjust, brightness: 0.2 * adjust, contrast: 0.2 * adjust
        }

        best = this._spsa(best.values, tuning, best.loss, 2, 500);
        best.values.hueRotate *= 3.6;

        return best;

    }

    /**
     * SPSA (Simultaneous Perturbation Stochastic Approximation)
     * @param values initial values
     * @param rate individual learning rates
     * @param A learning factor
     * @param C magnitude of stochastic perturbations
     * @param I number of iterations
     */
    private _spsa(values: CtfValues, rate: CtfValues, A : number, C : number, I : number) : CtfInfo {
        
        const alpha : number = 1;
        const gamma : number = 0.16666666666666666;

        let best : CtfInfo = {
            loss: Infinity, values: {
                invert: NaN, sepia: NaN, saturate: NaN,
                hueRotate: NaN, brightness: NaN, contrast: NaN
            }
        }

        const deltas   : CtfValues = { ...best.values };
        const highArgs : CtfValues = { ...best.values };
        const lowArgs  : CtfValues = { ...best.values };
        
        for (let k = 0; k < I; k++) {

            const ck = C / Math.pow(k + 1, gamma);

            for(const key of ColorToFilter.keys) {
                deltas[key]   = Math.random() > 0.5 ? 1 : -1;
                highArgs[key] = values[key] + ck * deltas[key];
                lowArgs[key]  = values[key] - ck * deltas[key];
            }

            const lossDiff : number = this._loss(highArgs) - this._loss(lowArgs);

            for(const key of ColorToFilter.keys) {
                const g = lossDiff / (2 * ck) * deltas[key];
                const ak = rate[key] / Math.pow(A + k + 1, alpha);
                values[key] = ColorToFilter.fix(key, values[key] - ak * g);
            }

            const loss = this._loss(values);
            if(loss < best.loss) best = { loss, values: { ...values } };

        }

        return best;

    }

    private _loss(values : CtfValues) : number {
        
        this._result.reset();

        this._result.batch([
            [ 'invert', values.invert / 100 ],
            [ 'sepia', values.sepia / 100 ],
            [ 'saturate', values.saturate / 100 ],
            [ 'hueRotate', values.hueRotate * 3.6 ],
            [ 'brightness', values.brightness / 100 ],
            [ 'contrast', values.contrast / 100 ],
        ]);
    
        const result = this._result.output;
        const target = this._target.output;
    
        return (
            reduce(result.rgb, (t, _, k) => t + Math.abs(result.rgb[k] - target.rgb[k]), 0) +
            reduce(result.hsl, (t, _, k) => t + Math.abs(result.hsl[k] - target.hsl[k]), 0)
        );

    }
    
}