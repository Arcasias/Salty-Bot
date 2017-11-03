const answer = module.require('../answers.json');
const util = module.require('../utils.js');

module.exports.run = async (bot, message, args) => {
	message.delete();
	message.channel.send(util.swear(answer.swear) + util.adjective(args.join(" "), answer.adjective) + util.swear(answer.insult), {tts: true});
	return;	
}

module.exports.help = {
	name: "tts",
	usage: "tts <message>",
	description: "I'll send something and say it out loud"
}