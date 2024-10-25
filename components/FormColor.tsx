import { Color, ColorHex } from "@/core";
import { CompleteMask, getPresetMask, useCompleteMask } from "mask-hooks";
import { useEffect, useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { FaSync } from "react-icons/fa";

export type FormColorProps = {
    color : ColorHex;
    onPickColor : (color : ColorHex) => void;
    onRetry : () => void;
}

export default function FormColor({ color, onPickColor, onRetry } : FormColorProps) {

    const mask = useCompleteMask(getPresetMask('COLOR_HEX'));

    const [ timeoutNum, setTimeoutNum ] = useState<NodeJS.Timeout>();
    const [ maskColor, setMaskColor ] = useState<CompleteMask>(mask(color));

    const setPickColor = (value : string) => {
        clearTimeout(timeoutNum);
        setTimeoutNum(setTimeout(() => onPickColor(value), 200));
    }

    useEffect(() => Color.hexExpand(maskColor.result) !== color ? setMaskColor(mask(color)) : undefined, [ color ]);
    useEffect(() => maskColor.completed ? onPickColor(Color.hexExpand(maskColor.result)) : undefined, [ maskColor ]);

    return (
        <section className="py-5 bg-body-secondary bg-colors">
            <Container>
                <Form.Label className="fw-bold text-shadow h5">Color Picker</Form.Label>
                <div className="d-flex">
                    <InputGroup>
                        <InputGroup.Text>#</InputGroup.Text>
                        <Form.Control className={ maskColor.completed ? undefined : 'is-invalid bg-danger-subtle text-danger' } type="text" value={ maskColor.result.replace('#', '') } onChange={ input => setMaskColor(mask(input.currentTarget.value)) } />
                    </InputGroup>
                    <Form.Control className="mx-2" type="color" value={ color } onChange={ input => setPickColor(input.currentTarget.value) } />
                    <Button onClick={ onRetry } title="recalculate"><FaSync /></Button>
                </div>
            </Container>
        </section>
    )

}