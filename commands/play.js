const answer = module.require('../answers.json');
const util = module.require('../utils.js');
const ytdl = require("ytdl-core");

module.exports.run = async (bot, message, args) => {
	if(!args[0]) {
		message.channel.send(util.swear(answer.swear) + util.error(answer.error) + util.swear(answer.insult));
		return;
	}

	if(!message.member.voiceChannel) {
		message.channel.send(util.swear(answer.swear) + "you're not in a voice channel" + util.swear(answer.insult));
		return;
	}

	if(!util.servers[message.guild.id]) util.servers[message.guild.id] = {
		queue: []
	};	

	var server = util.servers[message.guild.id];

	let title = "";

	ytdl.getInfo(args[0]).then(info => {
		title += info.title;
		message.channel.send(util.adjective(`I added ${info.title} to the @@queue`, answer.adjective) + util.swear(answer.insult));
	});

	console.log("CECI EST UN TITRE MDRRRRRRRRRRRRRRRRRRRRRRRRR : " + title);

	server.queue.push(args[0]);

	if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
		play(connection, message);
	}); 		
	return;
}

function play(connection, message) {
	var server = util.servers[message.guild.id];

	server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

	server.dispatcher.on("end", function() {
		if(server.queue[0]) {
			play(connection, message);
			server.queue.shift();
		}
		else {
			connection.disconnect();
			message.channel.send(util.adjective("Ok i'm done with these @@songs", answer.adjective) + util.swear(answer.insult));
		}
	});
}

module.exports.help = {
	name: "play",
	usage: "play <url>",
	description: "Plays the video you want"
}