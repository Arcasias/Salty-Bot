var Globals = { 
	'salt' : '0',
}

var servers = {}

function adjective (string, array) {	
	var messageArray = string.split("@@");
	if(getSalt("attribute") >= 60) {
		var index = Math.floor(Math.random() * array.length) + 0;
		string = messageArray.join(array[index] + " ");
		Globals.salt = 0;
	} 
	else {
		string = messageArray.join("");
		Globals.salt += 5; 
	}
	return string;
}

function swear (array) {	
	var string = "";
	if(getSalt("swear") >= 65) {
		var index = Math.floor(Math.random() * array.length) + 0;
		string = " " + array[index] + " ";
		Globals.salt = 0;
	} else Globals.salt += 5;
	return string;
}

function error (array) {
	var index = Math.floor(Math.random() * array.length) + 0;
	Globals.salt += 10;
	return array[index];
}

function getSalt (reason) {
	var s = Math.floor(Math.random() * 100) + 1 + parseInt(Globals.salt);
	console.log(`Salt generated for ${reason} : ${s}%`);
	return s;
}

module.exports = {
	adjective : adjective,
	swear : swear,
	error : error,
	getSalt : getSalt,
	Globals : Globals,
	servers : servers
};