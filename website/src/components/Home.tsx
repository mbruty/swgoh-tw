import React, { useEffect } from "react";
import { useHistory } from "react-router";
import authCheck from "../requests/authcheck";

const Home: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    authCheck().then((authState) => {
      if (!authState) {
        // We're not logged in!
        history.push("/login");
      }
    });
  }, [history]);

  return <h1>Home</h1>
} 

export default Home;