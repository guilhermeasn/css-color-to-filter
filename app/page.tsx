"use client";

import Title from "@/components/Title";
import cssfilterdata, { ColorHex, CSSFilterData, cssFilterOpacity } from "@/core";
import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";

export default function Home() {

    const [ opacity, setOpacity ] = useState<number>(50);
    const [ color, setColor ] = useState<ColorHex>('#00a4d6');
    const [ data, setData ] = useState<CSSFilterData>();

    useEffect(() => {
        const data = cssfilterdata(color);
        console.dir(data);
        setData(data);
    }, [ color ]);

    return data ? <>
        <Title />
        <FormControl type="color" value={ color } onChange={ input => setColor(input.currentTarget.value) } />
        <h3>Original</h3>
        <div className="sample" style={{background: color}} />
        <h3>CSS Filter</h3>
        <div className="sample" style={{filter: data.filter}} />
        <h3>Css Filter With Opacity</h3>
        <input placeholder="Opacity" type="range" min={ 0 } max={ 100 } step={ 1 } value={ opacity } onChange={ input => setOpacity(parseInt(input.currentTarget.value)) } />
        <div className="sample" style={{filter: cssFilterOpacity(data.filter, opacity)}} />
        <h3>Observações</h3>
        <div>
            <p>Original: { data.target.hex }</p>
            <p>CSS Filter: { data.result.hex }</p>
            <p>Perda: { data.loss }</p>
            <p>Filtro: { data.filter }</p>
            <p>Filtro Opacity: { cssFilterOpacity(data.filter, opacity) }</p>
        </div>
    </> : <>Loading...</>;

}
