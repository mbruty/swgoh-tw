import { API_URL } from "../constants";

const authCheck = async () => {
  try {
    const res = await fetch(API_URL + "/auth/check", {
      credentials: "include",
    });
    return res.status === 200;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default authCheck;
