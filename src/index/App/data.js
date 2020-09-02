const axios = require("axios").default;

let callBack;
// Storing data here, rather than in a state as it's pretty much a global variable
let data;
const fetchData = (allyCodes) => {
	console.log(allyCodes);
	return new Promise((resolve, reject) => {
		axios
			.get("http://localhost:5000/api/guilds" + allyCodes)
			.then((response) => {
				data = response.data[0];
				callBack(data);
				resolve();
			})
			.catch((error) => {
				console.log(error);
				reject(error);
			});
	});
};

const getData = () => {
	return data;
};

const registerCallBack = (cb) => {
	callBack = cb;
};

const getMemberData = () => {
	return {gp: data.gp, members: data.members}
}

module.exports = {
	getMemberData: getMemberData,
	registerCallBack: registerCallBack,
	fetchData: fetchData,
	getData: getData,
};
