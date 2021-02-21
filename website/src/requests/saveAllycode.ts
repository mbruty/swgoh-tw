import { API_URL } from "../constants";

const saveAllycode = async (allycode: string) => {
  const res = await fetch(API_URL + "/me/allycode", {
    credentials: "include",
    method: "PUT",
    body: JSON.stringify({ code: allycode }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.status === 200;
};

export default saveAllycode;
