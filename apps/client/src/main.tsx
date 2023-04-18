import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-datasheet-grid/dist/style.css';

import './index.css';
import theme from './app/theme';
import client from './shared/api/apollo';
import { routes } from '~/app/router';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './shared/components/ErrorFallback';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => console.log({ error, info })}
    >
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            autoHideDuration={3000}
          >
            <RouterProvider router={router} />
          </SnackbarProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
