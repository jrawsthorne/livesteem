import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useState } from "react";

export default function Header() {
  const [appear, setAppear] = useState(false);

  return (
    <Navbar bg="light" expand="md">
      <Container>
        <Link passHref href="/">
          <Navbar.Brand>LiveSteem</Navbar.Brand>
        </Link>
        <Navbar.Toggle onClick={() => setAppear(!appear)} />
        <Navbar.Collapse appear={appear}>
          <Nav className="ml-auto">
            <Nav.Link>Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
