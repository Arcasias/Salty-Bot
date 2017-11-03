const config = module.require('../config.json');
const Discord = require('discord.js');
const util = module.require('../utils.js');

module.exports.run = async (bot, message, args) => {
	//Set author as default user and adapt color to his/her role
	let usr = message.author;
	let col = message.member.highestRole.color;
	let desc = "This is a huge piece of shit";
		//If there is someone in the mention list, that user is set as new default
	if(message.mentions.users.first()) {		
			//Save the mention just in case
		let ment = message.mentions.users.first();
		usr = ment;
		col = "0x000000";

		//Change description in case it's a bot
		if(usr.bot) desc = "That's just a crappy bot";

		//Different case when the mention is Salty's ID
		if(ment.id == config.id) {
			desc = "Awww you asked for my pic ^-^"; 
			salt = 0;
			col = "0xFFFFFF";

			util.Globals.salt = 0;
		}
	}
			
	//removing unwanted part of url and creating embed link
	url = usr.avatarURL;

	let embed = new Discord.RichEmbed()
	  .setTitle(usr.username + "'s avatar")
	  .setColor(parseInt(col))
	  .setDescription(desc)
	  .setImage(usr.avatarURL)
	message.channel.send({embed}); 
	return;	
}

module.exports.help = {
	name: "pic",
	usage: "pic (user mention)",
	description: "Mention someone to get his avatar or i'll send yours"
}