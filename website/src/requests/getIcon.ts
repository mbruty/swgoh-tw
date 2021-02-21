import { API_URL } from "../constants";

const getIcon = async () => {
  const res = await fetch(API_URL + "/me/icon", {
    credentials: "include",
  });
  if (res.status === 200) {
    const json = await res.json();
    return json;
  }
};

export default getIcon;
