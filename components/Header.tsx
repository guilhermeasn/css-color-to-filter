import { Container, Nav, Navbar } from "react-bootstrap";
import { FaGithub } from "react-icons/fa";

export default function Header() {
    return (
        <Navbar as='header' bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href=".">CSS Color to Filter</Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link href="https://github.com/guilhermeasn/css-color-to-filter" target="_blank" title="GitHub">
                            <FaGithub size={ 30 } />
                        </Nav.Link>
                    </Nav>
            </Container>
      </Navbar>
    )
}