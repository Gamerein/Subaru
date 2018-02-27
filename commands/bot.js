module.exports = {
	name: 'bot',
	catagory: 'General',
	description:'Shows some juicy info about the bot',
	usage:'bot',
	
	run : async (Subaru, client, args, message) => {
		try {
			Subaru.respond(message, {embed:{
				title: client.user.username,
				thumbnail: {url: client.user.avatarURL},
				fields: [{
					name: "Guilds:",
					value: client.guilds.array().length,
					inline: true
				},{
					name: "Users:",
					value: client.users.array().length,
					inline: true
				},{
					name: "Channels:",
					value: client.channels.array().length,
					inline: true
				},{
					name: "OS:",
					value: process.platform,
					inline: true
				},{
					name: "Node:",
					value: "Node: " + process.version,
					inline: true
				},{
					name: "Memory:",
					value: (process.memoryUsage().heapUsed / Math.pow(1024, 2)).toFixed(1) + " mb",
					inline: true
				},{
					name: "Version:",
					value: Subaru.packagejson.version,
					inline: true
				},{
					name: "Discord.js:",
					value: require('../node_modules/discord.js/package.json').version,
					inline: true
				},{
					name: "Joined guild:",
					value: Subaru.formatDate( message.guild.joinedAt, "dd/mm/yy"),
					inline: true
				},{
					name: "Developer:",
					value: "LevitatingBusinessMan#0504",
					inline: true
				}],
				footer: {
					icon_url: message.author.avatarURL,
					text: message.author.username + ' | ' + message.guild.name
				}, timestamp: new Date()
				}});	
			
		} catch (err) {
			message.channel.send('An error occured :v');
			Subaru.error(err, message);
		}
	}
}