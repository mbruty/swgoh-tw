import { Button, TextField } from "@material-ui/core";
import React from "react";
import { API_URL } from "../../constants";
import saveAllycode from "../../requests/saveAllycode";
import LoadingBtn from "./LoadingBtn";

interface Data {
  name: string;
  level: number;
  guildRefId: string;
  guildName: string;
}

interface Props {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const SetAllyCode: React.FC<Props> = (props) => {
  const [code, setCode] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [data, setData] = React.useState<Data | undefined>();
  const [errors, setErrors] = React.useState<boolean>(false);
  if (!data) {
    return (
      <>
        <div className="container">
          <TextField
            id="outlined-basic"
            label="Ally Code"
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ height: "100%" }}
          />

          <LoadingBtn
            loading={loading}
            setLoading={setLoading}
            success={success}
            setSuccess={setSuccess}
            onClick={() => {
              fetch(API_URL + "/data/player/" + code, {
                credentials: "include",
              })
                .then((res) => res.json())
                .then((res) => {
                  setLoading(false);
                  setSuccess(true);
                  setTimeout(() => setData(res[0]), 600);
                })
                .catch(() => {
                  setErrors(true);
                  setLoading(false);
                });
            }}
          />
        </div>
        {errors && <p className="error-text">Invalid code</p>}
      </>
    );
  } else {
    console.log(data);
    return (
      <div>
        <p>Is this your profile?</p>
        <p>Name: {data.name}</p>
        <p>Level: {data.level}</p>
        <p>Guild: {data.guildName}</p>
        <div>
          <Button
            style={{ marginRight: "0.5em" }}
            onClick={() => {
              setData(undefined);
              setSuccess(false);
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              saveAllycode(code).then((saved) => {
                if (saved) {
                  props.setActiveStep((prev) => prev + 1);
                }
              });
            }}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
};

export default SetAllyCode;
