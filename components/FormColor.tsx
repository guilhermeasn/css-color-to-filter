import { Color, ColorHex } from "@/core";
import { CompleteMask, getPresetMask, useCompleteMask } from "mask-hooks";
import { useEffect, useState } from "react";
import { Container, Form, InputGroup } from "react-bootstrap";

export type FormColorProps = {
    color : ColorHex;
    setColor : (color : ColorHex) => void;
}

export default function FormColor({ color, setColor } : FormColorProps) {

    const mask = useCompleteMask(getPresetMask('COLOR_HEX'));

    const [ maskColor, setMaskColor ] = useState<CompleteMask>(mask(color));

    useEffect(() => Color.hexExpand(maskColor.result) !== color ? setMaskColor(mask(color)) : undefined, [ color ]);
    useEffect(() => maskColor.completed ? setColor(Color.hexExpand(maskColor.result)) : undefined, [ maskColor ]);

    return (
        <section className="py-5 bg-body-secondary bg-colors">
            <Container>
                <Form.Label className="fw-bold text-shadow h5">Color Picker</Form.Label>
                <div className="d-flex">
                    <InputGroup>
                        <InputGroup.Text>#</InputGroup.Text>
                        <Form.Control className={ maskColor.completed ? undefined : 'is-invalid bg-danger-subtle text-danger' } type="text" value={ maskColor.result.replace('#', '') } onChange={ input => setMaskColor(mask(input.currentTarget.value)) } />
                    </InputGroup>
                    <Form.Control className="ms-2" type="color" value={ color } onChange={ input => setColor(input.currentTarget.value) } />
                </div>
            </Container>
        </section>
    )

}