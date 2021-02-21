import React, { useEffect, useMemo } from "react";
import "./styles/App.scss";
import {
  createMuiTheme,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LogIn from "./main-routes/LogIn";
import Home from "./main-routes/Home";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          background: {
            paper: prefersDarkMode ? "#303030" : "#FFF",
            default: prefersDarkMode ? "#212121" : "#FFF",
          },
          primary: {
            light: "#ff776c",
            main: prefersDarkMode ? "#FD4040" : "#ff776c",
            dark: prefersDarkMode ? "#c20018" : "#FD4040",
          },
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <div
        className="app"
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" render={() => <LogIn />} />
            <Route
              path="/*"
              render={() => (
                <Home
                  navColour={
                    prefersDarkMode ? "#333333" : theme.palette.primary.light
                  }
                />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
