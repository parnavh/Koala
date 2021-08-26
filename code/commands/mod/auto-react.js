const { Message } = require("discord.js");
const bot = require('../../main/bot')
const { parse } = require('twemoji-parser')

module.exports = {
    name : 'auto-react',
    aliases : ['ar'],
    description : 'Autoreacts a message with predetermined reactions',
    args : false,
    perms : ['MANAGE_EMOJIS'],
    disp: ['Manage Emojis'],
    category : 'mod',

    /** 
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
    */
    async execute(client,message,args){
        message.channel.send('Mention the channel:')

        const filter = m => (m.author.id == message.author.id);
        let collected
        try {
            collected = await message.channel.awaitMessages(filter,{
                time : '15000',
                max : '1',
                errors : ['time']
            })
        } catch (error) {
            return message.channel.send("No valid input provided in time, Terminating the command");
        }

        var channel_inp = collected.first().mentions.channels.first()
        
        if(!channel_inp){
            return message.channel.send("No valid input provided, Terminating the command");
        }
        message.channel.send('Send the emojis which you want me to react:')
        
        try {
            collected = await message.channel.awaitMessages(filter,{
                time : '30000',
                max : '1',
                errors : ['time']
            })
        } catch (error) {
            return message.channel.send("No valid input provided, Terminating the command");
        }

        let raw = collected.first().content
        let a_emoji = raw.match(/<a?:.+?:\d+>/g)
        let i = -1
        if(a_emoji)
            a_emoji.forEach( e => {
                i++
                if(!message.guild.emojis.cache.find(f => f.identifier == e.substring(1, e.length - 1))) {
                    a_emoji.splice(i, 1)
                    i--
                    return;
                }
            })
        let s_emoji = parse(raw)
        i = -1
        if(s_emoji)
            s_emoji.forEach( e => {
                i++
                s_emoji[i] = e.text
            })
        
        let emojis = []
        if(a_emoji)
            emojis = [...emojis, ...a_emoji]

        if(s_emoji)
            emojis = [...emojis, ...s_emoji]
            
        if(emojis.length == 0) return message.channel.send("I couldn't identify any emojis, Terminating the command")

        if(!client.cache.config[message.guild.id]) 
            client.cache.config[message.guild.id] = {}
    
        if(!client.cache.config[message.guild.id].reaction_channels) 
            client.cache.config[message.guild.id].reaction_channels = []

        if(!client.cache.config[message.guild.id].reaction_emojis)
            client.cache.config[message.guild.id].reaction_emojis = {}
        
        client.cache.config[message.guild.id].reaction_channels.push(channel_inp.id)
        client.cache.config[message.guild.id].reaction_emojis[channel_inp.id] = emojis

        client.firebase.update_config(message.guild.id)
    }
};