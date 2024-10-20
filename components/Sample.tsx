import { CSSProperties, ReactNode } from "react";
import { Card } from "react-bootstrap";

export type SampleProps = {
    title     : string;
    sample   ?: CSSProperties
    children ?: ReactNode
}

export default function Sample({ title, sample, children } : SampleProps) {
    return (
        <Card className="my-3">
            <Card.Header className="text-center fw-bolder text-secondary-emphasis">{ title }</Card.Header>
            <Card.Body className="text-center m-auto">
                <div className="img-fluid img-thumbnail">
                    <div className="sample" style={ sample } />
                </div>
            </Card.Body>
            <Card.Footer className="bg-white border-top-0 font-monospace text-center">
                { children }
            </Card.Footer>
        </Card>
    )
}