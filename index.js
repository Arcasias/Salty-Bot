//Loading discord.js librariy
const Discord = require('discord.js');

//Loading the configuration file + answer file + fs
const config = require('./config.json');
const answer = require('./answers.json');
const fs = require('fs');
const util = require('./utils.js');

//Creating client
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

console.log("Base dependencies loaded successfully");

//Initialise props earlier to use it for $help
let help = [];

//Read the command file
fs.readdir(`./commands/`, (err, files) => {

	//Require each .js file
	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0) return;

	console.log(`Loading ${jsfiles.length} command files...`);

	//Load each .js file
	jsfiles.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		console.log(`${i + 1} : command ${f} loaded`);
		bot.commands.set(props.help.name, props);
		help.push([props.help.name, props.help.usage, props.help.description]);
	});
});

//Execute once the bot has succesfully started
bot.on('ready', () => {
	console.log("Salty Bot successfully started and ready to salt the chat :D");
});

//Execute at every message
bot.on('message', async message => {
	
	if(message.author.bot) return; //Ignore bots messages

	//Gets every message in the log
	console.log(`\n\nMESSAGE FROM : ${message.author.username} - ID : ${message.author.id}\nContent : ${message.content}`);
	
	//Enters the command block
	if(message.content.startsWith(config.prefix)) {

		//Separate the command from the arguments
		let args = message.content.slice(config.prefix.length).split(" ");
		let command = args.shift().toLowerCase();

		let cmd = bot.commands.get(command);
		if(cmd) cmd.run(bot, message, args);

		else if(command == 'help') {
			let embed = new Discord.RichEmbed()
			  .setTitle("List of commands")
			  .setAuthor("Salty Bot", bot.user.avatarURL)
			  .setColor(0xFFFFFF)
			  .setDescription("These are all of my available commands. Syntax is \"$\" + command. Please contact my maker if you have any questions. No Git repository yet :'(")
			  .setImage("https://www.ideadigezt.com/wp-content/uploads/2017/02/Salt-014-1024x614.jpg")
			  .setFooter("Arcasias is my creator, now suck his dick ^-^")
			help.forEach(h => {
				embed.addField(h[0], `Usage : $${h[1]} => ${h[2]}`);
			});
			message.reply({embed});
		}

		//If the command doesn't exist, insults the author
		else {			
			message.reply(util.swear(answer.swear) + util.error(answer.error) + util.swear(answer.insult));
			return;
		}
	}
	
	//Enters the mention block
	if(message.isMentioned(config.id)) {
		//message.reply("don't talk to me" + util.swear(answer.swear));
		return;
	}
});

//Log in with the bot
bot.login(config.token);