"use client";

import Footer from "@/components/Footer";
import FormColor from "@/components/FormColor";
import Header from "@/components/Header";
import Sample from "@/components/Sample";
import cssfilterdata, { ColorHex, CSSFilterData, cssFilterOpacity } from "@/core";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Home() {

    const [ opacity, setOpacity ] = useState<number>(50);
    const [ color, setColor ] = useState<ColorHex>('#00a4d6');
    const [ data, setData ] = useState<CSSFilterData>();

    useEffect(() => {
        const data = cssfilterdata(color);
        setData(data);
    }, [ color ]);

    return <>
    
        <Header />

        <main>

            <FormColor color={ color } setColor={ setColor } />

            <Container as='section' className="my-5">

                { data ? (

                    <Row>

                        <Col xl={ 4 }>
                            <Sample title="Oginal Color" sample={{ background: data.target.hex }}>
                                { data.target.hex }<br />
                                rgb({ data.target.rgb.r },{ data.target.rgb.g },{ data.target.rgb.b })<br />
                                hsl({ data.target.hsl.h }deg,{ data.target.hsl.s }%,{ data.target.hsl.l }%)
                            </Sample>
                        </Col>

                        <Col md={ 6 } xl={ 4 }>
                            <Sample title="CSS Filter" sample={{ filter: data.filter }}>
                                <div className={ data.loss < 10 ? 'text-success' : data.loss < 30 ? 'text-warning' : 'text-danger' }>
                                    <div className="fw-bold">
                                        <span className="px-2">Loss: { data.loss }</span>
                                        { data.loss < 10 ? <FaCheckCircle /> : <FaExclamationTriangle /> }
                                    </div>
                                </div>
                                { data.result.hex }<br />
                                rgb({ data.result.rgb.r },{ data.result.rgb.g },{ data.result.rgb.b })<br />
                                hsl({ data.result.hsl.h }deg,{ data.result.hsl.s }%,{ data.result.hsl.l }%)
                                <div className="text-start small my-2 border-top">{ data.css }</div>
                            </Sample>
                        </Col>

                        <Col md={ 6 } xl={ 4 }>
                            <Sample title="Add Opacity" sample={{ filter: cssFilterOpacity(data.filter, opacity) }}>
                                <div className="my-4">
                                    <p className="fw-bold">{ opacity }%</p>
                                    <input placeholder="Opacity Range" type="range" min={ 0 } max={ 100 } step={ 1 } value={ opacity } onChange={ input => setOpacity(parseInt(input.currentTarget.value)) } />
                                </div>
                                <div className="text-start small my-3 border-top">filter: { cssFilterOpacity(data.filter, opacity) }</div>
                            </Sample>
                        </Col>

                    </Row>

                ) : (

                    <div className="text-center font-monospace my-5 py-5">
                        Loading ...
                    </div>
                    
                ) }

            </Container>

        </main>

        <Footer />

    </>;

    // return data ? <>
    //     {/* <Title /> */}
    //     <FormControl type="color" value={ color } onChange={ input => setColor(input.currentTarget.value) } />
    //     <h3>Original</h3>
    //     <div className="sample" style={{background: color}} />
    //     <h3>CSS Filter</h3>
    //     <div className="sample" style={{filter: data.filter}} />
    //     <h3>Css Filter With Opacity</h3>
    //     <input placeholder="Opacity" type="range" min={ 0 } max={ 100 } step={ 1 } value={ opacity } onChange={ input => setOpacity(parseInt(input.currentTarget.value)) } />
    //     <div className="sample" style={{filter: cssFilterOpacity(data.filter, opacity)}} />
    //     <h3>Observações</h3>
    //     <div>
    //         <p>Original: { data.target.hex }</p>
    //         <p>CSS Filter: { data.result.hex }</p>
    //         <p>Perda: { data.loss }</p>
    //         <p>Filtro: { data.filter }</p>
    //         <p>Filtro Opacity: { cssFilterOpacity(data.filter, opacity) }</p>
    //     </div>
    // </> : <>Loading...</>;

}
