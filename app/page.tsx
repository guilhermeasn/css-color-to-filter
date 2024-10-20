"use client";

import Title from "@/components/Title";
import Color from "@/core/color.class";
import { useEffect } from "react";

// const css = new CSSFilter(color);

/**
 * brightness 0.0 a 30.0
 * contrast -15.0 a +15.0
 * grayscale -10.0 a +10.0
 * hueRotate 0 a +360
 * invert -10.0 a +10.0
 * saturate -30 a +30
 * sepia -10.0 a 10.0
 */

export default function Home() {

    useEffect(() => {
        console.clear();
        const color = new Color('#00a4d6');
        color.transform('sepia', 1).transform('brightness', .75);
        console.log(color.input, color.output);
    }, []);

    return <>
        <Title />
        {/* <div className="sample" style={{background: color.input.hex }} />
        <div className="sample" style={{background: color.output.hex }} /> */}
    </>;

}
