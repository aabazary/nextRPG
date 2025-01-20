import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Helper function to get the auth token
const getAuthToken = () => {
  if (typeof window === "undefined") return null; // Ensure this only runs on the client
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key.trim() === "authToken") {
      return value;
    }
  }
  return null;
};

// Create the HTTP link for GraphQL requests
const httpLink = createHttpLink({
  uri: "/api/graphql", // Update this with your GraphQL API URI if necessary
});

// Create the auth link to attach the token to headers
const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Initialize the Apollo Client
const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]), // Combine the auth and HTTP links
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network", // Always fetch new data while caching for better UX
    },
    query: {
      fetchPolicy: "network-only", // Always fetch fresh data for queries
    },
  },
});

export default client;
