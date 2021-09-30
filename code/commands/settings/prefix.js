const { MessageEmbed } = require('discord.js');
const defaultPrefix = require('../../../config.json').prefix;
const bot = require('../../main/bot')

module.exports = {
    name : 'prefix',
    aliases : ['setprefix'],
    description : 'Check prefix or set custom prefix for me in this server',
    usage : '[new prefix]',
    perms : ['MANAGE_GUILD'],
    disp : ['Manage Server'],
    category : 'settings',

    /**
     * 
     * @param {bot} client 
     * @param {*} message 
     * @param {*} args 
     * @returns 
     */
    async execute(client,message,args){
        const prefix = client.util.getPrefix(message.guild.id);

        let filter,collected;

        const preff = new MessageEmbed()
            .setColor('#B46547')
            .setTitle('Prefix')
            .setDescription(`My prefix for this server is \`${prefix}\`\nYou can run commands by either doing \`${prefix}command-name\` or by doing ${client.user.tag} command-name`)
            .setFooter(`At your service, ${message.member.displayName}`, message.author.displayAvatarURL({dynamic : true}))

        if(!args[0]) return message.channel.send(preff);

        if(!message.member.permissions.has('MANAGE_SERVER')) return message.channel.send('You do not have the permission to change the prefix');

        let text = args.join(' ');
        text = text.trim();

        if(text.length>'20') return message.channel.send("Sorry 20 is the max number of characters I support for a prefix");

        if(text=='reset' || text =='`') {
            if(!(client.cache.config[message.guild.id] && client.cache.config[message.guild.id].prefix)) return message.channel.send('You don\'t have a custom prefix to reset');
            const pre = new MessageEmbed()
            .setColor('#B46547')
            .setTitle('Prefix')
            .setDescription(`Do you want to reset the prefix to '${defaultPrefix}'?`)
            .setFooter(`At your service, ${message.member.displayName}`, message.author.displayAvatarURL({dynamic : true}))
            message.channel.send(pre);
            const acceptable = ['yes','y','n','no']
            filter = m => (m.author.id == message.author.id && acceptable.includes(m.content.toLowerCase()));
            try {
                collected = await message.channel.awaitMessages(filter,{
                    time : '15000',
                    max : '1',
                    errors : ['time']
                })
            } catch (error) {
                console.log(error);
                return message.channel.send('No valid input provided in time, terminating command');
            }

            let inp = collected.first().content.toLowerCase();

            if(inp == 'no' || inp == 'n') return message.channel.send("Okay terminating the command");

            if (client.cache.config[message.guild.id] && client.cache.config[message.guild.id].prefix)
                delete client.cache.config[message.guild.id].prefix;
            client.firebase.update_config(message.guild.id)
            message.channel.send("The prefix has been reset!");
            return;
        }

        const pre = new MessageEmbed()
            .setColor('#B46547')
            .setTitle('Prefix')
            .setDescription(`Do you want to change the prefix from "${prefix}" to "${text}"?`)
            .setFooter(`At your service, ${message.member.displayName}`, message.author.displayAvatarURL({dynamic : true}))

        message.channel.send(pre);

        const acceptable = ['yes','y','n','no']
        filter = m => (m.author.id == message.author.id &&acceptable.includes(m.content.toLowerCase()));
        try {
            collected = await message.channel.awaitMessages(filter,{
                time : '15000',
                max : '1',
                errors : ['time']
            })
        } catch (error) {
            return message.channel.send('No valid input provided in time, terminating command');
        }
        
        let inp = collected.first().content.toLowerCase();

        if(inp == 'no' || inp == 'n') return message.channel.send("Okay terminating the command");

        if(!client.cache.config[message.guild.id]) client.cache.config[message.guild.id] = {}
        client.cache.config[message.guild.id].prefix = text;
        client.firebase.update_config(message.guild.id)
        message.channel.send("The new prefix has been set!");
    }
};