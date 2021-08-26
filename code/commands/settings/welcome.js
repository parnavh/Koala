const { MessageEmbed } = require('discord.js');

async function awaitResponse (channel, filter) {
    var collected;
    try {
        collected = await channel.awaitMessages(filter,{
            time : '15000',
            max : '1',
            errors : ['time']
        }) 
    } catch (err) {
        channel.send('No valid input provided, terminating command');
        return false;
    }
    return collected.first()
}

module.exports = {
    name : 'welcome',
    aliases : ['setwelcome','greet','greeting'],
    description : 'A command which lets a admin set the welcome message for a new user',
    usage : '[welcome message]',
    args : false,
    perms : ['MANAGE_GUILD'],
    disp : ['Manage Server'],
    category : 'settings',

    
    async execute(client,message,args){
        const r = ['remove', 'reset', 'delete']
        if(r.includes(args[0])) {
            if( !(client.cache.config[message.guild.id] && client.cache.config[message.guild.id].welcome_channel) ) return message.channel.send(
                client.util.getEmbed(message, "Welcome Message Config", "There is no welcome message set to be removed")
            )
            client.util.getEmbed(message, "Welcome Message Config", "Are you sure you want to remove the welcome message? (yes/no)")
            const acceptable = ['yes','y','n','no']
            filter = m => (m.author.id == message.author.id && acceptable.includes(m.content.toLowerCase()));
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

            if(inp == 'no' || inp == 'n') return message.channel.send(client.util.getEmbed(message, "Welcome Message Config", "Okay, Terminating the command"));

        }
        const where = new MessageEmbed()
            .setColor('#B46547')
            .setTitle('Welcome message setup')
            .setDescription(`Where do you want the message to be sent?\n1.\u200b In the server or \n2. As a personal message?`)
            .setFooter(`At your service, ${message.member.displayName}`, message.author.displayAvatarURL({dynamic : true}))

        const mentionchannel = new MessageEmbed()
            .setColor('#B46547')
            .setTitle('Welcome message setup')
            .setDescription(`Please mention the channel that you want to send the welcome message in`)
            .setFooter(`At your service, ${message.member.displayName}`, message.author.displayAvatarURL({dynamic : true}))

        const whatmessage = new MessageEmbed()
            .setColor('#B46547')
            .setTitle('Welcome message setup')
            .setDescription(`Please provide the welcome message for this server, insert <@> where you want the user to be mentioned`)
            .setFooter(`At your service, ${message.member.displayName}`, message.author.displayAvatarURL({dynamic : true}));

        let text = '', cha, inp, filter;
        
        if(!args[0]){
            message.channel.send(whatmessage);

            filter = m => (m.author.id == message.author.id);
            inp = awaitResponse(message.channel,filter);
            if(!inp) return;

            text = inp.first().content.toLowerCase();
        } else {
            text = args.join(' ');
        }

        message.channel.send(where);
        const acceptable = ['1','2','server','dm','pm']
        filter = m => (m.author.id==message.author.id && acceptable.includes(m.content));
        inp = await awaitResponse(message.channel,filter)
        if(!inp) return;
        inp = inp.content.toLowerCase();

        if(inp == '1' || inp == 'server'){
            message.channel.send(mentionchannel);

            filter = m => (m.author.id == message.author.id)

            inp = await awaitResponse(message.channel,filter);

            if(!inp) return;

            if(inp.mentions.channels.first()){
                cha = inp.mentions.channels.first().id;
            } else {
                return message.channel.send(`No valid input provided, terminating command`);
            }
        } else {
            cha = 'dm'
        }

        if(!client.cache.config[message.guild.id]) client.cache.config[message.guild.id] = {}
        client.cache.config[message.guild.id].welcome_text = text;
        client.cache.config[message.guild.id].welcome_channel = cha;
        client.firebase.update_config(message.guild.id)

        message.channel.send('Welcome message has been set 👍');
        return;
    }
};