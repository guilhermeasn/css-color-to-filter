import Color, { ColorData, ColorFilters, ColorHex, ColorHsl, ColorRgb } from "./color.class";
import CSSFilter, { CSSFilterData, CSSFilters } from "./cssfilter.class";

export type {
    ColorData,
    ColorFilters, ColorHex, ColorHsl, ColorRgb, CSSFilterData,
    CSSFilters
};

export default function cssFilterData(color: ColorHex | ColorRgb): CSSFilterData {
    const cssfilter = new CSSFilter(new Color(color));
    return cssfilter.solve();
}

export function cssFilterOpacity(text: string, opacity : number) : string {
    const end : boolean = /;\s*$/.test(text);
    if(end) text = text.replace(/;\s*$/, '');
    text = text.replace(/\s?opacity\(.+?\)/, '');
    return `${text} opacity(${opacity}%)${end ? ';' : ''}`;
}

export {
    Color,
    CSSFilter,
    cssFilterData
};

