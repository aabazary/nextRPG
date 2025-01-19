import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    let token = null;
    cookies.forEach(cookie => {
      const [key, value] = cookie.split('=');
      if (key.trim() === 'authToken') {
        token = value;
      }
    });
    return token;
  }
  return null;
};

const httpLink = createHttpLink({
  uri: '/api/graphql', 
});

const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
