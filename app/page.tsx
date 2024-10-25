"use client";

import Footer from "@/components/Footer";
import FormColor from "@/components/FormColor";
import Header from "@/components/Header";
import { SampleAddOpacity, SampleCSSFilter, SampleOriginal } from "@/components/Sample";
import { Color, ColorHex, colorToFilter, ColorToFilter } from "@/core";
import { applyMask, getPresetMask } from "mask-hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

export default function Home() {

    let colorParam : ColorHex | null = useSearchParams().get('color');

    const initialColor : ColorHex = useMemo(() => {
        if(colorParam) {
            colorParam = applyMask(colorParam, getPresetMask('COLOR_HEX'));
            colorParam = Color.hexExpand(colorParam ?? '');
            if(Color.hexPattern.test(colorParam)) return colorParam;
        }
        return Color.rgbToHex(Color.rgbRandom());
    }, [ colorParam ]);

    const [ preserve, setPreserve ] = useState<boolean>(false);
    const [ opacity, setOpacity ] = useState<number>(50);
    const [ color, setColor ] = useState<ColorHex>(initialColor);
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
                            <SampleOriginal target={ ctf.target } />
                        </Col>

                        <Col md={ 6 } xl={ 4 }>
                            <SampleCSSFilter
                                filter={ ctf.filter() }
                                filterComplete={ ctf.filter(true) }
                                loss={ ctf.loss }
                                result={ ctf.result }
                                onRetry={ () => { setCtf(colorToFilter(color)) } }
                            />
                        </Col>

                        <Col md={ 6 } xl={ 4 }>
                            <SampleAddOpacity
                                opacity={ opacity }
                                onChangeOpacity={ setOpacity }
                                preserve={ preserve }
                                onChangePreserve={ () => setPreserve(!preserve) }
                                filter={ ctf.filter(false, preserve, opacity) }
                                filterComplete={ ctf.filter(true, preserve, opacity) }
                            />
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
