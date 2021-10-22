const bot = require("./bot");
const { Message } = require("discord.js");

module.exports = {
    name : 'command',
    description : 'Command handler',

    /**
     * 
     * @param {bot} client 
     * @param {Message} message 
     * @param {Array} prefix 
     * @returns 
     */
    execute (client, message, prefix) {
        const [commandName,...args] = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/);
        const command = client.util.getCommand(commandName,message.guild.id);
        
        if(!command) return;

        if(!message.member.permissions.has(command.perms) && !message.member.permissions.has('ADMINISTRATOR'))
            return message.channel.send(`You do not have the required permisions to use this command\nPermissions required: ${command.disp}`);

        if(command.special_perms){
            if(!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.has(command.special_perms)))
                return message.reply(`You do not have the required permisions to use this command\nSpecial Role required: <@&${command.special_perms}>` , {"allowed_mentions" : {"roles": []}});
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
            return message.reply(reply);
        }

        try{
            command.execute(client, message, args);
        } catch (error) {
            console.log(`There was a problem executing ${command.name}:\n${error}`);
        }
    }
}