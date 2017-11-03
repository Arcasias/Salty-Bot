const util = module.require('../utils.js');
const ytdl = require("ytdl-core");

module.exports.run = async (bot, message, args) => {
	var server = util.servers[message.guild.id];

	if(message.guild.voiceConnection) {
		message.guild.voiceChannel.disconnect()
		message.channel.send("Leaving " + message.member.voiceChannel);
	}
	return;
}

module.exports.help = {
	name: "stop",
	usage: "stop",
	description: "Stop the music and clears the queue"
}