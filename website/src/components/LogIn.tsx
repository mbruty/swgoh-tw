import { Button, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import authCheck from "../requests/authcheck";

const LogIn: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    authCheck().then((authState) => {
      if (authState) {
        // We're already logged in!
        history.push("/");
      }
    });
  }, [history]);

  return (
    <Paper style={{ padding: "1em" }}>
      <h2>Welcome to the Territory War inspector V2</h2>
      <div
        style={{
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "space-evenly",
        }}
      >
        <Button variant="contained" color="primary">
          View v1 Site
        </Button>
        <Button
          onClick={() => {
            // Redirect
            window.open(
              "https://discord.com/api/oauth2/authorize?client_id=812745618824495124&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fredirect&response_type=code&scope=identify",
              "_self"
            );
          }}
          variant="contained"
          color="primary"
        >
          Log in with discord
        </Button>
      </div>
    </Paper>
  );
};

export default LogIn;
