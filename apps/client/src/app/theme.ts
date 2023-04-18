import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: 'Nunito, sans-serif',
    fontWeightBold: 600,
    fontWeightLight: 400,
  },
  palette: {
    primary: {
      main: '#277BC0',
      light: '#BBE1FA',
      dark: '#1B262C',
    },
    secondary: {
      main: '#FFFFFF',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
