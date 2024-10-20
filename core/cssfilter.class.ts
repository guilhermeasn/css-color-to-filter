import Color, { ColorHex, ColorRgb } from "./color.class";

export default class CSSFilter {

    private readonly _target : Readonly<ColorRgb>;
    private _blackBase : boolean;

    private _loss :number = Infinity;

    private _result : string | null = null;

    constructor(hexOrRgb: ColorHex | ColorRgb, blackBase: boolean = true) {
        this._target = typeof hexOrRgb === 'string'
            ? Color.hexToRgb(hexOrRgb)
            : Color.rgbFix(hexOrRgb);
        this._blackBase = blackBase;
    }

    loss(color : ColorRgb) : number {

        let loss : number = 0;

        if(this._target.r > color.r) loss += this._target.r - color.r
        if(this._target.r < color.r) loss += color.r - this._target.r;
        if(this._target.g > color.g) loss += this._target.g - color.g
        if(this._target.g < color.g) loss += color.g - this._target.g;
        if(this._target.b > color.b) loss += this._target.b - color.b
        if(this._target.b < color.b) loss += color.b - this._target.b;

        return loss;

    }

    async run() : Promise<string> {
        return new Promise((resolve, reject) => {

            let selected : Color | undefined;
            let text = 'filter: ';
            if(this._blackBase) text += 'brightness(0) saturate(100%) ';

            for(let brightness = 0; brightness <= 300; brightness++) {
                for(let contrast = -150; contrast <= 150; contrast++) {
                    for(let grayscale = -100; grayscale <= 100; grayscale++) {
                        for(let hueRotate = 0; hueRotate <=360; hueRotate++) {
                            for(let invert = -100; invert <= 100; invert++) {
                                for(let saturate = -30; saturate <= 30; saturate++) {
                                    for(let sepia = -100; sepia <= 100; sepia++) {

                                        const color = new Color('#000');

                                        color
                                            .transform('brightness', brightness / 10)
                                            .transform('contrast', contrast / 10)
                                            .transform('grayscale', grayscale / 10)
                                            .transform('hueRotate', hueRotate)
                                            .transform('invert', invert / 10)
                                            .transform('saturate', saturate)
                                            .transform('sepia', sepia / 10);

                                        const loss = this.loss(color.output.rgb);

                                        if(this.loss(color.output.rgb) < this._loss) {
                                            selected = color;
                                            this._loss = loss;
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            if(!selected) {
                reject('Color not found');
                return;
            }

            text = selected?.output.hex

            this._result = text;
            resolve(text);

        });
    }

    opacity(adjust : number) : string {

        if(!this._result) throw new Error('The filter has not been created yet, use the run method before trying to change the opacity.')

        // ...

        return this._result;

    }

}