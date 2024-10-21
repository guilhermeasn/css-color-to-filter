import Color, { ColorData, ColorFilters, ColorHex, ColorHsl, ColorRgb } from './color.class';
import ColorToFilter, { CtfInfo, CtfLoss, CtfValues } from './colortofilter.class';

export type { ColorData, ColorFilters, ColorHex, ColorHsl, ColorRgb, CtfInfo, CtfLoss, CtfValues };

export function color(input : ColorHex | ColorRgb) : Color {
    return new Color(input);
}

export function colorToFilter(target : ColorHex | ColorRgb) : ColorToFilter {
    return new ColorToFilter(target);
}

export { Color, ColorToFilter };
