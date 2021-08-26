module.exports = {
    name : 'command',
    description : 'Command handler',
    execute (client, message, prefix) {
        const [commandName,...args] = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/);
        const command = client.util.getCommand(commandName,message.guild.id);
        
        if(!command) return;

        if(!message.member.hasPermission(command.perms))
            return message.channel.send(`You do not have the required permisions to use this command\nPermissions required: ${command.disp}`);

        if(command.special_perms){
            if(!(message.member.hasPermission('ADMINISTRATOR') || message.member.roles.cache.has(command.special_perms)))
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
            command.execute(client,message,args);
        } catch (error) {
            console.log(`There was a problem executing ${command.name}:\n${error}`);
        }
    }
}