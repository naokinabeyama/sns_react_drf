import './App.css';
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvier } from '@material-ui/core/styles'
import indigo from '@material-ui/core/colors/indigo'
import Navbar from './components/Navbar';



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
    <MuiThemeProvier theme={theme}>
      <Navbar />
    </MuiThemeProvier>
  );
}

export default App;
