"use client";

import Title from "@/components/Title";
import CSSFilter from "@/core/cssfilter.class";
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
        const f = new CSSFilter('#135790');
        f.run().finally(console.log);
    }, []);

    return <>
        <Title />
        {/* <div className="sample" style={{background: color.input.hex }} />
        <div className="sample" style={{background: color.output.hex }} /> */}
    </>;

}
