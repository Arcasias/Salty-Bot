const util = module.require('../utils.js');
const ytdl = require("ytdl-core");

module.exports.run = async (bot, message, args) => {
	var server = util.servers[message.guild.id];
	
	if(server.queue) {
		let m = "Currently in the queue : "
		console.log(server.queue);
		i = 1;
		server.queue.forEach(function(elem) {
			ytdl.getInfo(elem).then(info => {
				m += `\n${i} - ${info.title}`;
			});
			i++;
		});
		message.channel.send(m);
	}
	return;
}

module.exports.help = {
	name: "queue",
	usage: "queue",
	description: "Shows the current queue"
}