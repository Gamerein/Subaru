module.exports = {
	name: 'neko',
	catagory: 'Image',
	description: 'Get a neko',
	usage: 'neko',
	
	run : async (Subaru, client, args, message) => {
		try {
			
			const request = require("axios");
			request.get('https://nekos.life/api/v2/img/neko').then(x => Subaru.respond(message, {embed:{
				image: x.data,
				color: 0x6600cc,
				footer:{
					text: 'powered by https://nekos.life'
				}
			}}));
			
		} catch (err) {
			message.channel.send('An error occured :v');
			Subaru.error(err, message);
		}
	}
}

