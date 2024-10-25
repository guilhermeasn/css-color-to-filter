import { ColorHex } from "@/core";
import { applyMask, getPresetMask } from "mask-hooks";
import Home from "../page";

export type ColorParamProps = {
    params : {
        color: ColorHex
    }
}

export default function ColorParam({ params: { color } } : ColorParamProps) {
    return (
        <Home colorParam={ applyMask(color, getPresetMask('COLOR_HEX')) } />
    )
}
