import copy from "copy-to-clipboard";
import { useRef, useState } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import { FaCopy } from "react-icons/fa";

export type ButtonCopyProps = {
    variant ?: string;
    text : string;
    size ?: "sm" | "lg";
}

export default function ButtonCopy({ text, size = 'sm', variant = 'dark' } : ButtonCopyProps) {

    const target = useRef<HTMLButtonElement | null>(null);
    const [ alert, setAlert ] = useState<boolean>(false);

    const onCopy = () => {
        copy(text) && setAlert(true);
        setTimeout(() => setAlert(false), 3000);
    }

    return <>

        <Button ref={ target } variant={ variant } size={ size } title="Copy!" onClick={ onCopy }>
            <FaCopy />
        </Button>

        <Overlay target={ target.current } show={ alert } placement="bottom">
            { props => <Tooltip { ...props }>Copied to Clipboard</Tooltip> }
        </Overlay>

    </>;

}