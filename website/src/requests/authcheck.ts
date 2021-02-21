import { API_URL } from "../constants";

const authCheck = async () => {
  try {
    const res = await fetch(API_URL + "/auth/check", {
      credentials: "include",
    });
    const body = await res.json();
    console.log(body);
    return { authorised: res.status === 200, user: body };
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default authCheck;
