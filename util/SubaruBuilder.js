module.exports = (Subaru) => {
	//Here you can easily create shortcuts to do certain things
	try {
		Subaru.log = require('./logger.js');
		
		Subaru.playSong = require('./playSong.js');
				
		Subaru.error = (err, message) => { if (message)Subaru.log('err', `trigger: ${message.content} \n ${err}\nat ${err.stack}`); 
		else Subaru.log('err', `${err}\nat ${err.stack} \n`);}
				
		Subaru.respond = async (message, msg, embed) => {
			return new Promise((resolve,reject) => {
			if (!message.channel) {Subaru.log('err', 'Cant send message without channel'); reject();}
			message.channel.send(msg, (embed ? embed : undefined))
			.then(x => {
				x.addDestructor = (id) => {
					if (!id) return 'No author given';
					x.react('🗑');
					x.authorID = message.author.id;
					//x.authorID = id;
					Subaru.destructors.set(x.id, x);
				};
				x.addConfirm = (id) => {
					if (!id) return 'No author given';
					x.react('✅').then(() => x.react('❌'));
					x.authorID = message.author.id;
					//x.authorID = id;
					return new Promise((resolve, reject) =>{
						x.resolve = resolve;
						x.reject = reject;
						Subaru.emojiConfirms.set(x.id, x);
					});
				}
			resolve(x);})
			.catch(err =>  reject("\nAt: " + message.content + '\n' + err))
			});
		}
		
		Subaru.formatDate = (date, format) => {
			let year = date.getFullYear();
			let month = ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString());;
			let day = (date.getDate().toString().length == 1 ? '0' + date.getDate().toString() : date.getDate().toString());
			let hour = (date.getHours().toString().length == 1 ? '0' + date.getHours().toString() : date.getHours().toString());
			let minute = (date.getMinutes().toString().length == 1 ? '0' + date.getMinutes().toString() : date.getMinutes().toString());
			let seconds = (date.getSeconds().toString().length == 1 ? '0' + date.getSeconds().toString() : date.getSeconds().toString());
			
			return format.replace("yy", year).replace("mm", month).replace("dd", day).replace("hh", hour).replace("mi", minute).replace("ss", seconds);
		}
		
		Subaru.getUser = (user, collection) => {
			let str_sim = require('string-similarity');
			if (!collection.get(user.replace('<@', "").replace('!',"").replace('>', ""))) {
				let userName = (collection.array()[0].displayName ? 'displayName' : 'username');
				var match = str_sim.findBestMatch(user, collection.array().map(x => {return x[userName]}));
				if (match.bestMatch.rating > 0.3) return collection.find(userName, match.bestMatch.target); else return false;
			} else {
				return collection.get(user.replace('<@', "").replace('!',"").replace('>', ""));
			}
		}
		
		Subaru.newUser = (user) => {
			return new Promise(resolve => {
			var doc = {
				id: user.id,
				username: user.username,
				afk: false,
				points: 500, //starter
				daily: false,
				profile: {
					bg: 'default',
					text_color: '000',
					border_color: 'fff',
					bio: false
				}
			}
			if (!Subaru.USERS.get(user.id)) resolve(Subaru.USERS.setAsync(user.id, doc))
				.catch(err => {Subaru.log('err', 'Error adding user to DB: \n' + err);resolve('Error!');});
			else resolve(Subaru.USERS);
		});}
		
		Subaru.console = '= Startup ' + new Date() + ' =\n\n';
		
		console.log = (d) => {
			Subaru.console += (d + '\n').replace(/(.\[[0-9]+m)/g,'');
			process.stdout.write(d + '\n');
			let fs = require('fs-extra');
			
			if (fs.existsSync(`./${Subaru.config.logFile}`))
				Subaru.previous_log = fs.readFile(`./${Subaru.config.logFile}`);
			
			if (Subaru.config.logFile)
				require('fs-extra').writeFile(`./${Subaru.config.logFile}`, Subaru.console);
		}
		
		//Shamelessly stolen from Paradox
		Subaru.sleep = (ms) => {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
		
		//Prototypes
		Array.prototype.last = function(){
			return this[this.length - 1];
		};
		
		Array.prototype.shuffle = function(){
			let array = this;
			for (i=array.length; i > 0;){
				let t = Math.floor(Math.random() * i--);
				let o = array[i];
				array[i] = array[t];
				array[t] = o;
			}
			return array;
		}
		
		String.prototype.capitalize = function() {
			return this.charAt(0).toUpperCase() + this.slice(1);
		}
		
		//Select part of string between two strings
		String.prototype.between = function (begin, end) {
			let startIndex = 0;
			if (begin) startIndex = this.indexOf(begin) + begin.length;
			return this.substring(startIndex, end ? this.lastIndexOf(end) : undefined);
		}
		
		//Events
		process.on('unhandledRejection', err => {
			Subaru.log('warn', `Unhandled Promise Rejection: ${err}`);
		});
		
		process.on('exit', () => {
			//Subaru.log('err', 'Process crashed');
		});
		
	} catch (err) {
		console.log(err);
	}
}