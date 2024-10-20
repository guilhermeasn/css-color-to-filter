import { Container } from "react-bootstrap";

export default function Footer() {
    return (
        <footer className="border-top mt-5">
            <Container>
                <div className="d-flex justify-content-between">
                    <small>MIT License</small>
                    <small>
                        <a href="https://gn.dev.br/" target="_blank" rel='noopener'>
                            &lt;gn.dev.br/&gt;
                        </a>
                    </small>
                </div>
            </Container>
        </footer>
    )
}