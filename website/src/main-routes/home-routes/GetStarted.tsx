import { Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { API_URL } from "../../constants";
import GetStartedStepper from "./GetStartedStepper";
import SetAllyCode from "./SetAllyCode";

interface Props {}

const GetStarted: React.FC<Props> = (props) => {
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    // See what stage the user previously got to
    fetch(API_URL + "/me/allycode", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setActiveStep(1);
        }
      });
  });
  const renderPage = () => {
    switch (activeStep) {
      case 0:
        return <SetAllyCode setActiveStep={setActiveStep} />;
    }
  };

  return (
    <div className="center main-content-under-nav">
      <Paper style={{ padding: "2em" }}>
        {renderPage()}
        <GetStartedStepper
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </Paper>
    </div>
  );
};

export default GetStarted;
