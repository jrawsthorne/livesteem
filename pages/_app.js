import "bootstrap/dist/css/bootstrap.min.css";
import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";
import { ApolloProvider } from "react-apollo-hooks";
import { createGlobalStyle } from "styled-components";
import withApolloClient from "../lib/with-apollo-client";

const GlobalStyles = createGlobalStyle`
  .container-fluid {
    padding: 0
  }
`;

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <Container>
        <GlobalStyles />
        <ApolloProvider client={apolloClient}>
          <Head>
            <title>LiveSteem</title>
          </Head>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
