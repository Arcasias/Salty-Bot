const answer = module.require('../answers.json');
const util = module.require('../utils.js');

module.exports.run = async (bot, message, args) => {
	if(util.getSalt("ping") >= 75) {
		message.channel.send(util.adjective("Pong, and i don't give a fuck about your @@latency", answer.adjective));
	}
	else {
		try {
			message.channel.send("Pinging...")
			.then(sentMessage => sentMessage.edit(`Pong ! Latency is ${sentMessage.createdTimestamp - message.createdTimestamp}ms${util.swear(answer.insult)}`));
		}
		catch(e) {
			console.log(e.stack);
			message.channel.send("Good job, i crashed" + util.swear(answer.insult));
		}		
	}
	return;
}

module.exports.help = {
	name: "ping",
	usage: "ping",
	description: "Test latency"
}