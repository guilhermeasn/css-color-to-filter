import { Color, ColorHex } from "@/core";
import { CompleteMask, getPresetMask, useCompleteMask } from "mask-hooks";
import { useEffect, useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { FaShareAlt, FaSync } from "react-icons/fa";
import ButtonCopy from "./ButtonCopy";

export type FormColorProps = {
    color ?: ColorHex;
    retryDisabled ?: boolean;
    onPickColor : (color : ColorHex) => void;
    onRetry : () => void;
}

export default function FormColor({ color, retryDisabled = false, onPickColor, onRetry } : FormColorProps) {

    const mask = useCompleteMask(getPresetMask('COLOR_HEX'));

    const [ timeoutNum, setTimeoutNum ] = useState<NodeJS.Timeout>();
    const [ maskColor, setMaskColor ] = useState<CompleteMask>(mask(color ?? ''));

    const setPickColor = (value : string) : void => {
        clearTimeout(timeoutNum);
        setTimeoutNum(setTimeout(() => onPickColor(value), 200));
    }

    const onShare = () : void => {
        if(typeof navigator === 'undefined' || !color) return;
        navigator.share({
            url: window.location.origin + '/' + color.replace('#', ''),
            text: 'Color translate to CSS Filters',
            title: 'CSS Color to Filter'
        });
    }

    useEffect(() => color && Color.hexExpand(maskColor.result) !== color ? setMaskColor(mask(color)) : undefined, [ color ]);
    useEffect(() => maskColor.completed ? onPickColor(Color.hexExpand(maskColor.result)) : undefined, [ maskColor ]);

    return (
        <section className="py-5 bg-body-secondary bg-colors">

            { color ? (

                <Container>

                    <Form.Label className="fw-bold text-shadow h5">Color Picker</Form.Label>
                    
                    <div className="d-flex">
                        <InputGroup>
                            <InputGroup.Text>#</InputGroup.Text>
                            <Form.Control
                                className={ maskColor.completed ? undefined : 'is-invalid bg-danger-subtle text-danger' }
                                type="text"
                                value={ maskColor.result.replace('#', '') }
                                onChange={ input => setMaskColor(mask(input.currentTarget.value)) }
                            />
                        </InputGroup>
                        <Form.Control className="mx-2" type="color" value={ color } onChange={ input => setPickColor(input.currentTarget.value) } />
                        <Button variant={ retryDisabled ? 'seconday' : 'warning' } className="me-2" onClick={ onRetry } title="recalculate" disabled={ retryDisabled }><FaSync /></Button>
                        { typeof navigator === 'undefined' ? <ButtonCopy text={ color } /> : <Button onClick={ onShare } title="share"><FaShareAlt /></Button> }
                    </div>

                </Container>

            ) : (

                <div className="m-5" />

            ) }
            
        </section>
    )

}