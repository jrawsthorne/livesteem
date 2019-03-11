import "bootstrap/dist/css/bootstrap.min.css";
import { Field, Form, Formik } from "formik";
import Cookie from "js-cookie";
import Link from "next/link";
import { withRouter } from "next/router";
import { useState } from "react";
import { useApolloClient, useMutation } from "react-apollo-hooks";
import {
  Button,
  Container,
  FormControl,
  InputGroup,
  Nav,
  Navbar,
  NavDropdown,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import useMe from "../hooks/useMe";
import useSteemKeychain from "../hooks/useSteemKeychain";
import { VERIFY_LOGIN_MUTATION } from "../graphql/mutations";

function LoginForm({ refetchMe }) {
  const {
    steemKeychain,
    loaded: steemKeychainLoaded,
    checkForKeychain,
  } = useSteemKeychain();

  // If steem keychain not found, check for it unless already checked

  if (!steemKeychain) {
    if (steemKeychainLoaded) {
      // prettier-ignore
      return <p>Please install <Link href="https://github.com/MattyIce/steem-keychain"><a>Steem Keychain</a></Link> to login</p>;
    } else {
      return checkForKeychain();
    }
  }

  const verifyLogin = useMutation(VERIFY_LOGIN_MUTATION);

  async function Login(username) {
    let encryptedToken;

    // verifyLogin returns a jwt encrypted with user's public memo key

    const res = await verifyLogin({ variables: { username } });
    encryptedToken = res.data.verifyLogin;

    // If user can decode jwt then set cookie to that token

    return new Promise((resolve, reject) => {
      steemKeychain.requestVerifyKey(username, encryptedToken, "Memo", res => {
        if (res.success) {
          Cookie.set("accessToken", res.result.split("#")[1]);
          // refetch me query, now logged in
          refetchMe();
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  return (
    <Formik
      initialValues={{
        username: "",
      }}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        try {
          await Login(values.username);
        } catch {
          setErrors({
            username: "Sorry, something went wrong",
          });
          setSubmitting(false);
        }
      }}
      render={({ errors, isSubmitting }) => (
        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              name="username"
              id="username"
              as={Field}
              autoFocus
            />
          </InputGroup>
          <p>{errors.username || null}</p>
          <Button
            disabled={isSubmitting}
            type="submit"
            variant="outline-primary"
          >
            {isSubmitting ? "Verifying" : "Login"}
          </Button>
        </Form>
      )}
    />
  );
}

function Header() {
  const { me, refetchMe } = useMe();
  const client = useApolloClient();
  const [appear, setAppear] = useState(false);

  function Logout() {
    Cookie.remove("accessToken");
    client.resetStore();
  }

  const AuthNav = () => {
    if (me) {
      const { name } = me;
      return (
        <>
          <NavDropdown title={name}>
            <NavDropdown.Item onClick={() => Logout()}>Logout</NavDropdown.Item>
          </NavDropdown>
        </>
      );
    } else {
      return (
        <OverlayTrigger
          trigger="click"
          placement="left"
          overlay={
            <Popover title={`Enter your Steem username`}>
              <LoginForm refetchMe={refetchMe} />
            </Popover>
          }
        >
          <Nav.Link>Login</Nav.Link>
        </OverlayTrigger>
      );
    }
  };

  return (
    <Navbar bg="light" expand="md">
      <Container>
        <Link passHref href="/">
          <Navbar.Brand>LiveSteem</Navbar.Brand>
        </Link>
        <Navbar.Toggle onClick={() => setAppear(!appear)} />
        <Navbar.Collapse appear={appear}>
          <Nav className="ml-auto">
            <AuthNav />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default withRouter(Header);
