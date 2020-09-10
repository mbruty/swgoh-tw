const io = require("socket.io-client");
require('dotenv').config();
let callBack;
let updateCb;
const url = "http://" + window.location.hostname + ":4000";
console.log(url);
// Storing data here, rather than in a state as it's pretty much a global variable
let data;
const fetchData = (allyCodes) => {
  console.log(allyCodes);
  return new Promise((resolve, reject) => {
    let socket = io(url);
    socket.on('connect', client => {
      console.log("Connected");
    });
    socket.emit('getGuild', allyCodes);
    socket.on('fetched', res => {
      data = res;
      console.log(data);
      // Delay so that the animation can finish
      setTimeout(() => callBack(data), 400);
    })
    socket.on('update', res => {
      updateCb(res);
    })
  });
};

const getData = () => {
  return data;
};


const registerCallBack = (cb) => {
  callBack = cb;
};

const getMemberData = () => {
  return { gp: data.gp, members: data.members };
};

const registerFetchState = (cb) => {
  updateCb = cb;
}
const getSquads = () => {
  return data.squads;
};

module.exports = {
  getSquads: getSquads,
  getMemberData: getMemberData,
  registerCallBack: registerCallBack,
  fetchData: fetchData,
  getData: getData,
  registerFetchState: registerFetchState,
};
