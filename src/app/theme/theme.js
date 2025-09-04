'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#046241', // Castleton Green
    },
    secondary: {
      main: '#133020', // Dark Serpent
    },
    background: {
      default: '#F9F7F7', // Sea Salt
      paper: '#f5eedb', // Paper
    },
    text: {
      primary: '#133020', // Dark Serpent
      secondary: '#046241', // Castleton Green
    },
    warning: {
        main: '#FFB347', // Saffaron
    }
  },
  typography: {
    fontFamily: 'inherit', // This will make MUI use the font from globals.css
    h2: {
        fontWeight: 'bold',
    },
    h5: {
        color: '#555555', // Keeping a slightly muted color for the motto
    }
  },
});

export default theme;