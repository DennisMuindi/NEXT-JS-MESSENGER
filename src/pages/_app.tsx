import "@/styles/globals.css";
import "@/styles/styles.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "@/Redux/store";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

export default function App({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_BASEURL,
    cache: new InMemoryCache(),
    headers: {
      Authorization:
        "Bearer " +
        (typeof window !== "undefined" ? localStorage.getItem("token") : ""),
    },
  });
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ApolloProvider>
  );
}
