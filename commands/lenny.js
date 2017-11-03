module.exports.run = async (bot, message, args) => {
	message.delete();
	message.channel.send("( ͡° ͜ʖ ͡°)");
	return;
}

module.exports.help = {
	name: "lenny",
	usage: "lenny",
	description: "( ͡° ͜ʖ ͡°)"
}