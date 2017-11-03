const answer = module.require('../answers.json');
const util = module.require('../utils.js');

module.exports.run = async (bot, message, args) => {
	if(!message.member.voiceChannel) {
		channel.send.message(util.swear(answer.swear) + "you're not in a voice channel" + util.swear(answer.insult));
		return;
	}
	if(!message.guild.voiceConnection) {
		message.member.voiceChannel.join();
		message.channel.send("Joining " + message.member.voiceChannel.name + util.swear(answer.insult));
	} else message.channel.send(util.swear(answer.swear) + "i'm already in your voice channel" + util.swear(answer.insult));
	return;
}

module.exports.help = {
	name: "join",
	usage: "join",
	description: "join the voice channel"
}