import Color, { ColorData, ColorFilters, ColorHex, ColorHsl, ColorRgb } from "./color.class";
import CSSFilter, { CSSFilterData, CSSFilters } from "./cssfilter.class";

export type {
    ColorData,
    ColorFilters, ColorHex, ColorHsl, ColorRgb, CSSFilterData,
    CSSFilters
};

export default function cssfilterdata(color: ColorHex | ColorRgb): CSSFilterData {
    const cssfilter = new CSSFilter(new Color(color));
    return cssfilter.solve();
}

export {
    Color,
    CSSFilter,
    cssfilterdata
};

