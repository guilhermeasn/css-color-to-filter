"use client";

import Title from "@/components/Title";
import Color from "@/core/color.class";
import CSSFilter, { CSSFilterData } from "@/core/cssfilter.class";
import { useEffect, useState } from "react";

export default function Home() {

    const color = '#00a4d6';
    const [ data, setData ] = useState<CSSFilterData>();

    useEffect(() => {
        const cssfilter = new CSSFilter(new Color(color));
        const data = cssfilter.solve();
        console.dir(data);
        setData(data);
    }, []);

    return data ? <>
        <Title />
        <h3>Original</h3>
        <div className="sample" style={{background: color}} />
        <h3>CSS Filter</h3>
        <div className="sample" style={{filter: data.filter}} />
        <h3>Observações</h3>
        <div>
            <p>Original: { data.target.hex }</p>
            <p>CSS Filter: { data.result.hex }</p>
            <p>Perda: { data.loss }</p>
            <p>Filtro: { data.filter }</p>
        </div>
    </> : <>Loading...</>;

}
