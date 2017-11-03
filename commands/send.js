const answer = module.require('../answers.json');
const util = module.require('../utils.js');

module.exports.run = async (bot, message, args) => {
	switch (args[0]) {
		//special cases
		case "nudes" :
			message.reply(util.swear(answer.swear) + util.adjective("you @@wish", answer.adjective) + util.swear(answer.insult));
			break;
		case "noods" :
			message.reply(util.swear(answer.swear) + util.adjective("you're so @@poor", answer.adjective) + util.swear(answer.insult));
			break;
		case "noot" :
			message.channel.send("NOOT NOOT !");
			break;
		//default case : Salty says the arguments
		default :
			message.delete();
			m = util.swear(answer.swear) + util.adjective(args.join(" "), answer.adjective) + util.swear(answer.insult);
			message.channel.send(m);
			break;
	}
	return;
}

module.exports.help = {
	name: "send",
	usage: "send",
	description: "I'll send something for you"
}