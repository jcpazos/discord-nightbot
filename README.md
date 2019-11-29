# discord-nightbot
Simple Discord bot to simulate Twitch nightbots, like making commands, posting periodic messages, etc.

Requires the npm packages sqlite 3, winston, discord, and bluebird.

Once dependencies have been installed, you need to generate your own discord bot for your server and make an auth.json file with its token, a quick setup can be found here: 
https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/

Usage
-----------

Make a new command with:

    !newcommand `commandName` `commandText`
    
Then simply type `!commandName` for the bot to reply with the specified text.

Update an existing command with:

    !updatecommand `commandName` `commandText`
  
Delete an existing command with:

    !deletecommand `commandName`
    
   
Other features like periodic messaging are in development.
