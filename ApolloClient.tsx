import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
  ApolloCache,
  HttpLink
} from "@apollo/client";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import { HttpLink } from "apollo-link-http";

const cache: ApolloCache<NormalizedCacheObject> = new InMemoryCache();
const link = new HttpLink({
  uri: "https://rickandmortyapi.com/graphql"
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link
});

export default client;
