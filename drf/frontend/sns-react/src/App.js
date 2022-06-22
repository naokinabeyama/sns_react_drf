import './App.css';
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvier } from '@material-ui/core/styles'
import indigo from '@material-ui/core/colors/indigo'
import Navbar from './components/Navbar';
import ApiContextProvider from './context/ApiContext';



const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "Comic Neue",
  },
});


function App() {
  return (
    <ApiContextProvider>
      <MuiThemeProvier theme={theme}>
        <Navbar />
      </MuiThemeProvier>
    </ApiContextProvider>
  );
}

export default App;
