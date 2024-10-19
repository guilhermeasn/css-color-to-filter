"use client";

import Title from "@/components/Title";
import Color from "@/core/color.class";

const color = new Color('#3ad');
color.transform('hueRotate', 180).transform('contrast', .5);

// const css = new CSSFilter(color);

export default function Home() {

    return <>
        <Title />
        <div className="sample" style={{background: color.input.hex }} />
        <div className="sample" style={{background: color.output.hex }} />
    </>;

}
