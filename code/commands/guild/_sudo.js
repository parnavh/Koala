const { owner, sudo_guilds } = require('../../../config.json');

module.exports = {
    name : 'sudo',
    description : 'Handles all the sudo commands',
    guild : sudo_guilds,
    category : 'guild',
    execute (client, message, args) {
        const commandName = args.shift();
        const command = client.sudo.get(commandName) || client.sudo.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command) return;
        if(message.member.id != owner) return message.reply("This is a Bot owner only command");
        command.execute(client,message,args);
    }
}