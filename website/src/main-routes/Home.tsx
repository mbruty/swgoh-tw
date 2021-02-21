import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router";
import { BrowserRouter } from "react-router-dom";
import authCheck from "../requests/authcheck";
import GetStarted from "./home-routes/GetStarted";
import Nav from "./nav";

interface Props {
  navColour: string;
}

const Home: React.FC<Props> = (props) => {
  const history = useHistory();
  useEffect(() => {
    authCheck().then((authState) => {
      if (!authState) {
        // We're not logged in!
        history.push("/login");
      } else if (authState.authorised) {
        if (!authState.user.isSetUp) {
          history.push("/getstarted");
        }
      }
    });
  }, []);

  return (
    <>
      <Nav colour={props.navColour} />
      <main>
        <Route exact path="/getstarted" render={() => <GetStarted />} />
      </main>
    </>
  );
};

export default Home;
