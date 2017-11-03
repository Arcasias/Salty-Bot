const util = module.require('../utils.js');
const ytdl = require("ytdl-core");

module.exports.run = async (bot, message, args) => {
	var server = util.servers[message.guild.id];
	
	if(server.dispatcher) server.dispatcher.end();
	return;
}

module.exports.help = {
	name: "skip",
	usage: "skip",
	description: "skip the current song"
}