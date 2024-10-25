import { ColorData } from "@/core";
import { CSSProperties, ReactNode, useRef, useState } from "react";
import { Button, Card, FormCheck, Overlay, Tooltip } from "react-bootstrap";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import ButtonCopy from "./ButtonCopy";

export type SampleProps = {
    title     : string;
    sample   ?: CSSProperties
    figure   ?: boolean
    children ?: ReactNode
}

export default function Sample({ title, sample, figure = false, children } : SampleProps) {
    return (
        <Card className="my-3">
            <Card.Header className="text-center fw-bolder text-secondary-emphasis">{ title }</Card.Header>
            <Card.Body className="text-center m-auto">
                <div className="img-fluid img-thumbnail bg-bw">
                    <div className={ "sample" + (figure ? ' bg-pineapple' : '') } style={ sample } />
                </div>
            </Card.Body>
            <Card.Footer className="bg-white border-top-0 font-monospace text-center">
                { children }
            </Card.Footer>
        </Card>
    )
}

export type SampleOriginalProps = {
    target: ColorData
}

export function SampleOriginal({ target: {hex, rgb, hsl} } : SampleOriginalProps) {
    return (
        <Sample title="Oginal Color" sample={{ background: hex }}>
            { hex }<br />
            rgb({ rgb.r },{ rgb.g },{ rgb.b })<br />
            hsl({ hsl.h }deg,{ hsl.s }%,{ hsl.l }%)
        </Sample>
    )
}

export type SampleCSSFilterProps = {
    filter: string;
    filterComplete: string;
    loss: number;
    lossPercentage: number;
    result: ColorData;
    onRetry: () => void;
}

export function SampleCSSFilter({ filter, filterComplete, loss, lossPercentage, result, onRetry } : SampleCSSFilterProps) {
    
    const target = useRef<HTMLDivElement | null>(null);
    const [ alert, setAlert ] = useState<boolean>(false);
    
    const onAlert = () => {
        setAlert(true);
        setTimeout(() => setAlert(false), 1500);
    }


    return (
        <Sample title="CSS Filter" sample={{ filter }}>

            <Overlay target={ target.current } show={ alert } placement="bottom">
                { props => <Tooltip id="button-tooltip-2" {...props}>{loss} points loss</Tooltip> }
            </Overlay>

            <div ref={ target } onClick={ onAlert } onMouseOver={ onAlert } className={ loss < 10 ? 'text-success' : loss < 30 ? 'text-warning' : 'text-danger' }>
                <div className="fw-bold">
                    <span className="px-2">Loss: { lossPercentage }%</span>
                    { loss < 10 ? <FaCheckCircle /> : <>
                        <FaExclamationTriangle />
                        <Button onClick={ onRetry } title="recalculate" variant="link" className="p-0 my-0 ms-2">Retry</Button>
                    </>}
                </div>
            </div>

            { result.hex }<br />
            rgb({ result.rgb.r },{ result.rgb.g },{ result.rgb.b })<br />
            hsl({ result.hsl.h }deg,{ result.hsl.s }%,{ result.hsl.l }%)
            <div className="d-flex my-2 border-top">
                <div className="text-start small">{ filterComplete }</div>
                <div className="text-end align-self-end">
                    <ButtonCopy text={ filterComplete } />
                </div>
            </div>
        </Sample>
    )
}

export type SampleAddOpacityProps = {
    opacity: number;
    preserve: boolean;
    filter: string;
    filterComplete: string;
    onChangeOpacity: (opacity : number) => void;
    onChangePreserve: () => void;
}

export function SampleAddOpacity({ opacity, preserve, filter, filterComplete, onChangeOpacity, onChangePreserve } : SampleAddOpacityProps) {
    return (
        <Sample title="Add Opacity" sample={{ filter }} figure>
            <div className="my-4">
                <p className="fw-bold">{ opacity }%</p>
                <input placeholder="Opacity Range" type="range" min={ 0 } max={ 100 } step={ 1 } value={ opacity } onChange={ input => onChangeOpacity(parseInt(input.currentTarget.value)) } />
                <div className="d-flex justify-content-center">
                    <label className="fw-bolder">Preserve Origin</label>
                    <FormCheck className="ms-2" type="switch" checked={ preserve } onChange={ () => onChangePreserve() } />
                </div>
            </div>
            <div className="d-flex my-2 border-top">
                <div className="text-start small">{ filterComplete }</div>
                <div className="text-end align-self-end">
                    <ButtonCopy text={ filterComplete } />
                </div>
            </div>
        </Sample>
    )
}
