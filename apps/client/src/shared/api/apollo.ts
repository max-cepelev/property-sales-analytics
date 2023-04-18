import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  type ServerError,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import axios from 'axios';
import { API_URL } from '../constants/api-url';
import { AuthResponse } from '../types/auth';
// import { LoginResponse } from '../models/gql/graphql';

const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`,
});

const getNewToken = async () => {
  try {
    const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {
      withCredentials: true,
    });
    localStorage.setItem('token', response.data.token);
    return response.data.token;
  } catch (e) {
    console.log('НЕ АВТОРИЗОВАН');
    return '';
  }
};

// const httpLink = createUploadLink({
//   uri: `${API_URL}/ql`,
//   // credentials: 'include',
// });

const errorLink = onError(({ networkError, operation, forward }) => {
  // if (graphQLErrors) {
  //   for (const err of graphQLErrors) {
  //     const oldHeaders = operation.getContext().headers;
  //     switch (err.extensions.code) {
  //       case 'UNAUTHENTICATED':
  //         operation.setContext({
  //           headers: {
  //             ...oldHeaders,
  //             Authorization: `Bearer ${getNewToken()}`,
  //           },
  //         });
  //         return forward(operation);
  //     }
  //   }
  // }

  // To retry on network errors, we recommend the RetryLink
  // instead of the onError link. This just logs the error.
  if (networkError) {
    const error = networkError as ServerError;
    if (error?.result?.message === 'Unauthorized') {
      const oldHeaders = operation.getContext().headers;
      getNewToken().then((token) => {
        operation.setContext({
          headers: {
            ...oldHeaders,
            Authorization: `Bearer ${token}`,
          },
        });
        return forward(operation);
      });
    }
    console.log(`[Network error]: ${networkError}`);
  }
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;
