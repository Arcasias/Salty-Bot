module.exports.run = async (bot, message, args) => {
	message.channel.send("Omaay wah mow, sheen day eeru", {tts: true}).then(sentMessage => sentMessage.delete().catch(kek=>{}));
	message.channel.send("Omae wa mou shindeiru");
	return;
}

module.exports.help = {
	name: "omae",
	usage: "omae",
	description: "You're already dead"
}