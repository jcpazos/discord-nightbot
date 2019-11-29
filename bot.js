var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
//const Promise = require('bluebird');
const AppDAO = require('./dao');
const CommandRepository = require('./command_repository');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


const dao = new AppDAO('./database.sqlite3');
const nightBotData = { name: 'Test', value: 'test passed!' };
const commandRepo = new CommandRepository(dao);

commandRepo.createTable()
.then(() => commandRepo.create(nightBotData.name, nightBotData.value))
.then((data) => {
  console.log("created command with id: " + data.id);
})
.then(() => commandRepo.getByName(nightBotData.name))
.then((command) => {
  console.log(`\nRetrieved command from database`);
  console.log(`command name = ${command.name}`);
  console.log(`command value = ${command.value}`);
})
.catch((err) => {
  console.log('Error: ');
  console.log(JSON.stringify(err));
});

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split('`').splice(1);
        var cmd = message.substring(1).split(' ')[0];

        var commandName = args[0];
        var commandValue = args[2];

        commandRepo.getByName(cmd).then(function (command) {
            bot.sendMessage({
                    to: channelID,
                    message: command.value
                });
        }).catch(function (err) {
            console.log('Command not found!: ');
            console.log(JSON.stringify(err));
        });

        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'newcommand':
                commandRepo.create(commandName, commandValue).then((data) => {
                    console.log("Created command with id: " + data.id);
                    bot.sendMessage({
                        to: channelID,
                        message: 'Command ' + commandName + ' created.'
                    });
                }).catch(function (err) {
                    console.log("Error when creating the command, does it already exist?");
                    bot.sendMessage({
                        to: channelID,
                        message: 'Command ' + commandName + ' could not be created. Does it already exist?'
                    });
                });
                break;
            case 'deletecommand':
                commandRepo.delete(commandName).then((data) => {
                    console.log("Deleted command with id: " + data.id);
                    bot.sendMessage({
                        to: channelID,
                        message: 'Command ' + commandName + ' deleted.'
                    });
                }).catch(function (err) {
                    console.log("Error when deleting the command, does it exist?");
                    bot.sendMessage({
                        to: channelID,
                        message: 'Command ' + commandName + ' could not be deleted. Does it exist?'
                    });
                });
                break;
            case 'updatecommand':
                let command = {commandName, commandValue};
                commandRepo.update(command).then((data) => {
                    console.log("Updated command with id: " + data.id);
                    bot.sendMessage({
                        to: channelID,
                        message: 'Command ' + commandName + ' updated.'
                    });
                }).catch(function (err) {
                    console.log("Error when updating the command, does it exist?");
                    bot.sendMessage({
                        to: channelID,
                        message: 'Command ' + commandName + ' could not be updated. Does it exist?'
                    });
                });
                break;
            // Just add any case commands if you want to..
         }
     }
});
