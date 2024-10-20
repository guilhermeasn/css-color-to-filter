"use client";

import Title from "@/components/Title";
import cssfilterdata, { ColorHex, CSSFilterData } from "@/core";
import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";

export default function Home() {

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
        <h3>Observações</h3>
        <div>
            <p>Original: { data.target.hex }</p>
            <p>CSS Filter: { data.result.hex }</p>
            <p>Perda: { data.loss }</p>
            <p>Filtro: { data.filter }</p>
        </div>
    </> : <>Loading...</>;

}
