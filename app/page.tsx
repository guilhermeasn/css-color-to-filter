"use client";

import ButtonCopy from "@/components/ButtonCopy";
import Footer from "@/components/Footer";
import FormColor from "@/components/FormColor";
import Header from "@/components/Header";
import Sample from "@/components/Sample";
import { ColorHex, colorToFilter, ColorToFilter } from "@/core";
import { useEffect, useState } from "react";
import { Col, Container, FormCheck, Row } from "react-bootstrap";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Home() {

    const [ preserve, setPreserve ] = useState<boolean>(false);
    const [ opacity, setOpacity ] = useState<number>(50);
    const [ color, setColor ] = useState<ColorHex>('#00a4d6');
    const [ ctf, setCtf ] = useState<ColorToFilter>();

    useEffect(() => setCtf(colorToFilter(color)), [ color ]);

    return <>
    
        <Header />

        <main>

            <FormColor color={ color } onPickColor={ setColor } onRetry={ () => { setCtf(colorToFilter(color)) } } />

            <Container as='section' className="my-5">

                { ctf ? (

                    <Row>

                        <Col xl={ 4 }>
                            <Sample title="Oginal Color" sample={{ background: ctf.target.hex }}>
                                { ctf.target.hex }<br />
                                rgb({ ctf.target.rgb.r },{ ctf.target.rgb.g },{ ctf.target.rgb.b })<br />
                                hsl({ ctf.target.hsl.h }deg,{ ctf.target.hsl.s }%,{ ctf.target.hsl.l }%)
                            </Sample>
                        </Col>

                        <Col md={ 6 } xl={ 4 }>
                            <Sample title="CSS Filter" sample={{ filter: ctf.filter() }}>
                                <div className={ ctf.loss < 10 ? 'text-success' : ctf.loss < 30 ? 'text-warning' : 'text-danger' }>
                                    <div className="fw-bold">
                                        <span className="px-2">Loss: { ctf.loss }</span>
                                        { ctf.loss < 10 ? <FaCheckCircle /> : <FaExclamationTriangle /> }
                                    </div>
                                </div>
                                { ctf.result.hex }<br />
                                rgb({ ctf.result.rgb.r },{ ctf.result.rgb.g },{ ctf.result.rgb.b })<br />
                                hsl({ ctf.result.hsl.h }deg,{ ctf.result.hsl.s }%,{ ctf.result.hsl.l }%)
                                <div className="d-flex my-2 border-top">
                                    <div className="text-start small">{ ctf.filter(true) }</div>
                                    <div className="text-end align-self-end">
                                        <ButtonCopy text={ ctf.filter(true) } />
                                    </div>
                                </div>
                            </Sample>
                        </Col>

                        <Col md={ 6 } xl={ 4 }>
                            <Sample title="Add Opacity" sample={{ filter: ctf.filter(false, preserve, opacity) }} figure>
                                <div className="my-4">
                                    <p className="fw-bold">{ opacity }%</p>
                                    <input placeholder="Opacity Range" type="range" min={ 0 } max={ 100 } step={ 1 } value={ opacity } onChange={ input => setOpacity(parseInt(input.currentTarget.value)) } />
                                    <div className="d-flex justify-content-center">
                                        <label>Preserve Origin</label>
                                        <FormCheck className="ms-2" type="switch" checked={ preserve } onChange={ () => setPreserve(!preserve) } />
                                    </div>
                                </div>
                                <div className="d-flex my-2 border-top">
                                    <div className="text-start small">{ ctf.filter(true, preserve, opacity) }</div>
                                    <div className="text-end align-self-end">
                                        <ButtonCopy text={ ctf.filter(true, preserve, opacity) } />
                                    </div>
                                </div>
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

}
