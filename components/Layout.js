import { Container } from "react-bootstrap";
import Header from "./Header";

function Layout({ fluid, children }) {
  return (
    <div>
      <Header />
      <Container fluid={fluid}>{children}</Container>
    </div>
  );
}

export default Layout;
