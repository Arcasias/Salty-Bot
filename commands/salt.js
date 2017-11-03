const util = module.require('../utils.js');

module.exports.run = async (bot, message, args) => {
	switch (util.Globals.salt) {
		case 0 : 
			message.reply("hey you're mean, i'm not salty :)");
			break;
		case (util.Globals.salt >=100) : 
			message.reply("I WILL FUCKING THROW YOU TO THE GARBAGE WHERE YOU BELONG YOU FUCKING PIECE OF OXYGEN-WASTING SHIT");
			break;
		case (util.Globals.salt >=75) : 
			message.reply("i'm just about to fucking kill you");
			break;
		default : 
			message.reply(`my salt level is currently at ${util.Globals.salt}%`);
			break;
	}	
	return;
}

module.exports.help = {
	name: "salt",
	usage: "salt",
	description: "Get my current salt level (not that i'm salty anyway)"
}

			